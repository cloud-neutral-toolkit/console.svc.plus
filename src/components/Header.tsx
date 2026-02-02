'use client'

import Link from 'next/link'
import { Search, Bell, MoreHorizontal } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-surface-border px-8 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
          <span className="text-text-subtle">/</span>
          <span className="text-text">Services</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/docs" className="text-sm font-medium text-text-muted hover:text-primary">
            Docs
          </Link>
          <Link href="/docs" className="text-sm font-medium text-text-muted hover:text-primary">
            Support
          </Link>
          <Link href="/docs/04-postgresql/changelog" className="text-sm font-medium text-text-muted hover:text-primary">
            Changelog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-background-muted text-text-muted hover:bg-surface-hover">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-lg bg-background-muted text-text-muted hover:bg-surface-hover">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div
          className="size-9 rounded-full bg-cover bg-center border border-surface-border"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMO274a63Rewhe4ofDaKyaeM-BkdERDdwJNyaO-ElN1iQCTSygMpqhnCQEu_bWgmUdwjsGwf7GzVYusDOxgUYUCr8QMtjAe5WSsakKwZiibhOdL-MZFi6UwT7SI-cksOXFg2YetpNf7OlgMkIpTkCmN5jgTJHGMWg57fzLX7X3aTbFoo-FAbs35DUgsnq1RdpZxyc31bKuMOSf3GI1405x4w9p2NrDRdCZ6pEItauzYCfA9PmiUD1x1ZHnpanGSM0SKdz9AzxY7DE')" }}
          aria-label="User avatar"
        />
      </div>
    </header>
  )
}

export default Header
