export interface DocVersionOption {
  slug: string
  label: string
  title: string
  description: string
  updatedAt?: string
  tags?: string[]
  content: string
  isMdx: boolean
  category?: string
  subcategory?: boolean
}

export interface DocCollection {
  slug: string
  title: string
  description: string
  updatedAt?: string
  tags: string[]
  versions: DocVersionOption[]
  defaultVersionSlug: string
  category?: string
}
