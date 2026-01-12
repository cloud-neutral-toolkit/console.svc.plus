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
          className="block rounded-xl border border-gray-100 bg-white p-4 transition hover:bg-[#f2f2f2]"
        >
          <div className="space-y-2">
            <span className="text-xs text-[#747775]">{post.date ?? '2024-06-01'}</span>
            <h3 className="text-base font-medium text-[#1f1f1f]">{post.title}</h3>
            {post.content && (
              <p className="line-clamp-2 text-sm leading-relaxed text-[#747775]">
                {buildExcerpt(post.content)}...
              </p>
            )}
          </div>
        </Link>
      ))}
      <Link
        href="/blogs"
        className="flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:border-gray-400"
      >
        Read More
      </Link>
    </div>
  )
}
