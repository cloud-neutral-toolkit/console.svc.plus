import 'server-only'

import { cache } from 'react'

import { getDocCollections as loadDocCollections, getDocPage, getDocsHome } from '@lib/docsServiceClient'
import { isFeatureEnabled } from '@lib/featureToggles'
import type { DocCollection } from './types'

const isDocsModuleEnabled = () => isFeatureEnabled('appModules', '/docs')

export const getDocCollections = cache(async (): Promise<DocCollection[]> => {
  if (!isDocsModuleEnabled()) {
    return []
  }
  return loadDocCollections()
})

export const getDocCollectionsForBuildTime = getDocCollections

export const getDocsHomeContent = cache(async () => {
  if (!isDocsModuleEnabled()) {
    return undefined
  }
  return getDocsHome()
})

export async function getDocResources(): Promise<DocCollection[]> {
  return getDocCollections()
}

export async function getDocResource(slug: string): Promise<DocCollection | undefined> {
  if (!isDocsModuleEnabled()) {
    return undefined
  }

  const collections = await getDocCollections()
  return collections.find((doc) => doc.slug === slug)
}

export async function getDocVersionParams() {
  return []
}

export async function getDocVersion(collectionSlug: string, slugSegments: string | string[]) {
  if (!isDocsModuleEnabled()) {
    return undefined
  }
  const targetSlug = Array.isArray(slugSegments) ? slugSegments.join('/') : slugSegments
  try {
    return await getDocPage(collectionSlug, targetSlug)
  } catch {
    return undefined
  }
}
