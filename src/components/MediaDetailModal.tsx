'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, LayoutTemplate, Minimize2, Maximize2, AlignLeft, AlignVerticalJustifyCenter } from 'lucide-react'
import { marked } from 'marked'
import type { ContentItem } from '@/lib/content'

// Make sure marked options are set safely if needed, though simple usage is fine.
// We'll just use marked.parse(text)

type MediaDetailModalProps = {
    item: ContentItem
    isOpen: boolean
    onClose: () => void
    type: 'image' | 'video'
}

export default function MediaDetailModal({ item, isOpen, onClose, type }: MediaDetailModalProps) {
    const [layoutMode, setLayoutMode] = useState<'side' | 'stacked'>('side') // side = left-right, stacked = top-bottom
    const [isTextCollapsed, setIsTextCollapsed] = useState(false)
    const [htmlContent, setHtmlContent] = useState('')

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

    useEffect(() => {
        // Parse markdown content
        if (item.content) {
            const parsed = marked.parse(item.content)
            if (typeof parsed === 'string') {
                setHtmlContent(parsed)
            } else {
                // marked.parse can return Promise if async option is on, but default is sync string
                Promise.resolve(parsed).then(res => setHtmlContent(res))
            }
        } else {
            setHtmlContent('')
        }
    }, [item.content])

    if (!isOpen) return null

    // Helper to determine media URL
    const mediaSrc = type === 'video' ? item.src : item.cover
    const posterSrc = item.poster

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none"
            >
                <X size={24} />
            </button>

            {/* Main Container */}
            <div
                className={`relative flex h-full w-full max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 md:h-[90vh] md:max-w-[90vw] ${layoutMode === 'side' ? 'flex-row' : 'flex-col'
                    }`}
            >
                {/* Media Section */}
                <div
                    className={`relative flex items-center justify-center bg-black transition-all duration-300 ${layoutMode === 'side'
                            ? (isTextCollapsed ? 'w-full' : 'w-2/3')
                            : (isTextCollapsed ? 'h-full' : 'h-2/3')
                        }`}
                >
                    {type === 'video' ? (
                        <div className="h-full w-full">
                            <video
                                src={mediaSrc}
                                poster={posterSrc}
                                controls
                                autoPlay
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ) : (
                        <img
                            src={mediaSrc}
                            alt={item.title || ''}
                            className="h-full w-full object-contain"
                        />
                    )}

                    {/* View Controls Overlay (Bottom Left of Media) */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button
                            onClick={() => setLayoutMode(prev => prev === 'side' ? 'stacked' : 'side')}
                            className="rounded-md bg-black/50 p-2 text-white backdrop-blur-md hover:bg-black/70"
                            title={layoutMode === 'side' ? "Switch to Top-Bottom" : "Switch to Left-Right"}
                        >
                            {layoutMode === 'side' ? <AlignVerticalJustifyCenter size={20} /> : <AlignLeft size={20} />}
                        </button>
                        <button
                            onClick={() => setIsTextCollapsed(prev => !prev)}
                            className="rounded-md bg-black/50 p-2 text-white backdrop-blur-md hover:bg-black/70"
                            title={isTextCollapsed ? "Show Text" : "Collapse Text"}
                        >
                            {isTextCollapsed ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                        </button>
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className={`flex flex-col bg-white transition-all duration-300 ${layoutMode === 'side'
                            ? (isTextCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-1/3 opacity-100')
                            : (isTextCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-1/3 opacity-100')
                        } border-l border-gray-100`}
                >
                    <div className="h-full overflow-y-auto p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                            {item.location && <p className="mt-2 text-sm text-gray-500">{Array.isArray(item.location) ? item.location.join(', ') : item.location}</p>}
                            {item.date && <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>}
                            {item.equipment && <p className="text-sm text-gray-500">Gear: {item.equipment}</p>}
                            {/* Add more metadata if needed */}
                        </div>

                        <div
                            className="prose prose-slate max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
