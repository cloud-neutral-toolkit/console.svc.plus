export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getAccountServiceApiBaseUrl } from '@server/serviceConfig'
import { evaluateAccountAdminAccess } from '@server/account/adminAccess'
import { getAccountSession } from '@server/account/session'
import type { AccountUserRole } from '@server/account/session'

const ACCOUNT_API_BASE = getAccountServiceApiBaseUrl()
const REQUIRED_ROLES: AccountUserRole[] = ['admin']
const WRITE_PERMISSIONS = ['admin.settings.write']

type ErrorPayload = {
  error: string
}

export async function POST(request: NextRequest) {
  const session = await getAccountSession(request)
  const user = session.user

  if (!user || !session.token) {
    return NextResponse.json<ErrorPayload>({ error: 'unauthenticated' }, { status: 401 })
  }

  const access = await evaluateAccountAdminAccess(user, {
    roles: REQUIRED_ROLES,
    permissions: WRITE_PERMISSIONS,
    rootOnly: true,
  })
  if (!access.allowed) {
    return NextResponse.json<ErrorPayload>({ error: access.reason ?? 'forbidden' }, { status: 403 })
  }

  const headers = new Headers({
    Authorization: `Bearer ${session.token}`,
    Accept: 'application/json',
  })

  const body = await request.text()
  const contentType = request.headers.get('content-type') ?? 'application/json'
  headers.set('Content-Type', contentType)

  try {
    const response = await fetch(`${ACCOUNT_API_BASE}/admin/sandbox/bind`, {
      method: 'POST',
      headers,
      body,
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
    console.error('Failed to proxy sandbox bind', error)
    return NextResponse.json<ErrorPayload>({ error: 'upstream_unreachable' }, { status: 502 })
  }
}
