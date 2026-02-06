export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getAccountServiceApiBaseUrl } from '@server/serviceConfig'
import { getAccountSession, userHasRole } from '@server/account/session'
import type { AccountUserRole } from '@server/account/session'

const ACCOUNT_API_BASE = getAccountServiceApiBaseUrl()
const REQUIRED_ROLES: AccountUserRole[] = ['admin']

type ErrorPayload = {
  error: string
}

function isAllowedRootEmail(email?: string): boolean {
  return email?.trim().toLowerCase() === 'admin@svc.plus'
}

export async function GET(request: NextRequest) {
  const session = await getAccountSession(request)
  const user = session.user

  if (!user || !session.token) {
    return NextResponse.json<ErrorPayload>({ error: 'unauthenticated' }, { status: 401 })
  }

  if (!(await userHasRole(user, REQUIRED_ROLES))) {
    return NextResponse.json<ErrorPayload>({ error: 'forbidden' }, { status: 403 })
  }

  if (!isAllowedRootEmail(user.email)) {
    return NextResponse.json<ErrorPayload>({ error: 'root_only' }, { status: 403 })
  }

  const response = await fetch(`${ACCOUNT_API_BASE}/admin/sandbox/binding`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session.token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)
  if (payload === null) {
    return NextResponse.json<ErrorPayload>({ error: 'invalid_response' }, { status: 502 })
  }

  return NextResponse.json(payload, { status: response.status })
}

