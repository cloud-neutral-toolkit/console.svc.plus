'use client'

import { useEffect, useState, useRef } from 'react'
import { X, BookOpen, ScrollText, Moon, Sun, Type, ChevronLeft, ChevronRight } from 'lucide-react'
import { marked } from 'marked'
import type { ContentItem } from '@/lib/content'

// Theme definitions
const THEMES = {
    light: 'bg-white text-slate-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
    dark: 'bg-[#1e293b] text-[#cbd5e1]',
}

type ReadingMode = 'scroll' | 'book'
type Theme = 'light' | 'sepia' | 'dark'

type BlogReadingModalProps = {
    post: ContentItem
    isOpen: boolean
    onClose: () => void
    onNext?: () => void
    onPrev?: () => void
    hasNext?: boolean
    hasPrev?: boolean
}

export default function BlogReadingModal({
    post,
    isOpen,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}: BlogReadingModalProps) {
    const [mode, setMode] = useState<ReadingMode>('scroll')
    const [theme, setTheme] = useState<Theme>('light')
    const contentRef = useRef<HTMLDivElement>(null)

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && onNext && hasNext) onNext()
            if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev()
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onNext, onPrev, hasNext, hasPrev, onClose])

    if (!isOpen) return null

    const htmlContent = marked.parse(post.content || '')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <style jsx global>{`
                @keyframes magazine-turn {
                0% { opacity: 0; transform: translateX(20px) scale(0.98); }
                100% { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-magazine {
                animation: magazine-turn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
            `}</style>

            {/* Navigation - PREV */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev?.() }}
                    className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 hidden md:flex transition hover:scale-110"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            {/* Navigation - NEXT */}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext?.() }}
                    className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 hidden md:flex transition hover:scale-110"
                >
                    <ChevronRight size={32} />
                </button>
            )}

            <div
                key={post.slug}
                className={`relative flex h-full w-full flex-col overflow-hidden shadow-2xl transition-all duration-300 md:h-[90vh] md:w-[90vw] md:rounded-2xl ${THEMES[theme]} animate-magazine`}
            >
                {/* Header / Controls */}
                <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 backdrop-blur-md bg-inherit z-10">
                    <h2 className="line-clamp-1 text-lg font-bold opacity-80">{post.title}</h2>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mode Toggle */}
                        <div className="flex rounded-lg bg-black/5 p-1">
                            <button
                                onClick={() => setMode('scroll')}
                                className={`rounded px-2 py-1 transition ${mode === 'scroll' ? 'bg-white shadow-sm' : 'hover:bg-black/5'}`}
                                title="Scroll Mode"
                            >
                                <ScrollText size={18} />
                            </button>
                            <button
                                onClick={() => setMode('book')}
                                className={`rounded px-2 py-1 transition ${mode === 'book' ? 'bg-white shadow-sm' : 'hover:bg-black/5'}`}
                                title="Book Mode"
                            >
                                <BookOpen size={18} />
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex rounded-lg bg-black/5 p-1">
                            <button
                                onClick={() => setTheme('light')}
                                className={`rounded px-2 py-1 transition ${theme === 'light' ? 'bg-white shadow-sm' : 'hover:bg-black/5'}`}
                                title="Light"
                            >
                                <Sun size={18} />
                            </button>
                            <button
                                onClick={() => setTheme('sepia')}
                                className={`rounded px-2 py-1 transition ${theme === 'sepia' ? 'bg-white shadow-sm' : 'hover:bg-black/5'}`}
                                title="Sepia (Eye Care)"
                            >
                                <Type size={18} />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`rounded px-2 py-1 transition ${theme === 'dark' ? 'bg-white shadow-sm text-slate-900' : 'hover:bg-black/5'}`}
                                title="Dark"
                            >
                                <Moon size={18} />
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="ml-4 rounded-full p-2 hover:bg-black/10"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={contentRef}
                    className={`flex-1 overflow-x-hidden p-6 md:p-12 ${mode === 'book'
                        ? 'overflow-y-hidden overflow-x-auto whitespace-normal' // Book Mode
                        : 'overflow-y-auto' // Scroll Mode
                        }`}
                    style={mode === 'book' ? {
                        columnWidth: '80vh',
                        columnGap: '4rem',
                        height: '100%',
                        width: '100%',
                    } : {}}
                >
                    {/* Cover Image in Scroll Mode */}
                    {mode === 'scroll' && post.cover && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img src={post.cover} className="max-h-[50vh] w-full object-cover" alt={post.title} />
                        </div>
                    )}

                    {/* Title in Content */}
                    <div className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
                        <h1 className="mb-4 text-3xl font-bold md:text-5xl">{post.title}</h1>
                        {post.date && <p className="text-sm opacity-60">{post.date}</p>}

                        <div
                            className="mt-8"
                            dangerouslySetInnerHTML={{ __html: htmlContent as string }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
