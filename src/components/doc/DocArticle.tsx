import { marked } from 'marked'

interface DocArticleProps {
  content: string
}

export default async function DocArticle({ content }: DocArticleProps) {
  // Convert markdown to HTML
  const htmlContent = await marked(content)

  return (
    <article
      className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
