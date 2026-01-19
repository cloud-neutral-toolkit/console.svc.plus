/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'

import type { ContentItem } from '@/lib/content'

function buildExcerpt(content: string, length: number = 200): string {
    const cleaned = content
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/[`*_>#-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    return cleaned.slice(0, length)
}

function isLocalImage(src: string) {
    return src.startsWith('/') && !src.startsWith('//')
}

// HeroPostCard.tsx
import { Eye } from 'lucide-react'

// ...

export default function HeroPostCard({ post, onQuickView }: { post: ContentItem, onQuickView?: (post: ContentItem) => void }) {
    const href = `/blogs/${post.slug}`

    return (
        <article className="group relative grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg md:grid-cols-2">
            {/* Image Section */}
            <div className="relative min-h-[300px] w-full overflow-hidden md:h-full">
                {post.cover ? (
                    <Link href={href} aria-label={post.title ?? post.slug}>
                        {isLocalImage(post.cover) ? (
                            <Image
                                src={post.cover}
                                alt={post.title ?? post.slug}
                                fill
                                className="object-cover transition duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <img
                                src={post.cover}
                                alt={post.title ?? post.slug}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                loading="eager"
                            />
                        )}
                    </Link>
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        No Cover
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        {post.category && (
                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {post.category}
                            </span>
                        )}
                        {post.date && (
                            <time className="text-sm text-slate-500">{post.date}</time>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                        <Link href={href} className="transition hover:text-brand">
                            {post.title}
                        </Link>
                    </h2>

                    {post.content && (
                        <p className="line-clamp-3 text-base text-slate-600 md:text-lg">
                            {buildExcerpt(post.content)}...
                        </p>
                    )}

                    <div className="flex gap-4 pt-4">
                        <Link
                            href={href}
                            className="inline-flex items-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 group-hover:bg-brand"
                        >
                            阅读全文 →
                        </Link>
                        {onQuickView && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    onQuickView(post)
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand"
                            >
                                <Eye size={16} />
                                快速阅读
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
