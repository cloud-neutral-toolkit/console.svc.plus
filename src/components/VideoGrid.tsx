'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { useOnwalkCopy } from '@/i18n/useOnwalkCopy'
import type { ContentItem } from '@/lib/content'

const PAGE_SIZE = 12

export default function VideoGrid({ items }: { items: ContentItem[] }) {
  const copy = useOnwalkCopy()
  const videoItems =
    items.length > 0
      ? items
      : [
          {
            slug: 'city-light',
            title: 'City Light',
            poster: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop',
            duration: '04:20',
            content: '',
          },
          {
            slug: 'morning-walk',
            title: 'Morning Walk',
            poster: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
            duration: '02:58',
            content: '',
          },
          {
            slug: 'ocean-silence',
            title: 'Ocean Silence',
            poster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
            duration: '05:12',
            content: '',
          },
          {
            slug: 'trail-notes',
            title: 'Trail Notes',
            poster: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
            duration: '03:46',
            content: '',
          },
        ]
  const [pageIndex, setPageIndex] = useState(0)
  const totalPages = Math.max(1, Math.ceil(videoItems.length / PAGE_SIZE))
  const currentItems = useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return videoItems.slice(start, start + PAGE_SIZE)
  }, [videoItems, pageIndex])

  const canGoBack = pageIndex > 0
  const canGoForward = pageIndex < totalPages - 1

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(Math.max(0, totalPages - 1))
    }
  }, [pageIndex, totalPages])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {currentItems.map((item) => (
          <div
            key={item.slug}
            className="overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="relative">
              {item.src ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  loop
                  playsInline
                  className="h-48 w-full object-cover sm:h-56"
                  onMouseEnter={(event) => event.currentTarget.play()}
                  onMouseLeave={(event) => event.currentTarget.pause()}
                />
              ) : item.poster ? (
                <img src={item.poster} alt={item.title ?? item.slug} className="h-48 w-full object-cover sm:h-56" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-[#747775]">{copy.video.empty}</div>
              )}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white">
                {item.duration ?? '04:20'}
              </span>
            </div>
            <div className="space-y-1 p-4">
              <Link href="/video" className="text-sm font-medium text-[#1f1f1f] hover:text-[#1f1f1f]">
                {item.title ?? item.slug}
              </Link>
              {item.location && <p className="text-xs text-[#747775]">{item.location}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#747775]">
        <span>
          {copy.video.pageLabel ?? 'Page'} {pageIndex + 1} / {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[#e4e4e4] px-4 py-2 text-[#1f1f1f] transition hover:border-[#d8d8d8] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
            disabled={!canGoBack}
          >
            {copy.video.prev ?? '上一页'}
          </button>
          <button
            type="button"
            className="rounded-full border border-[#e4e4e4] px-4 py-2 text-[#1f1f1f] transition hover:border-[#d8d8d8] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={!canGoForward}
          >
            {copy.video.next ?? '下一页'}
          </button>
        </div>
      </div>
    </div>
  )
}
