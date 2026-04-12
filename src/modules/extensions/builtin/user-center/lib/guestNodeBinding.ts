'use client'

export type GuestNodeBinding = {
  address: string
  name?: string
  updatedAt: number
  updatedBy?: string
}

export async function fetchGuestNodeBinding(): Promise<GuestNodeBinding | null> {
  try {
    const response = await fetch('/api/guest/binding', { method: 'GET', cache: 'no-store' })
    if (!response.ok) {
      return null
    }
    const payload = (await response.json().catch(() => null)) as any
    if (!payload || typeof payload.address !== 'string') {
      return null
    }
    const address = payload.address.trim()
    if (!address) {
      return null
    }
    return {
      address,
      name: typeof payload.name === 'string' && payload.name.trim().length > 0 ? payload.name.trim() : undefined,
      updatedAt: typeof payload.updatedAt === 'number' ? payload.updatedAt : Date.now(),
      updatedBy:
        typeof payload.updatedBy === 'string' && payload.updatedBy.trim().length > 0 ? payload.updatedBy.trim() : undefined,
    }
  } catch (error) {
    console.warn('Failed to fetch guest node binding', error)
    return null
  }
}
