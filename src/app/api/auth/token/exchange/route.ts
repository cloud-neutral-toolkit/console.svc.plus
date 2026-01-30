import { NextRequest, NextResponse } from 'next/server'
import { applySessionCookie, deriveMaxAgeFromExpires } from '@lib/authGateway'
import { getAccountServiceApiBaseUrl } from '@server/serviceConfig'

const ACCOUNT_API_BASE = getAccountServiceApiBaseUrl()

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        const { publicToken, userId, email, role } = payload

        if (!publicToken || !userId || !email) {
            return NextResponse.json({ success: false, error: 'invalid_request' }, { status: 400 })
        }

        const response = await fetch(`${ACCOUNT_API_BASE}/token/exchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                public_token: publicToken,
                user_id: userId,
                email,
                roles: role,
            }),
            cache: 'no-store',
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json({ success: false, error: errorData.error || 'exchange_failed' }, { status: response.status })
        }

        const data = await response.json()
        const { access_token, expires_in } = data

        const result = NextResponse.json({ success: true })
        // If backend returns expires_in (seconds), use it; otherwise derive from expiresAt if it exists
        const maxAge = typeof expires_in === 'number' ? expires_in : deriveMaxAgeFromExpires(data.expiresAt)
        applySessionCookie(result, access_token, maxAge)

        return result
    } catch (error) {
        console.error('Token exchange proxy failed', error)
        return NextResponse.json({ success: false, error: 'internal_error' }, { status: 500 })
    }
}
