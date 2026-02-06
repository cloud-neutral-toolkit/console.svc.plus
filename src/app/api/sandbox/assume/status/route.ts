export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const ROOT_BACKUP_COOKIE = 'xc_session_root'

export async function GET(request: NextRequest) {
  const isAssuming = Boolean(request.cookies.get(ROOT_BACKUP_COOKIE)?.value?.trim())
  return NextResponse.json({ isAssuming, target: isAssuming ? 'sandbox@svc.plus' : '' })
}

