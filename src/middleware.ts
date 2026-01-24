import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_ALLOWED_ORIGINS = 'https://console.svc.plus,http://localhost:3000'

function parseAllowedOrigins() {
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function resolveAllowedOrigin(origin: string | null, allowed: string[]) {
  if (!origin) return null
  if (allowed.includes('*')) return '*'
  return allowed.includes(origin) ? origin : null
}

function applyCorsHeaders(response: NextResponse, origin: string | null) {
  if (!origin) return
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-Account-Session',
  )
  response.headers.set('Vary', 'Origin')
}

export function middleware(request: NextRequest) {
  const allowedOrigins = parseAllowedOrigins()
  const originHeader = request.headers.get('origin')
  const allowedOrigin = resolveAllowedOrigin(originHeader, allowedOrigins)

  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    applyCorsHeaders(response, allowedOrigin)
    return response
  }

  const response = NextResponse.next()
  applyCorsHeaders(response, allowedOrigin)
  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
