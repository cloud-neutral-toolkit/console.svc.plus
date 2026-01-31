'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    PanelLeft,
    PanelRight,
    Maximize2,
    Minus,
    X,
} from 'lucide-react'
import {
    HeroSection,
    NextStepsSection,
    StatsSection,
    ShortcutsSection
} from '@/app/page'
import Footer from '@components/Footer'

export type ChatLayoutMode = 'left' | 'right' | 'full'

export function MoltbotChat() {
    const router = useRouter()

    // Layout state
    const [layout, setLayout] = useState<ChatLayoutMode>('full')

    // Home content for side-by-side mode
    const HomeContent = () => (
        <main className="space-y-12 py-10">
            <HeroSection />
            <NextStepsSection />
            <StatsSection />
            <ShortcutsSection />
            <Footer />
        </main>
    )

    // Render the chat interface (now an iframe)
    const renderChat = (isSidebar = false) => (
        <div className={`flex flex-col rounded-2xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl overflow-hidden transition-all duration-300 h-full ${isSidebar ? 'w-[420px] shrink-0 z-10' : 'w-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 px-6 py-4 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-xl">🦞</span>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-slate-100 leading-tight">AI Assistant</p>
                        <p className="text-[10px] text-emerald-400/70 uppercase tracking-widest font-bold">Online</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('left') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'left' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        title="Sidebar Left"
                    >
                        <PanelLeft className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('right') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'right' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        title="Sidebar Right"
                    >
                        <PanelRight className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('full') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'full' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        title="Fullscreen"
                    >
                        <Maximize2 className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push('/') }}
                        className={`p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-200 hover:bg-slate-800`}
                        title="Minimize"
                    >
                        <Minus className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push('/') }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>

            {/* Iframe Content */}
            <div className="flex-1 w-full h-full bg-white">
                <iframe
                    src="https://clawdbot.svc.plus/chat?session=agent%3Amain%3Amain"
                    className="w-full h-full border-0"
                    title="Moltbot Chat"
                    allow="clipboard-write"
                />
            </div>
        </div>
    )

    if (layout === 'full') {
        return renderChat(false)
    }

    return (
        <div className="flex h-full w-full gap-4 relative overflow-hidden">
            {layout === 'left' && renderChat(true)}
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
                <HomeContent />
            </div>
            {layout === 'right' && renderChat(true)}
        </div>
    )
}
