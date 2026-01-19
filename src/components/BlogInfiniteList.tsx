'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import PostCard from '@/components/PostCard'
import HeroPostCard from '@/components/HeroPostCard'
import BlogReadingModal from '@/components/BlogReadingModal'
import type { ContentItem } from '@/lib/content'
import { fetchPosts } from '@/app/blogs/actions'

type BlogInfiniteListProps = {
    initialPosts: ContentItem[]
    heroPost?: ContentItem
    language: string
}

export default function BlogInfiniteList({ initialPosts, heroPost, language }: BlogInfiniteListProps) {
    const [posts, setPosts] = useState<ContentItem[]>(initialPosts)
    const [page, setPage] = useState(1)

    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null)

    const observerTarget = useRef<HTMLDivElement>(null)

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            const nextPage = page + 1
            const { posts: newPosts, hasMore: moreAvailable } = await fetchPosts(nextPage, language)

            setPosts((prev) => [...prev, ...newPosts])
            setHasMore(moreAvailable)
            setPage(nextPage)

        } catch (error) {
            console.error('Failed to load more posts', error)
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore, page, language])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [loadMore, hasMore])

    return (
        <>
            <div className="space-y-12">
                {/* Hero Section */}
                {heroPost && (
                    <section>
                        <HeroPostCard post={heroPost} onQuickView={setSelectedPost} />
                    </section>
                )}

                {/* Grid Section */}
                <section className="grid gap-6 md:grid-cols-2">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} onQuickView={setSelectedPost} />
                    ))}
                </section>
            </div>

            {/* Loading Sentinel */}
            <div ref={observerTarget} className="mt-8 flex justify-center py-4">
                {loading && (
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                        <span>Loading more...</span>
                    </div>
                )}
                {!hasMore && posts.length > 0 && (
                    <div className="text-sm text-slate-400">· End of content ·</div>
                )}
            </div>

            {/* Reading Mode Modal */}
            {selectedPost && (
                <BlogReadingModal
                    post={selectedPost}
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>
    )
}
