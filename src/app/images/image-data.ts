import fs from 'node:fs/promises'
import path from 'node:path'

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
export const imagesPerPage = 12

const getImagesDirectory = () => path.join(process.cwd(), 'public', 'images')

export async function getImageFiles() {
  try {
    const entries = await fs.readdir(getImagesDirectory(), { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'en'))
  } catch {
    return []
  }
}

export function paginateImages(files: string[], page: number) {
  const totalPages = Math.max(1, Math.ceil(files.length / imagesPerPage))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const startIndex = (currentPage - 1) * imagesPerPage
  const pagedFiles = files.slice(startIndex, startIndex + imagesPerPage)

  return {
    currentPage,
    totalPages,
    totalImages: files.length,
    pagedFiles,
  }
}
