import { promises as fs } from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { getStorageClient } from '../server/storage'

export type FrontMatterValue = string | string[]

export interface MarkdownFile {
  metadata: Record<string, FrontMatterValue>
  content: string
  raw: string
  slug: string
}

export type MarkdownSource =
  | { type: 'filesystem'; filePath: string }
  | { type: 'volume'; filePath: string }
  | { type: 'http'; url: string; headers?: Record<string, string> }
  | { type: 'storage'; key: string }

const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')
const DEFAULT_EXTENSIONS = ['.md']

function normalizeMetadata(data: Record<string, unknown>): Record<string, FrontMatterValue> {
  return Object.entries(data).reduce<Record<string, FrontMatterValue>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value
    } else if (Array.isArray(value)) {
      const items = value.filter((item): item is string => typeof item === 'string')
      if (items.length) {
        acc[key] = items
      }
    } else if (value != null) {
      acc[key] = String(value)
    }
    return acc
  }, {})
}

export async function loadMarkdownSource(source: MarkdownSource): Promise<string> {
  switch (source.type) {
    case 'filesystem':
    case 'volume': {
      return fs.readFile(source.filePath, 'utf-8')
    }
    case 'http': {
      const response = await fetch(source.url, { headers: source.headers })
      if (!response.ok) {
        throw new Error(`Failed to fetch Markdown from ${source.url}: ${response.status} ${response.statusText}`)
      }
      return response.text()
    }
    case 'storage': {
      const client = await getStorageClient()
      const data = await client.getObject(source.key)
      return data.toString('utf-8')
    }
    default:
      throw new Error('Unsupported Markdown source')
  }
}

async function resolveFilePath(relativePath: string, baseDir: string, extensions: string[]): Promise<string> {
  const targetPath = path.isAbsolute(relativePath) ? relativePath : path.join(baseDir, relativePath)
  const hasExtension = Boolean(path.extname(targetPath))
  const candidatePaths = hasExtension ? [targetPath] : extensions.map((ext) => `${targetPath}${ext}`)

  for (const candidate of candidatePaths) {
    try {
      await fs.access(candidate)
      return candidate
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  throw new Error(`Markdown file not found at ${relativePath}`)
}

export async function readMarkdownFile(
  relativePath: string,
  options?: { baseDir?: string; extensions?: string[] }
): Promise<MarkdownFile> {
  const baseDir = options?.baseDir ?? DEFAULT_CONTENT_ROOT
  const extensions = options?.extensions ?? DEFAULT_EXTENSIONS
  const absolutePath = await resolveFilePath(relativePath, baseDir, extensions)
  const raw = await loadMarkdownSource({ type: 'filesystem', filePath: absolutePath })
  const { data, content } = matter(raw)
  const normalizedPath = path.relative(baseDir, absolutePath)
  const withoutExtension = normalizedPath.replace(new RegExp(`${path.extname(normalizedPath)}$`), '')
  const slug = withoutExtension.split(path.sep).join('/')

  return {
    metadata: normalizeMetadata(data as Record<string, unknown>),
    content: content.trim(),
    raw,
    slug,
  }
}

export async function readMarkdownDirectory(
  relativeDir: string,
  options?: { baseDir?: string; recursive?: boolean; extensions?: string[] }
): Promise<MarkdownFile[]> {
  const baseDir = options?.baseDir ?? DEFAULT_CONTENT_ROOT
  const extensions = options?.extensions ?? DEFAULT_EXTENSIONS
  const dirPath = path.isAbsolute(relativeDir) ? relativeDir : path.join(baseDir, relativeDir)
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const files = entries.filter(
    (entry) => entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())
  )

  const results = await Promise.all(
    files.map((file) => readMarkdownFile(path.join(relativeDir, file.name), { baseDir, extensions }))
  )

  if (!options?.recursive) {
    return results
  }

  const nestedDirectories = entries.filter((entry) => entry.isDirectory())
  const nestedResults = await Promise.all(
    nestedDirectories.map((dir) =>
      readMarkdownDirectory(path.join(relativeDir, dir.name), { baseDir, recursive: true, extensions })
    )
  )

  return results.concat(...nestedResults)
}
