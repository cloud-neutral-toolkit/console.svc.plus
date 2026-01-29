import { NextRequest, NextResponse } from 'next/server'
import { proxyRequestToUpstream } from '@lib/apiProxy'

// Moltbot service URL configuration
const MOLTBOT_SERVICE_URL = process.env.MOLTBOT_SERVICE_URL || 'https://moltbot.svc.plus'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        console.log(`Proxying Moltbot chat request to: ${MOLTBOT_SERVICE_URL}/chat`)

        // Use proxyRequestToUpstream directly
        // configured so that /api/moltbot/chat -> /chat on upstream
        return proxyRequestToUpstream(req, {
            upstreamBaseUrl: MOLTBOT_SERVICE_URL,
            upstreamPathPrefix: '/api/moltbot'
        })

    } catch (error: any) {
        console.error('Moltbot proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to communicate with Moltbot service' },
            { status: 502 }
        )
    }
}
