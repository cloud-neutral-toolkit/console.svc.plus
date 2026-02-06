'use client'

import { useEffect, useMemo, useState } from 'react'

import Card from '../../components/Card'
import { useUserStore } from '@lib/userStore'

type AssumeStatus = {
  isAssuming: boolean
  target?: string
}

const SANDBOX_EMAIL = 'sandbox@svc.plus'

async function fetchAssumeStatus(): Promise<AssumeStatus> {
  const res = await fetch('/api/sandbox/assume/status', { method: 'GET', cache: 'no-store', credentials: 'include' })
  const payload = (await res.json().catch(() => null)) as any
  return {
    isAssuming: Boolean(payload?.isAssuming),
    target: typeof payload?.target === 'string' ? payload.target : undefined,
  }
}

export default function RootAssumeSandboxPanel() {
  const user = useUserStore((state) => state.user)

  const isRoot = useMemo(() => {
    const email = user?.email?.trim().toLowerCase() ?? ''
    return email === 'admin@svc.plus' && Boolean(user?.isAdmin)
  }, [user?.email, user?.isAdmin])

  const [status, setStatus] = useState<AssumeStatus>({ isAssuming: false })
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Future-proof: allowlist targets can be extended later.
  const [draftTarget, setDraftTarget] = useState<string>(SANDBOX_EMAIL)

  // Two-step confirmation (select -> confirm apply).
  const [pendingConfirm, setPendingConfirm] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        setIsLoading(true)
        const next = await fetchAssumeStatus()
        if (cancelled) return
        setStatus(next)
      } catch (error) {
        if (cancelled) return
        setStatus({ isAssuming: false })
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleAssume = async () => {
    if (!isRoot || isBusy) return
    try {
      setIsBusy(true)
      setMessage(null)
      const res = await fetch('/api/sandbox/assume', { method: 'POST', cache: 'no-store', credentials: 'include' })
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as any
        throw new Error((payload && (payload.message || payload.error)) || `Assume failed (${res.status})`)
      }
      setMessage('已切换到 Sandbox 视角（只读）')
      // Hard refresh ensures the new xc_session cookie is used everywhere immediately.
      window.location.reload()
    } catch (error) {
      setMessage(`错误：${error instanceof Error ? error.message : '切换失败'}`)
    } finally {
      setIsBusy(false)
    }
  }

  const handleRevert = async () => {
    if (!isRoot || isBusy) return
    try {
      setIsBusy(true)
      setMessage(null)
      const res = await fetch('/api/sandbox/assume/revert', { method: 'POST', cache: 'no-store', credentials: 'include' })
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as any
        throw new Error((payload && (payload.message || payload.error)) || `Revert failed (${res.status})`)
      }
      setMessage('已退出 Sandbox，恢复 Root 会话')
      window.location.reload()
    } catch (error) {
      setMessage(`错误：${error instanceof Error ? error.message : '退出失败'}`)
    } finally {
      setIsBusy(false)
    }
  }

  const confirmLabel = status.isAssuming ? '确认退出' : '确认切换'
  const primaryDisabled = !isRoot || isBusy || isLoading

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Root 管理员专用：Assume 调试入口</h2>
          <p className="text-sm text-gray-600">
            Root 可切换到 Sandbox 视角执行排查，但权限仍受 Sandbox 账号限制（只读）。后续可扩展 allowlist 以协助其他用户调试。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-gray-700">
            调试目标（白名单）
            <select
              value={draftTarget}
              disabled={primaryDisabled || status.isAssuming}
              onChange={(e) => {
                setDraftTarget(e.target.value)
                setPendingConfirm(false)
                setMessage(null)
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value={SANDBOX_EMAIL}>sandbox@svc.plus</option>
            </select>
          </label>

          <div className="flex gap-2">
            {pendingConfirm ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (status.isAssuming) {
                      void handleRevert()
                    } else {
                      void handleAssume()
                    }
                  }}
                  disabled={primaryDisabled || (!status.isAssuming && draftTarget !== SANDBOX_EMAIL)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {isBusy ? '处理中…' : confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingConfirm(false)}
                  disabled={isBusy}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPendingConfirm(true)
                  setMessage(null)
                }}
                disabled={primaryDisabled}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
              >
                {status.isAssuming ? '退出 Sandbox' : '切换到 Sandbox'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1 rounded-md bg-gray-50 p-3">
          {status.isAssuming ? (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              当前处于 Assume：<span className="font-bold">{status.target || SANDBOX_EMAIL}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-2 w-2 rounded-full bg-gray-300" />
              当前未处于 Assume
            </div>
          )}
          <p className="pl-4 text-[10px] text-gray-400">
            安全约束：目标白名单硬编码；Sandbox 禁止密码登录；Assume 仅 root 可用；`xc_session_root` 为 host-only httpOnly。
          </p>
        </div>

        {message ? (
          <p className={`text-xs font-medium ${message.startsWith('错误') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        ) : null}
      </div>
    </Card>
  )
}

