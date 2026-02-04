export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { getInternalServiceToken } from "@server/internalServiceAuth";
import { getAccountServiceBaseUrl } from "@server/serviceConfig";

const CLOUDFLARE_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const ONE_HOUR_MS = 60 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

type VisitsSummary = {
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
};

type HomeStatsPayload = {
  registeredUsers: number | null;
  visits: VisitsSummary;
  updatedAt: string;
};

let cachedPayload: HomeStatsPayload | null = null;
let cachedAt = 0;
let cachedTtlMs = FIVE_MINUTES_MS;

function hasAnyVisits(visits: VisitsSummary): boolean {
  return (
    typeof visits.daily === "number" ||
    typeof visits.weekly === "number" ||
    typeof visits.monthly === "number"
  );
}

function shouldUseLongCache(payload: HomeStatsPayload): boolean {
  return payload.registeredUsers !== null && hasAnyVisits(payload.visits);
}

function jsonResponse(payload: HomeStatsPayload): NextResponse<HomeStatsPayload> {
  const isComplete = shouldUseLongCache(payload);
  const sMaxAge = isComplete ? 3600 : 300;
  const staleWhileRevalidate = isComplete ? 300 : 60;

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    },
  });
}

function asNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, value);
}

async function fetchRegisteredUsers(): Promise<number | null> {
  const serviceToken = getInternalServiceToken();
  if (!serviceToken) {
    return null;
  }

  const accountServiceBaseUrl = getAccountServiceBaseUrl();
  const endpoint = `${accountServiceBaseUrl}/api/internal/public-overview`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Service-Token": serviceToken,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | { registeredUsers?: unknown }
      | null;
    return asNumber(payload?.registeredUsers ?? null);
  } catch (error) {
    console.error("Failed to fetch registered users overview", error);
    return null;
  }
}

