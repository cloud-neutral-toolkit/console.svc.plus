'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'

import { useUserStore } from '@lib/userStore'
import type { UserRole } from '@lib/userStore'
import { useLanguage } from '@i18n/LanguageProvider'
import { translations } from '@i18n/translations'

const ROLE_BADGES: Record<UserRole, { label: string; className: string }> = {
  guest: {
    label: 'Guest',
    className: 'bg-[var(--color-badge-muted)] text-[var(--color-text-subtle)]',
  },
  user: {
    label: 'User',
    className: 'bg-[var(--color-accent-muted)] text-[var(--color-accent-foreground)]',
  },
  operator: {
    label: 'Operator',
    className: 'bg-[var(--color-success-muted)] text-[var(--color-success-foreground)]',
  },
  admin: {
    label: 'Admin',
    className: 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]',
  },
}

interface HeaderProps {
  onMenu: () => void
  onCollapse?: () => void
  isCollapsed?: boolean
}

function resolveAccountInitial(input?: string | null) {
  if (!input) {
    return '?'
  }

  const normalized = input.trim()
  if (!normalized) {
    return '?'
  }

  return normalized.charAt(0).toUpperCase()
}

export default function Header({ onMenu, onCollapse, isCollapsed }: HeaderProps) {
  const { language } = useLanguage()
  const user = useUserStore((state) => state.user)
  const isLoading = useUserStore((state) => state.isLoading)
  const role: UserRole = user?.role ?? 'guest'
  const badge = ROLE_BADGES[role]
  const accountLabel = user?.name ?? user?.username ?? user?.email ?? 'Guest user'
  const accountInitial = resolveAccountInitial(accountLabel)
  const statusBadge = isLoading ? 'Syncing' : badge.label
  const badgeClasses = isLoading
    ? 'bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)] opacity-70'
    : badge.className

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--color-surface-border)] bg-[var(--color-surface-translucent)] px-4 py-3 text-[var(--color-text)] shadow-[var(--shadow-sm)] backdrop-blur transition-colors md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-surface-border)] px-3 py-2 text-sm font-medium text-[var(--color-text-subtle)] transition-colors hover:border-[color:var(--color-primary-border)] hover:text-[var(--color-primary)] md:hidden"
          onClick={onMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>

        {onCollapse && (
          <button
            type="button"
            className="hidden items-center justify-center rounded-lg border border-[color:var(--color-surface-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-subtle)] transition-colors hover:border-[color:var(--color-primary-border)] hover:text-[var(--color-primary)] md:flex"
            onClick={onCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:justify-end">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-surface-border)] px-3 py-2 text-sm font-medium text-[var(--color-text-subtle)] transition-colors hover:border-[color:var(--color-primary-border)] hover:text-[var(--color-primary)]"
          >
            返回主页
          </Link>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses}`}>{statusBadge}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] text-sm font-semibold text-[var(--color-primary-foreground)] shadow-[var(--shadow-sm)] transition-colors">
            {isLoading ? <span className="animate-pulse">…</span> : accountInitial}
          </div>
          <div className="hidden flex-col text-right text-xs text-[var(--color-text-subtle)] transition-colors sm:flex">
            <span className="text-sm font-semibold text-[var(--color-text)]">{accountLabel}</span>
            <span>{user?.email ?? (isLoading ? 'Checking session…' : 'Not signed in')}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
