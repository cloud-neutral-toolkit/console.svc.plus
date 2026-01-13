import { cookies, headers } from 'next/headers'

import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, normalizeLanguage, type Language } from '@/i18n/language'

function parseAcceptLanguage(value: string | null): Language | null {
  if (!value) {
    return null
  }

  const candidates = value.split(',')
  for (const candidate of candidates) {
    const token = candidate.split(';')[0]?.trim()
    const normalized = normalizeLanguage(token)
    if (normalized) {
      return normalized
    }
  }

  return null
}

export async function getPreferredLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const cookieValue = normalizeLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value)
  if (cookieValue) {
    return cookieValue
  }

  const headerStore = await headers()
  const headerValue = parseAcceptLanguage(headerStore.get('accept-language'))
  return headerValue ?? DEFAULT_LANGUAGE
}
