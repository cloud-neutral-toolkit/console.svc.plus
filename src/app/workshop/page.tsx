import type { Metadata } from 'next'

import { onwalkSeoDescription, onwalkSeoTitle } from '@/lib/seo'
import Link from 'next/link'

export const dynamic = 'error'
export const revalidate = false

export const metadata: Metadata = {
  title: onwalkSeoTitle,
  description: onwalkSeoDescription,
}

type WorkshopEntry = {
  slug: string
  title: string
  summary: string
  level?: string
  duration?: string
  updatedAt?: string
}

export default function WorkshopIndexPage() {
  const workshops: WorkshopEntry[] = []

  return (
    <main className="bg-brand-surface px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-brand-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">Workshop</p>
          <h1 className="text-[32px] font-bold text-brand md:text-[36px]">Interactive Workflows</h1>
          <p className="max-w-3xl text-sm text-brand-heading/80 md:text-base">
            Short-lived, high-interaction guides compiled with Contentlayer. Experiment with toggles and demos without changing the core UI.
          </p>
        </header>

        {workshops.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white p-10 text-center text-sm text-brand-heading/70">
            Workshops will appear here once content is published.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {workshops.map((workshop) => (
              <Link
                key={workshop.slug}
                href={`/workshop/${workshop.slug}`}
                className="rounded-2xl border border-brand-border bg-white p-6 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Workshop</p>
                    <h2 className="text-lg font-semibold text-brand-heading">{workshop.title}</h2>
                    <p className="text-sm text-brand-heading/80">{workshop.summary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-brand-heading/70">
                    {workshop.level ? (
                      <span className="rounded-full bg-brand-surface px-3 py-1 font-semibold text-brand-heading">
                        {workshop.level}
                      </span>
                    ) : null}
                    {workshop.duration ? <span>{workshop.duration}</span> : null}
                    {workshop.updatedAt ? <span suppressHydrationWarning>Updated {workshop.updatedAt}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
