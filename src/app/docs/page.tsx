import { redirect, notFound } from 'next/navigation'
import { getDocCollections } from './resources.server'

export default async function DocsHome() {
  const collections = await getDocCollections()

  if (collections.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-surface-border bg-surface p-8 text-center">
        <h3 className="text-lg font-semibold text-heading">No Documentation Found</h3>
        <p className="max-w-md text-sm text-text-muted mt-2">
          We couldn't find any documentation files. Please ensure content is synced to <code>src/content/doc</code>.
        </p>
      </div>
    )
  }

  // Try to find a collection named 'index', 'intro', 'home', 'docs' or similar to prioritize
  const priorityKeys = ['index', 'intro', 'introduction', 'home', 'docs', 'overview']
  const sorted = [...collections].sort((a, b) => {
    const aIndex = priorityKeys.indexOf(a.slug.toLowerCase())
    const bIndex = priorityKeys.indexOf(b.slug.toLowerCase())
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return 0
  })

  const firstCollection = sorted[0]
  const firstVersion = firstCollection.versions[0]

  if (firstCollection && firstVersion) {
    redirect(`/docs/${firstCollection.slug}/${firstVersion.slug}`)
  }

  notFound()
}
