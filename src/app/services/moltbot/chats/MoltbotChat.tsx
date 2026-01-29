'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

const quickActions = [
    { id: 'hello', label: 'Say Hello', prompt: 'Hello, who are you?' },
    { id: 'help', label: 'What can you do?', prompt: 'What capabilities do you have?' },
]

export function MoltbotChat() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q')

    // Use a ref to track if we've processed the initial query to avoid double-sending in strict mode
    const hasProcessedInitialQuery = useRef(false)

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
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
        setConversation(prev => [
            ...prev,
            { author: 'user', text: prompt, timestamp },
        ])

        setLoading(true)

        try {
            // Optimistic UI update or wait for stream?
            // Let's assume simple fetch for now based on user request "打通 https://clawdbot.svc.plus/chat"
            // If it's a chat interface, it might be streaming, but let's start with fetch.
            // Actually, if it's "https://clawdbot.svc.plus/chat", that might be a *page* URL, not an API URL.
            // The user said "打通 https://clawdbot.svc.plus/chat", which implies connecting TO it.
            // If it's a browser page, maybe they want an iframe?
            // But the previous instructions said "AskAI 按钮简单的UI不变", implying native UI.
            // Let's assume there is an API endpoint. If not, I might need to clarify.
            // PROXY: request to /api/moltbot/chat which proxies to clawdbot.svc.plus?
            // Let's try to fetch directly first, or map to a structured request.

            // Use internal proxy to handle CORS and auth
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

            setConversation(prev => [
                ...prev,
                { author: 'ai', text: reply, timestamp: Date.now() }
            ])
        } catch (error: any) {
            setConversation(prev => [
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

    return (
        <div className="flex flex-col h-full rounded-2xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-500/20 px-6 py-4">
                <div>
                    <p className="text-lg font-semibold text-slate-100">Moltbot AI</p>
                    <p className="text-xs text-slate-400">Your personal cloud assistant.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
                {conversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                        <div className="p-4 rounded-full bg-slate-900/50 border border-slate-800">
                            {/* Moltbot Icon placeholder */}
                            <div className="w-12 h-12 flex items-center justify-center text-3xl">🦞</div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-slate-200 font-medium">Welcome to Moltbot</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Ask me anything about your infrastructure, logs, or just say hello.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                            {quickActions.map(action => (
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
                        {conversation.map(entry => (
                            <li
                                key={entry.timestamp}
                                className={`flex flex-col ${entry.author === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] ${entry.author === 'user'
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
                        <span className="text-xs text-slate-500 hidden sm:block">Press Enter to send</span>
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
}
