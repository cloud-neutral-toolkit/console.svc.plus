'use server'

import { getContent, filterPostsByLanguage, type ContentItem } from '@/lib/content'

const HERO_PAGE_SIZE = 7
const STD_PAGE_SIZE = 6

export async function fetchPosts(page: number, language: string) {
    const allPosts = await getContent('blog')
    const posts = filterPostsByLanguage(allPosts, language)

    let startIndex = 0
    let pageSize = HERO_PAGE_SIZE

    if (page > 1) {
        startIndex = HERO_PAGE_SIZE + (page - 2) * STD_PAGE_SIZE
        pageSize = STD_PAGE_SIZE
    }

    const pagedPosts = posts.slice(startIndex, startIndex + pageSize)
    const hasMore = startIndex + pageSize < posts.length

    return {
        posts: pagedPosts,
        hasMore
    }
}
