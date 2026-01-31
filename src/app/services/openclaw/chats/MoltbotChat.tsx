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
import { cn } from '@lib/utils'
import {
    HeroSection,
    NextStepsSection,
    StatsSection,
    ShortcutsSection
} from '@/app/page'
import Footer from '@components/Footer'

import { useLanguage } from '@/i18n/LanguageProvider'
import { translations } from '@/i18n/translations'

export type ChatLayoutMode = 'left' | 'right' | 'full'

export function MoltbotChat() {
    const router = useRouter()
    const { language } = useLanguage()
    const t = translations[language].askAI

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
        <div className={cn(
            "flex flex-col rounded-2xl border border-primary/20 bg-background/80 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300 h-full",
            isSidebar ? 'w-[420px] shrink-0 z-10' : 'w-full'
        )}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4 bg-surface-muted/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-xl">🦞</span>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-text leading-tight">{translations[language].chat}</p>
                        <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">Online</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('left') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'left' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface-muted'}`}
                        title="Sidebar Left"
                    >
                        <PanelLeft className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('right') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'right' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface-muted'}`}
                        title="Sidebar Right"
                    >
                        <PanelRight className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLayout('full') }}
                        className={`p-1.5 rounded-lg transition-colors ${layout === 'full' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface-muted'}`}
                        title="Fullscreen"
                    >
                        <Maximize2 className="size-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push('/') }}
                        className={`p-1.5 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-muted`}
                        title="Minimize"
                    >
                        <PanelRight className="size-4 rotate-180" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push('/') }}
                        className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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
