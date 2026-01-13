import type { JSX } from 'react'

import type { Language } from '@/i18n/language'
import { onwalkCopy } from '@/i18n/onwalk'
import type { MarkdownRenderResult } from '@/server/render-markdown'
import { ContentNotFoundError, renderMarkdownFile } from '@/server/render-markdown'

function resolveHeading(meta: Record<string, unknown>, fallback: keyof JSX.IntrinsicElements) {
  const allowed = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
  const requested = typeof meta.heading === 'string' ? meta.heading.toLowerCase() : undefined
  return (requested && allowed.has(requested) ? (requested as keyof JSX.IntrinsicElements) : fallback)
}

async function loadMarkdown(language: Language): Promise<MarkdownRenderResult | null> {
  try {
    return await renderMarkdownFile(`about/${language}.md`)
  } catch (error) {
    if (error instanceof ContentNotFoundError) {
      return null
    }
    throw error
  }
}

function renderFallback(copy: (typeof onwalkCopy)[Language]) {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-slate-600">
      {copy.about.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

function renderMarkdown(result: MarkdownRenderResult) {
  const { meta, html } = result
  const title = typeof meta.title === 'string' ? meta.title : undefined
  const HeadingTag = resolveHeading(meta, 'h2')

  return (
    <section className="text-sm leading-relaxed text-slate-600" aria-label={title ?? undefined}>
      {title ? <HeadingTag className="text-2xl font-semibold text-slate-900">{title}</HeadingTag> : null}
      <div
        className="prose prose-slate mt-4 max-w-none text-sm leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

export default async function AboutContent({ language }: { language: Language }) {
  const copy = onwalkCopy[language]
  const content = await loadMarkdown(language)

  return (
    <>
      <header className="space-y-3 pb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{copy.about.eyebrow}</p>
        <h1 className="text-3xl font-semibold">{copy.about.title}</h1>
        <p className="text-sm text-slate-600">{copy.about.subtitle}</p>
      </header>
      {content ? renderMarkdown(content) : renderFallback(copy)}
    </>
  )
}
