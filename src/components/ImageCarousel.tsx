import Image from 'next/image'
import Link from 'next/link'
import type { ContentItem } from '@/lib/content'

const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyM2I0YmUiLz48L3N2Zz4='

export default function ImageCarousel({ items }: { items: ContentItem[] }) {
  const galleryItems =
    items.length > 0
      ? items
      : [
          {
            slug: 'urban-geometry',
            title: 'Urban Geometry',
            cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
            content: '',
          },
          {
            slug: 'misty-forest',
            title: 'Misty Forest',
            cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop',
            content: '',
          },
          {
            slug: 'night-contrast',
            title: 'Night Contrast',
            cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=900&auto=format&fit=crop',
            content: '',
          },
          {
            slug: 'soft-light',
            title: 'Soft Light',
            cover: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=900&auto=format&fit=crop',
            content: '',
          },
        ]

  return (
    <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2">
      {galleryItems.map((item) => (
        <article
          key={item.slug}
          className="group relative flex h-[300px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
          style={{ aspectRatio: '3 / 4' }}
        >
          {item.cover && (
            <Image
              src={item.cover}
              alt={item.title ?? item.slug}
              width={900}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pb-4 pt-10">
            <h3 className="text-sm font-medium text-white">{item.title}</h3>
          </div>
        </article>
      ))}
      <Link
        href="/images"
        className="group flex h-[300px] flex-shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed border-[#e4e4e4] bg-[#f5f5f5] px-6 text-center text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f2f2f2]"
        style={{ aspectRatio: '3 / 4' }}
      >
        <span className="leading-relaxed">查看全部</span>
      </Link>
    </div>
  )
}
