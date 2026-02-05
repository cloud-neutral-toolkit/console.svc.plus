export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { getAccountServiceApiBaseUrl } from '@server/serviceConfig'
import { getAccountSession, userHasRole } from '@server/account/session'
import type { AccountUserRole } from '@server/account/session'

const ACCOUNT_API_BASE = getAccountServiceApiBaseUrl()
const REQUIRED_ROLES: AccountUserRole[] = ['admin']

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type ErrorPayload = {
  error: string
}

type CreateUserBody = {
  email?: unknown
  uuid?: unknown
  groups?: unknown
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeGroups(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null
  }
  const result: string[] = []
  for (const item of value) {
    const normalized = normalizeString(item)
    if (!normalized) {
      continue
    }
    result.push(normalized)
  }
  if (result.length === 0) {
    return null
  }
  return Array.from(new Set(result))
}

function isAllowedRootEmail(email?: string): boolean {
  return email?.trim().toLowerCase() === 'admin@svc.plus'
}

export async function POST(request: NextRequest) {
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

  const body = (await request.json().catch(() => null)) as CreateUserBody | null
  if (!body) {
    return NextResponse.json<ErrorPayload>({ error: 'invalid_body' }, { status: 400 })
  }

  const email = normalizeString(body.email)
  const uuid = normalizeString(body.uuid)
  const groups = normalizeGroups(body.groups)

  if (!email || !uuid || !groups) {
    return NextResponse.json<ErrorPayload>({ error: 'invalid_body' }, { status: 400 })
  }

  if (!UUID_PATTERN.test(uuid)) {
    return NextResponse.json<ErrorPayload>({ error: 'invalid_uuid' }, { status: 400 })
  }

  const response = await fetch(`${ACCOUNT_API_BASE}/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      uuid,
      groups,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)
  if (payload === null) {
    return NextResponse.json<ErrorPayload>({ error: 'invalid_response' }, { status: 502 })
  }

  return NextResponse.json(payload, { status: response.status })
}
