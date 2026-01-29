import { Suspense } from 'react'
import { MoltbotChat } from './MoltbotChat'

export const metadata = {
    title: 'Moltbot Chat',
    description: 'Chat with your infrastructure assistant',
}

export default function MoltbotPage() {
    return (
        <div className="container mx-auto max-w-4xl py-8">
            <Suspense fallback={<div className="flex h-[50vh] items-center justify-center text-slate-400">Loading chat...</div>}>
                <MoltbotChat />
            </Suspense>
        </div>
    )
}
