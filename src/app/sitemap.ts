import type { MetadataRoute } from 'next'

import { getBlogPosts } from '@/lib/blogContent'
import { getDocCollections } from '@/lib/docContent'
import { allWorkshops } from 'contentlayer/generated'
import { PRODUCT_LIST } from '@/modules/products/registry'

const baseUrl = 'https://console.svc.plus'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, collections] = await Promise.all([getBlogPosts(), getDocCollections()])

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
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
    {
      url: `${baseUrl}/cloud_iac`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const productEntries: MetadataRoute.Sitemap = PRODUCT_LIST.map((product) => ({
    url: `${baseUrl}/${product.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

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

  return [...staticEntries, ...productEntries, ...blogEntries, ...docsEntries, ...workshopEntries]
}
