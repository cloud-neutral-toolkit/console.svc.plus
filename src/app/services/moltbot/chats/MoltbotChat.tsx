'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

const quickActions = [
    { id: 'hello', label: 'Say Hello', prompt: 'Hello, who are you?' },
    { id: 'help', label: 'What can you do?', prompt: 'What capabilities do you have?' },
]

export function MoltbotChat() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q')

    const hasProcessedInitialQuery = useRef(false)

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [layout, setLayout] = useState<ChatLayoutMode>('full')
    const [conversation, setConversation] = useState<
        { author: 'user' | 'ai'; text: string; timestamp: number }[]
    >([])

    useEffect(() => {
        if (initialQuery && !hasProcessedInitialQuery.current) {
            hasProcessedInitialQuery.current = true
            appendMessage(initialQuery)
        }
    }, [initialQuery])

    async function appendMessage(prompt: string) {
        const timestamp = Date.now()
        setConversation((prev) => [
            ...prev,
            { author: 'user', text: prompt, timestamp },
        ])

        setLoading(true)

        try {
            const response = await fetch('/api/moltbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: prompt })
            })

            if (!response.ok) {
                const errText = await response.text().catch(() => response.statusText)
                throw new Error(`Request failed: ${response.status} ${errText}`)
            }

            const data = await response.json()
            const reply = data.reply || data.message || JSON.stringify(data)

            setConversation((prev) => [
                ...prev,
                { author: 'ai', text: reply, timestamp: Date.now() }
            ])
        } catch (error: any) {
            setConversation((prev) => [
                ...prev,
                { author: 'ai', text: `Error: ${error.message}. Please try again later.`, timestamp: Date.now() }
            ])
        } finally {
            setLoading(false)
        }
    }

    function handleSend() {
        if (!message.trim()) return
        appendMessage(message.trim())
        setMessage('')
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const HomeContent = () => (
        <main className="space-y-12 py-10">
            <HeroSection />
            <NextStepsSection />
            <StatsSection />
            <ShortcutsSection />
            <Footer />
        </main>
    )

    const renderChat = (isSidebar = false) => (
        <div className={`flex flex-col rounded-2xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl overflow-hidden transition-all duration-300 h-full ${isSidebar ? 'w-[420px] shrink-0 z-10' : 'w-full'}`}>
            <div className="flex items-center justify-between border-b border-emerald-500/20 px-6 py-4">
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

            <div className="flex-1 overflow-y-auto px-6 py-4">
                {conversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                        <div className="p-4 rounded-full bg-slate-900/50 border border-slate-800">
                            <div className="w-12 h-12 flex items-center justify-center text-3xl">🦞</div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-slate-200 font-medium">Welcome to AI Assistant</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Ask me anything about your infrastructure, logs, or just say hello.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                            {quickActions.map((action: { id: string, label: string, prompt: string }) => (
                                <button
                                    key={action.id}
                                    onClick={() => appendMessage(action.prompt)}
                                    className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-emerald-500/40 hover:bg-slate-900/60"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {conversation.map((entry: { author: string, text: string, timestamp: number }) => (
                            <li
                                key={entry.timestamp}
                                className={`flex flex-col ${entry.author === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm max-w-[90%] ${entry.author === 'user'
                                        ? 'bg-emerald-500/10 text-emerald-100 rounded-tr-none'
                                        : 'bg-slate-900/80 text-slate-200 rounded-tl-none border border-slate-800'
                                        }`}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 px-1">
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                </span>
                            </li>
                        ))}
                        {loading && (
                            <li className="flex flex-col items-start">
                                <div className="bg-slate-900/80 text-slate-200 rounded-2xl rounded-tl-none border border-slate-800 px-4 py-3">
                                    <span className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                                    </span>
                                </div>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <div className="border-t border-emerald-500/10 bg-slate-950/80 px-6 py-4">
                <div className="relative">
                    <textarea
                        value={message}
                        onChange={event => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="h-24 w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500 hidden sm:block">Press Enter</span>
                        <button
                            onClick={handleSend}
                            disabled={loading || !message.trim()}
                            className="rounded-xl bg-emerald-500/80 px-4 py-2 text-xs font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
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
