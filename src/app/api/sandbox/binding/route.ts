export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getAccountServiceApiBaseUrl } from '@server/serviceConfig'
import { getAccountSession } from '@server/account/session'
import { buildInternalServiceHeaders, isServiceTokenConfigured } from '@server/internalServiceAuth'

const ACCOUNT_API_BASE = getAccountServiceApiBaseUrl()

type ErrorPayload = {
  error: string
}

export async function GET(request: NextRequest) {
  const session = await getAccountSession(request)
  const canUseInternalToken = isServiceTokenConfigured()
  if (!session.token && !canUseInternalToken) {
    return NextResponse.json<ErrorPayload>({ error: 'unauthenticated' }, { status: 401 })
  }

  try {
    const headers = session.token
      ? new Headers({
          Authorization: `Bearer ${session.token}`,
          Accept: 'application/json',
        })
      : buildInternalServiceHeaders({
          Accept: 'application/json',
        })

    const response = await fetch(`${ACCOUNT_API_BASE}/sandbox/binding`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().includes('application/json')) {
      const text = await response.text().catch(() => '')
      return NextResponse.json(
        { error: 'upstream_non_json', upstreamStatus: response.status, upstreamBody: text.slice(0, 2048) } as any,
        { status: 502 },
      )
    }

    const payload = await response.json().catch(() => null)
    if (payload === null) {
      return NextResponse.json<ErrorPayload>({ error: 'invalid_response' }, { status: 502 })
    }
    return NextResponse.json(payload, { status: response.status })
  } catch (error) {
    console.error('Failed to proxy sandbox binding (public)', error)
    return NextResponse.json<ErrorPayload>({ error: 'upstream_unreachable' }, { status: 502 })
  }
}
