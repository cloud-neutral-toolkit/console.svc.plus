'use client'

export type SandboxNodeBinding = {
  address: string
  name?: string
  updatedAt: number
  updatedBy?: string
}

export async function fetchSandboxNodeBinding(): Promise<SandboxNodeBinding | null> {
  try {
    const response = await fetch('/api/sandbox/binding', { method: 'GET', cache: 'no-store' })
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
    console.warn('Failed to fetch sandbox node binding', error)
    return null
  }
}
