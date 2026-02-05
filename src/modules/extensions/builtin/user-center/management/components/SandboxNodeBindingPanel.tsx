'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import Card from '../../components/Card'
import type { VlessNode } from '../../lib/vless'
import {
  clearSandboxNodeBinding,
  getSandboxNodeBinding,
  setSandboxNodeBinding,
} from '../../lib/sandboxNodeBinding'

async function fetcher(url: string): Promise<VlessNode[]> {
  const response = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      (payload && typeof payload.message === 'string' && payload.message) ||
      (payload && typeof payload.error === 'string' && payload.error) ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  if (Array.isArray(payload)) {
    return payload as VlessNode[]
  }
  if (payload && Array.isArray((payload as { nodes?: unknown }).nodes)) {
    return (payload as { nodes: VlessNode[] }).nodes
  }
  return []
}

export default function SandboxNodeBindingPanel() {
  const { data: nodes, error, isLoading } = useSWR<VlessNode[]>('/api/agent-server/v1/nodes', fetcher, {
    revalidateOnFocus: false,
  })
  const [message, setMessage] = useState<string | null>(null)

  const current = getSandboxNodeBinding()
  const selectedAddress = current?.address ?? ''

  const selectedNode = useMemo(
    () => nodes?.find((node) => node.address === selectedAddress) ?? null,
    [nodes, selectedAddress],
  )

  return (
    <Card>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Root 管理员专用：Sandbox Node 绑定节点</h2>
        <p className="text-sm text-gray-600">仅允许绑定 1 个节点，Sandbox@svc.plus 会使用该节点生成 VLESS 配置。</p>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          绑定节点
          <select
            value={selectedAddress}
            disabled={isLoading || !nodes || nodes.length === 0}
            onChange={(event) => {
              const address = event.target.value.trim()
              if (!address) {
                clearSandboxNodeBinding()
                setMessage('已清空绑定节点')
                return
              }
              const node = nodes?.find((item) => item.address === address)
              if (!node) {
                setMessage('节点不存在，无法绑定')
                return
              }
              setSandboxNodeBinding({
                address: node.address,
                name: node.name,
                updatedBy: 'root',
              })
              setMessage(`已绑定：${node.name || node.address}`)
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="">不绑定（清空）</option>
            {(nodes ?? []).map((node) => (
              <option key={node.address} value={node.address}>
                {node.name} ({node.address})
              </option>
            ))}
          </select>
        </label>

        {selectedNode ? (
          <p className="text-xs text-gray-600">
            当前绑定：<span className="font-medium text-gray-800">{selectedNode.name || selectedNode.address}</span>
          </p>
        ) : null}
        {current?.updatedAt ? (
          <p className="text-xs text-gray-500">最后更新：{new Date(current.updatedAt).toLocaleString()}</p>
        ) : null}
        {error ? <p className="text-xs text-red-600">节点加载失败：{error.message}</p> : null}
        {message ? <p className="text-xs text-green-700">{message}</p> : null}
      </div>
    </Card>
  )
}

