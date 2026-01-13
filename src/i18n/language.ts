export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'zh'
export const LANGUAGE_COOKIE = 'onwalk.language'

export function normalizeLanguage(value: string | null | undefined): Language | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (normalized.startsWith('zh')) {
    return 'zh'
  }
  if (normalized.startsWith('en')) {
    return 'en'
  }
  return null
}
