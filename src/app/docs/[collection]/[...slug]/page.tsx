export const dynamic = 'error'
export const revalidate = false

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import DocArticle from '@/components/doc/DocArticle'
import DocMetaPanel from '@/components/doc/DocMetaPanel'
import Feedback from '../../Feedback'
import { getDocVersionParams, getDocVersion } from '../../resources.server'
import { isFeatureEnabled } from '@lib/featureToggles'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// Simple Breadcrumbs Component inline (or could be separate)
function DocsBreadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <Link
            href={item.href}
            className={`transition hover:text-primary ${index === items.length - 1 ? 'font-medium text-text' : ''}`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

export const generateStaticParams = async () => {
  if (!isFeatureEnabled('appModules', '/docs')) {
    return []
  }

  return getDocVersionParams()
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ collection: string; slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params
  const doc = await getDocVersion(resolvedParams.collection, resolvedParams.slug)
  if (!doc) return {}
  return {
    title: `${doc.version.title} - ${doc.collection.title} | Documentation`,
    description: doc.version.description,
  }
}

export default async function DocVersionPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string[] }>
}) {
  if (!isFeatureEnabled('appModules', '/docs')) {
    notFound()
  }

  const resolvedParams = await params
  const doc = await getDocVersion(resolvedParams.collection, resolvedParams.slug)
  if (!doc) {
    notFound()
  }

  const { collection, version } = doc

  const breadcrumbs = [
    { label: 'Documentation', href: '/docs' },
    { label: collection.title, href: `/docs/${collection.slug}` },
    { label: version.title, href: `/docs/${collection.slug}/${version.slug}` },
  ]

  return (
    <div className="flex gap-12 xl:gap-16">
      {/* Center Content */}
      <article className="min-w-0 flex-1">
        <DocsBreadcrumbs items={breadcrumbs} />

        <header className="mb-10 border-b border-surface-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">{version.title}</h1>
          {version.description && <p className="mt-4 text-lg text-text-muted">{version.description}</p>}
        </header>

        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <DocArticle content={version.content} />
        </div>

        <Feedback />
      </article>

      {/* Right Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
        <div className="sticky top-[100px] space-y-8 border-l border-surface-border pl-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-subtle">Metadata</h3>
            <DocMetaPanel
              description={undefined} // Description already shown in header
              updatedAt={version.updatedAt}
              tags={version.tags}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
