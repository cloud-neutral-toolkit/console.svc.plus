'use client'

const SANDBOX_NODE_BINDING_KEY = 'xcontrol.sandbox.node.binding.v1'

export type SandboxNodeBinding = {
  address: string
  name?: string
  updatedAt: number
  updatedBy?: string
}

export function getSandboxNodeBinding(): SandboxNodeBinding | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(SANDBOX_NODE_BINDING_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as SandboxNodeBinding
    if (typeof parsed?.address === 'string' && parsed.address.trim().length > 0) {
      return {
        address: parsed.address.trim(),
        name: typeof parsed.name === 'string' && parsed.name.trim().length > 0 ? parsed.name.trim() : undefined,
        updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
        updatedBy: typeof parsed.updatedBy === 'string' && parsed.updatedBy.trim().length > 0 ? parsed.updatedBy.trim() : undefined,
      }
    }
  } catch (error) {
    console.warn('Failed to parse sandbox node binding', error)
  }

  return null
}

export function setSandboxNodeBinding(binding: { address: string; name?: string; updatedBy?: string }) {
  if (typeof window === 'undefined') {
    return
  }

  const payload: SandboxNodeBinding = {
    address: binding.address.trim(),
    name: binding.name?.trim() || undefined,
    updatedAt: Date.now(),
    updatedBy: binding.updatedBy?.trim() || undefined,
  }

  window.localStorage.setItem(SANDBOX_NODE_BINDING_KEY, JSON.stringify(payload))
}

export function clearSandboxNodeBinding() {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(SANDBOX_NODE_BINDING_KEY)
}

