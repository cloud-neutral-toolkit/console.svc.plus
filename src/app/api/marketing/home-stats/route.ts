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
  // Cache for 1 hour (3600s) as requested for hourly updates on users/daily visits.
  const sMaxAge = 3600;
  const staleWhileRevalidate = 600;

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
        rumPageloadEventsAdaptiveGroups?: Array<{ sum?: { visits?: number } }>;
      }>;
      zones?: Array<{
        httpRequests1dGroups?: Array<{
          dimensions?: { date?: string };
          sum?: { requests?: number; pageViews?: number };
          uniq?: { uniques?: number };
        }>;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function escapeGraphqlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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

async function fetchCloudflareVisits(): Promise<VisitsSummary> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const zoneTag = process.env.CLOUDFLARE_ZONE_TAG?.trim();

  // If we don't have the zone tag, we can't query zone analytics
  if (!apiToken || !zoneTag) {
    return { daily: null, weekly: null, monthly: null };
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${escapeGraphqlString(zoneTag)}" }) {
          httpRequests1dGroups(
            limit: 30
            filter: { date_geq: "${thirtyDaysAgo}", date_lt: "${today}" }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            uniq { uniques }
          }
        }
      }
    }
  `;

  try {
    const payload = await queryCloudflareGraphql(apiToken, query);
    const groups = payload?.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];

    // Sort groups just in case
    groups.sort((a, b) =>
      (a.dimensions?.date ?? "").localeCompare(b.dimensions?.date ?? "")
    );

    let daily = null;
    let weekly = 0;
    let monthly = 0;

    if (groups.length > 0) {
      // The last complete day data (yesterday)
      const lastEntry = groups[groups.length - 1];
      daily = asNumber(lastEntry?.uniq?.uniques);
    }

    const reverseGroups = [...groups].reverse();
    // Summing uniques is an approximation for longer periods as distinct counts over larger windows aren't strictly additive
    // But it's usually "good enough" for marketing stats if true unique data isn't available
    monthly = reverseGroups.reduce((acc, entry) => acc + (entry?.uniq?.uniques ?? 0), 0);
    // Weekly: last 7 days
    weekly = reverseGroups.slice(0, 7).reduce((acc, entry) => acc + (entry?.uniq?.uniques ?? 0), 0);

    return {
      daily: daily ?? null,
      weekly: weekly > 0 ? weekly : null,
      monthly: monthly > 0 ? monthly : null,
    };
  } catch (error) {
    console.error("Failed to fetch Cloudflare zone analytics", error);
    return { daily: null, weekly: null, monthly: null };
  }
}

export async function GET() {
  const now = Date.now();
  // User requested hourly updates for registered users and daily visits.
  // We set the cache TTL to 1 hour to satisfy the most frequent update requirement.
  if (cachedPayload && now - cachedAt < ONE_HOUR_MS) {
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
  // Set cache TTL to 1 hour
  cachedTtlMs = ONE_HOUR_MS;

  return jsonResponse(payload);
}
