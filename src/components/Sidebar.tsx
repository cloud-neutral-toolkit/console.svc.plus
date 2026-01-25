'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Terminal,
  LayoutDashboard,
  Rocket,
  Database,
  Key,
  History,
  Settings,
  Plus,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deployments', label: 'Deployments', icon: Rocket },
  { href: '/resources', label: 'Resources', icon: Database },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/logs', label: 'Logs', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-surface-border flex-col justify-between p-6 bg-background dark:bg-background hidden md:flex">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Terminal className="size-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-text dark:text-heading text-base font-bold leading-tight">console.svc.plus</h1>
            <p className="text-primary text-xs font-medium uppercase tracking-wider">Eye-Care Mode</p>
          </div>
        </div>
        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-background-muted'
              }`}
            >
              <item.icon className="size-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity">
        <Plus className="size-5" />
        <span>New Project</span>
      </button>
    </aside>
  )
}

export default Sidebar
