import type { MetadataRoute } from 'next'

import { getBlogPosts } from '@/lib/blogContent'
import { getDocCollections } from '@/lib/docContent'
import { allWorkshops } from 'contentlayer/generated'

const baseUrl = 'https://console.svc.plus'

const staticEntries: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/`,
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${baseUrl}/blogs`,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/docs`,
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/download`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/services`,
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${baseUrl}/workshop`,
    changeFrequency: 'monthly',
    priority: 0.6,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, collections] = await Promise.all([getBlogPosts(), getDocCollections()])

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const docsEntries: MetadataRoute.Sitemap = collections.flatMap((collection) =>
    collection.versions.map((version) => ({
      url: `${baseUrl}/docs/${collection.slug}/${version.slug}`,
      lastModified: version.updatedAt ? new Date(version.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  )

  const workshopEntries: MetadataRoute.Sitemap = allWorkshops.map((workshop) => ({
    url: `${baseUrl}/workshop/${workshop.slug}`,
    lastModified: workshop.updatedAt ? new Date(workshop.updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries, ...docsEntries, ...workshopEntries]
}
