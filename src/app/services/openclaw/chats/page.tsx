import { Suspense } from 'react'
import { MoltbotChat } from './MoltbotChat'

export const metadata = {
    title: 'Moltbot Chat',
    description: 'Chat with your infrastructure assistant',
}

export default function MoltbotPage() {
    return (
        <div className="w-full h-[calc(100vh-var(--app-shell-nav-offset))] p-4">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading chat...</div>}>
                <MoltbotChat />
            </Suspense>
        </div>
    )
}
