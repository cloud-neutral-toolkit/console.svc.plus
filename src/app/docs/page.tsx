import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function DocsHome() {
  try {
    // Read the index.md file
    const indexPath = path.join(process.cwd(), 'src', 'content', 'doc', 'index.md')
    const fileContent = await fs.readFile(indexPath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    return (
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-surface-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            {frontmatter.title || 'Documentation'}
          </h1>
          {frontmatter.description && (
            <p className="mt-4 text-lg text-text-muted">{frontmatter.description}</p>
          )}
        </header>

        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <MDXRemote source={content} />
        </article>
      </div>
    )
  } catch (error) {
    console.error('Failed to load docs index:', error)
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-surface-border bg-surface p-8 text-center">
        <h3 className="text-lg font-semibold text-heading">No Documentation Found</h3>
        <p className="max-w-md text-sm text-text-muted mt-2">
          We couldn't find any documentation files. Please ensure content is synced to <code>src/content/doc</code>.
        </p>
      </div>
    )
  }
}
