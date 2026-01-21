import Link from 'next/link'
import type { ContentItem } from '@/lib/content'

function buildExcerpt(content: string): string {
  const cleaned = content
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.slice(0, 90)
}

export default function MasonryGrid({ posts }: { posts: ContentItem[] }) {
  const postItems = posts

  return (
    <div className="space-y-4">
      {postItems.map((post) => (
        <Link
          key={post.slug}
          href={`/blogs/${post.slug}`}
          className="group block rounded-xl border border-border bg-surface p-6 transition-colors duration-300 hover:bg-surface-elevated"
        >
          <div className="space-y-3">
            <span className="text-sm font-medium text-primary mb-2 block">{post.date ?? '2024-06-01'}</span>
            <h3 className="text-2xl font-bold text-heading group-hover:text-primary transition-colors">{post.title}</h3>
            {post.content && (
              <p className="line-clamp-2 text-base leading-relaxed text-text-secondary">
                {buildExcerpt(post.content)}...
              </p>
            )}
          </div>
        </Link>
      ))}
      <Link
        href="/blogs"
        className="flex w-full items-center justify-center rounded-full border border-border bg-surface px-8 py-3 text-sm font-medium text-text transition hover:bg-surface-elevated"
      >
        Read More
      </Link>
    </div>
  )
}
