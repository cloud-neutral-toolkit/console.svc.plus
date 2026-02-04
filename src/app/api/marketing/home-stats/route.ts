export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { getInternalServiceToken } from "@server/internalServiceAuth";
import { getAccountServiceBaseUrl } from "@server/serviceConfig";

const CLOUDFLARE_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const ONE_HOUR_MS = 60 * 60 * 1000;

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

function jsonResponse(payload: HomeStatsPayload): NextResponse<HomeStatsPayload> {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
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

  const query = `
    query GetWebAnalyticsVisits(
      $accountTag: string!,
      $siteTag: string!,
      $dailySince: Time!,
      $weeklySince: Time!,
      $monthlySince: Time!,
      $until: Time!
    ) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          daily: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: $siteTag, datetime_geq: $dailySince, datetime_lt: $until }
          ) {
            sum {
              visits
            }
          }
          weekly: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: $siteTag, datetime_geq: $weeklySince, datetime_lt: $until }
          ) {
            sum {
              visits
            }
          }
          monthly: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: { siteTag: $siteTag, datetime_geq: $monthlySince, datetime_lt: $until }
          ) {
            sum {
              visits
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(CLOUDFLARE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          accountTag: accountId,
          siteTag,
          dailySince: dailySince.toISOString(),
          weeklySince: weeklySince.toISOString(),
          monthlySince: monthlySince.toISOString(),
          until: now.toISOString(),
        },
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          data?: {
            viewer?: {
              accounts?: Array<{
                daily?: Array<{ sum?: { visits?: number } }>;
                weekly?: Array<{ sum?: { visits?: number } }>;
                monthly?: Array<{ sum?: { visits?: number } }>;
              }>;
            };
          };
          errors?: Array<{ message?: string }>;
        }
      | null;

    if (!response.ok || !payload || payload.errors?.length) {
      return { daily: null, weekly: null, monthly: null };
    }

    const account = payload.data?.viewer?.accounts?.[0];
    return {
      daily: asNumber(account?.daily?.[0]?.sum?.visits ?? null),
      weekly: asNumber(account?.weekly?.[0]?.sum?.visits ?? null),
      monthly: asNumber(account?.monthly?.[0]?.sum?.visits ?? null),
    };
  } catch (error) {
    console.error("Failed to fetch Cloudflare web analytics", error);
    return { daily: null, weekly: null, monthly: null };
  }
}

export async function GET() {
  const now = Date.now();
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

  return jsonResponse(payload);
}

