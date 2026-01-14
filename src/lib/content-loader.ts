import 'server-only'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

export type Language = 'zh' | 'en'

export type HeroContent = {
  eyebrow: string
  title: string
  tagline?: string
  description: string
  focusAreas?: string[]
  ctaLabel?: string
  products?: Array<{
    label: string
    headline: string
    description: string
    href: string
  }>
}

export type FeatureContent = {
  title: string
  sections?: Array<{
    heading: string
    description: string
  }>
}

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

function parseFrontMatter(raw: string): Record<string, unknown> {
  const frontMatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!frontMatterMatch) {
    return {}
  }

  const [, frontMatter] = frontMatterMatch
  try {
    const metadata = yaml.load(frontMatter) as Record<string, unknown>
    return metadata || {}
  } catch (error) {
    console.error('Failed to parse content frontmatter:', error)
    return {}
  }
}

function loadHomepageHero(language: Language): HeroContent | null {
  try {
    const filePath = path.join(CONTENT_ROOT, 'homepage', language, 'hero.md')
    const raw = readFileSync(filePath, 'utf-8')
    const metadata = parseFrontMatter(raw)
    return (metadata as HeroContent) || null
  } catch (error) {
    console.error(`Failed to read homepage hero content for ${language}:`, error)
    return null
  }
}

export function loadHeroContent(
  type: 'homepage',
  product?: never,
  language: Language = 'zh'
): HeroContent | null {
  try {
    if (type === 'homepage') {
      return loadHomepageHero(language)
    }
    return null
  } catch (error) {
    console.error(`Failed to load hero content for ${type}/${product}:`, error)
    return null
  }
}

export function loadFeatureContent(
  product: never,
  section: never,
  language: Language = 'zh'
): FeatureContent | null {
  try {
    // TODO: Implement feature content loading
    console.warn('Feature content loading not yet implemented')
    return null
  } catch (error) {
    console.error(`Failed to load feature content for ${product}/${section}:`, error)
    return null
  }
}
