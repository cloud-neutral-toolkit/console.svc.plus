import { NextResponse } from 'next/server'

import { loadRuntimeConfig } from '@server/runtime-loader'

function resolveReleaseImageMetadata(frontendImage: string | undefined) {
  const releaseImageRef = frontendImage?.trim() || null
  const releaseImageTagMatch = releaseImageRef?.match(/:([^:@]+)$/)
  const releaseImageTag = releaseImageTagMatch?.[1] ?? null
  const releaseCommit = releaseImageTag && /^[0-9a-f]{7,40}$/i.test(releaseImageTag) ? releaseImageTag : null

  return {
    releaseImageRef,
    releaseImageTag,
    releaseCommit,
  }
}

export async function GET(request: Request) {
  const hostnameHeader = request.headers.get('host') ?? undefined
  const runtimeConfig = loadRuntimeConfig({ hostname: hostnameHeader })
  const releaseMetadata = resolveReleaseImageMetadata(process.env.FRONTEND_IMAGE)

  const payload = {
    status: 'ok' as const,
    environment: runtimeConfig.environment,
    region: runtimeConfig.region,
    apiBaseUrl: runtimeConfig.apiBaseUrl,
    authUrl: runtimeConfig.authUrl,
    dashboardUrl: runtimeConfig.dashboardUrl,
    logLevel: runtimeConfig.logLevel,
    ...releaseMetadata,
  }

  console.info('[runtime-config] /api/ping resolved config snippet', payload)

  return NextResponse.json(payload)
}
