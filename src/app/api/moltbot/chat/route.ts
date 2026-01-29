import { NextRequest, NextResponse } from 'next/server'
import { createUpstreamProxyHandler } from '@lib/apiProxy'
import { getInternalServerServiceBaseUrl } from '@server/serviceConfig'

// Moltbot service URL configuration
// Using environment variable or fallback to serviceConfig discovery
const MOLTBOT_SERVICE_URL = process.env.MOLTBOT_SERVICE_URL || 'https://moltbot.svc.plus'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        // Construct the upstream URL
        // We are forwarding to /chat endpoint on Moltbot service
        const upstreamUrl = `${MOLTBOT_SERVICE_URL}/chat`

        console.log(`Proxying Moltbot chat request to: ${upstreamUrl}`)

        // Use the shared proxy handler which handles X-Service-Token injection
        // createUpstreamProxyHandler expects a target URL builder or fixed string
        // But here we need a customized handler because we are mapping /api/moltbot/chat -> /chat

        const proxyHandler = createUpstreamProxyHandler(async () => upstreamUrl)
        return proxyHandler(req, { params: {} })

    } catch (error: any) {
        console.error('Moltbot proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to communicate with Moltbot service' },
            { status: 502 }
        )
    }
}
