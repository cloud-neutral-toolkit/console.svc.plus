import fs from 'fs'
import path from 'path'

const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'blog')
const KNOWLEDGE_CONTENT_ROOT = path.join(process.cwd(), 'content')

export function resolveBlogContentRoot(): string {
  if (fs.existsSync(KNOWLEDGE_CONTENT_ROOT)) {
    return KNOWLEDGE_CONTENT_ROOT
  }
  return BLOG_CONTENT_ROOT
}