type CloudflareGraphqlPayload = {
  data?: {
    viewer?: {
      accounts?: Array<{
        daily?: Array<{ sum?: { visits?: number } }>;
        weekly?: Array<{ sum?: { visits?: number } }>;
        monthly?: Array<{ sum?: { visits?: number } }>;
      }>;
      zones?: Array<{
        daily?: Array<{ sum?: { visits?: number } }>;
        weekly?: Array<{ sum?: { visits?: number } }>;
        monthly?: Array<{ sum?: { visits?: number } }>;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function escapeGraphqlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function extractVisits(payload: CloudflareGraphqlPayload | null): VisitsSummary {
  const account =
    payload?.data?.viewer?.accounts?.[0] ?? payload?.data?.viewer?.zones?.[0] ?? null;
  return {
    daily: asNumber(account?.daily?.[0]?.sum?.visits ?? null),
    weekly: asNumber(account?.weekly?.[0]?.sum?.visits ?? null),
    monthly: asNumber(account?.monthly?.[0]?.sum?.visits ?? null),
  };
}

async function queryCloudflareGraphql(
  apiToken: string,
  query: string,
): Promise<CloudflareGraphqlPayload | null> {
  const response = await fetch(CLOUDFLARE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as CloudflareGraphqlPayload | null;
  if (!response.ok) {
    console.warn("Cloudflare graphql request failed", response.status);
    return null;
  }
  if (!payload) {
    return null;
  }
  if (payload.errors?.length) {
    console.warn(
      "Cloudflare graphql errors",
      payload.errors.map((entry) => entry.message).filter(Boolean),
    );
  }
  return payload;
}

async function resolveZoneTagFromSiteTag(
  apiToken: string,
  accountId: string,
  siteTag: string,
): Promise<string | null> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/rum/site_info/list?page=1&per_page=100`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json().catch(() => null)) as
      | {
          result?: Array<{
            siteTag?: string;
            site_tag?: string;
            zoneTag?: string;
            zone_tag?: string;
          }>;
        }
      | null;
    const sites = payload?.result ?? [];
    const match = sites.find((entry) => {
      const currentSiteTag = entry.siteTag ?? entry.site_tag;
      return typeof currentSiteTag === "string" && currentSiteTag === siteTag;
    });
    const zoneTag = match?.zoneTag ?? match?.zone_tag;
    return typeof zoneTag === "string" && zoneTag.trim().length > 0
      ? zoneTag.trim()
      : null;
  } catch (error) {
    console.warn("Failed to resolve Cloudflare zone tag from site tag", error);
    return null;
  }
}

async function fetchCloudflareVisits(): Promise<VisitsSummary> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const siteTag = process.env.CLOUDFLARE_WEB_ANALYTICS_SITE_TAG?.trim();

  if (!apiToken || !accountId || !siteTag) {
    return { daily: null, weekly: null, monthly: null };
  }

  const now = new Date();
  const dailySince = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weeklySince = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthlySince = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const accountTag = escapeGraphqlString(accountId);
  const escapedSiteTag = escapeGraphqlString(siteTag);
  const until = now.toISOString();
  const dailyFrom = dailySince.toISOString();
  const weeklyFrom = weeklySince.toISOString();
  const monthlyFrom = monthlySince.toISOString();

  const rumQuery = `
    query {
      viewer {
        accounts(filter: { accountTag: "${accountTag}" }) {
          daily: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: "${escapedSiteTag}", datetime_geq: "${dailyFrom}", datetime_lt: "${until}" }
          ) { sum { visits } }
          weekly: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: "${escapedSiteTag}", datetime_geq: "${weeklyFrom}", datetime_lt: "${until}" }
          ) { sum { visits } }
          monthly: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: "${escapedSiteTag}", datetime_geq: "${monthlyFrom}", datetime_lt: "${until}" }
          ) { sum { visits } }
        }
      }
    }
  `;

  try {
    const rumPayload = await queryCloudflareGraphql(apiToken, rumQuery);
    const rumVisits = extractVisits(rumPayload);
    if (hasAnyVisits(rumVisits)) {
      return rumVisits;
    }

    const zoneTag =
      process.env.CLOUDFLARE_ZONE_TAG?.trim() ??
      (await resolveZoneTagFromSiteTag(apiToken, accountId, siteTag));

    if (!zoneTag) {
      return rumVisits;
    }

    const escapedZoneTag = escapeGraphqlString(zoneTag);
    const zoneQuery = `
      query {
        viewer {
          zones(filter: { zoneTag: "${escapedZoneTag}" }) {
            daily: httpRequestsAdaptiveGroups(
              limit: 1
              filter: { datetime_geq: "${dailyFrom}", datetime_lt: "${until}" }
            ) { sum { visits } }
            weekly: httpRequestsAdaptiveGroups(
              limit: 1
              filter: { datetime_geq: "${weeklyFrom}", datetime_lt: "${until}" }
            ) { sum { visits } }
            monthly: httpRequestsAdaptiveGroups(
              limit: 1
              filter: { datetime_geq: "${monthlyFrom}", datetime_lt: "${until}" }
            ) { sum { visits } }
          }
        }
      }
    `;

    const zonePayload = await queryCloudflareGraphql(apiToken, zoneQuery);
    const zoneVisits = extractVisits(zonePayload);
    return hasAnyVisits(zoneVisits) ? zoneVisits : rumVisits;
  } catch (error) {
    console.error("Failed to fetch Cloudflare web analytics", error);
    return { daily: null, weekly: null, monthly: null };
  }
}

export async function GET() {
  const now = Date.now();
  if (cachedPayload && now - cachedAt < cachedTtlMs) {
    return jsonResponse(cachedPayload);
  }

  const [registeredUsers, visits] = await Promise.all([
    fetchRegisteredUsers(),
    fetchCloudflareVisits(),
  ]);

  const payload: HomeStatsPayload = {
    registeredUsers,
    visits,
    updatedAt: new Date().toISOString(),
  };

  cachedPayload = payload;
  cachedAt = now;
  cachedTtlMs = shouldUseLongCache(payload) ? ONE_HOUR_MS : FIVE_MINUTES_MS;

  return jsonResponse(payload);
}
