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

  const currentBinding = useMemo(() => getSandboxNodeBinding(), [])
  const [draftAddress, setDraftAddress] = useState<string>(currentBinding?.address ?? '')

  const isChanged = useMemo(() => {
    const current = getSandboxNodeBinding()
    return (current?.address ?? '') !== draftAddress
  }, [draftAddress])

  const handleApply = () => {
    const address = draftAddress.trim()
    if (!address) {
      clearSandboxNodeBinding()
      setMessage('已成功清空绑定节点')
    } else {
      const node = nodes?.find((item) => item.address === address)
      if (!node) {
        setMessage('错误：选择的节点不存在')
        return
      }
      setSandboxNodeBinding({
        address: node.address,
        name: node.name,
        updatedBy: 'root',
      })
      setMessage(`应用成功：已绑定至 ${node.name || node.address}`)
    }
  }

  const currentActive = getSandboxNodeBinding()

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Root 管理员专用：Sandbox Node 绑定节点</h2>
          <p className="text-sm text-gray-600">选择并“确认应用”后，Sandbox@svc.plus 将固定使用该节点生成配置。</p>
        </div>

        <div className="flex items-end gap-3">
          <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-gray-700">
            选择目标节点
            <select
              value={draftAddress}
              disabled={isLoading || !nodes}
              onChange={(e) => {
                setDraftAddress(e.target.value)
                setMessage(null)
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

          <button
            onClick={handleApply}
            disabled={!isChanged}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isChanged
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            确认应用
          </button>
        </div>

        <div className="space-y-1 rounded-md bg-gray-50 p-3">
          {currentActive ? (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              当前活跃绑定：<span className="font-bold">{currentActive.name || currentActive.address}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-2 w-2 rounded-full bg-gray-300" />
              当前未绑定任何节点
            </div>
          )}
          {currentActive?.updatedAt && (
            <p className="pl-4 text-[10px] text-gray-400">
              最后更新时间：{new Date(currentActive.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-600">⚠️ 节点列表加载失败：{error.message}</p>}
        {message && (
          <p className={`text-xs font-medium ${message.startsWith('错误') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </Card>
  )
}

