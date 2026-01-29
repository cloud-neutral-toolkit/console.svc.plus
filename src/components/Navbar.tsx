'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { translations } from '../i18n/translations'
import LanguageToggle from './LanguageToggle'
import { AskAIButton } from './AskAIButton'
import ReleaseChannelSelector, { ReleaseChannel } from './ReleaseChannelSelector'
import { useUserStore } from '@lib/userStore'
// import SearchComponent from './search'

const CHANNEL_ORDER: ReleaseChannel[] = ['stable', 'beta', 'develop']
const DEFAULT_CHANNELS: ReleaseChannel[] = ['stable']
const RELEASE_CHANNEL_STORAGE_KEY = 'cloudnative-suite.releaseChannels'

type NavSubItem = {
  key: string
  label: string
  href: string
  togglePath?: string
  channels?: ReleaseChannel[]
  enabled?: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const isHiddenRoute = pathname
    ? ['/login', '/register', '/xstream', '/xcloudflow', '/xscopehub', '/blogs'].some((prefix) =>
      pathname.startsWith(prefix),
    )
    : false
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedChannels, setSelectedChannels] = useState<ReleaseChannel[]>(['stable'])
  const navRef = useRef<HTMLElement | null>(null)
  const { language } = useLanguage()
  const user = useUserStore((state) => state.user)
  const nav = translations[language].nav
  const accountCopy = nav.account
  const accountInitial =
    user?.username?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? '?'
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(RELEASE_CHANNEL_STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as unknown
      if (!Array.isArray(parsed)) return

      const normalized = CHANNEL_ORDER.filter((channel) => parsed.includes(channel))
      if (normalized.length === 0) return

      const restored: ReleaseChannel[] = normalized.includes('stable')
        ? normalized
        : [...DEFAULT_CHANNELS, ...normalized]
      setSelectedChannels((current) => {
        if (current.length === restored.length && current.every((value, index) => value === restored[index])) {
          return current
        }
        return restored
      })
    } catch (error) {
      console.warn('Failed to restore release channels selection', error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(RELEASE_CHANNEL_STORAGE_KEY, JSON.stringify(selectedChannels))
  }, [selectedChannels])

  useEffect(() => {
    if (!accountMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [accountMenuOpen])

  useEffect(() => {
    setAccountMenuOpen(false)
  }, [user])

  const accountChildren: NavSubItem[] = user
    ? [
      {
        key: 'userCenter',
        label: accountCopy.userCenter,
        href: '/panel',
        togglePath: '/panel',
      },
      ...(user?.isAdmin || user?.isOperator
        ? [
          {
            key: 'management',
            label: accountCopy.management,
            href: '/panel/management',
            togglePath: '/panel/management',
          } satisfies NavSubItem,
        ]
        : []),
      {
        key: 'logout',
        label: accountCopy.logout,
        href: '/logout',
      },
    ]
    : [
      {
        key: 'register',
        label: nav.account.register,
        href: '/register',
        togglePath: '/register',
      },
      {
        key: 'login',
        label: nav.account.login,
        href: '/login',
        togglePath: '/login',
      },
      {
        key: 'demo',
        label: nav.account.demo,
        href: '/demo',
        togglePath: '/demo',
      },
    ]

  const accountLabel = nav.account.title

  const toggleChannel = (channel: ReleaseChannel) => {
    if (channel === 'stable') return
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((value) => value !== channel) : [...prev, channel],
    )
  }

  const isChinese = language === 'zh'
  const labels = {
    home: isChinese ? '首页' : 'Home',
    docs: isChinese ? '文档' : 'Docs',
    download: isChinese ? '博客' : 'blog',
    openSource: isChinese ? '开源项目' : 'Open source',
    about: isChinese ? '关于' : 'About',
    moreServices: isChinese ? '更多服务' : 'More services',
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const element = navRef.current
    if (!element) {
      return
    }

    const updateOffset = () => {
      const height = element.getBoundingClientRect().height
      document.documentElement.style.setProperty('--app-shell-nav-offset', `${height}px`)
    }

    updateOffset()

    const resizeObserver = new ResizeObserver(() => {
      updateOffset()
    })

    resizeObserver.observe(element)
    window.addEventListener('resize', updateOffset)

    return () => {
      window.removeEventListener('resize', updateOffset)
      resizeObserver.disconnect()
    }
  }, [])

  const mainLinks = [
    { key: 'home', label: labels.home, href: '/' },
    { key: 'docs', label: labels.docs, href: '/docs' },
  ]

  const downloadLink = { key: 'blog', label: labels.download, href: '/blogs' }

  const servicesLink = {
    key: 'services',
    label: labels.moreServices,
    href: '/services',
  }

  const openSourceProjects = [
    { key: 'xstream', label: 'XStream', href: '/xstream' },
    { key: 'xcloudflow', label: 'XCloudFlow', href: '/xcloudflow' },
    { key: 'xscopehub', label: 'XScopeHub', href: '/xscopehub' },
  ]

  if (isHiddenRoute) {
    return null
  }

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/95 text-text backdrop-blur transition-colors duration-150"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="flex items-center gap-5 py-3">
            <div className="flex flex-1 items-center gap-5">
              <Link href="/" className="flex items-center gap-2 rounded-md border border-surface-border bg-surface-muted/60 px-2.5 py-1.5 text-sm font-medium text-text/90 transition hover:bg-surface-hover/60">
                <Image
                  src="/icons/cloudnative_32.png"
                  alt="logo"
                  width={24}
                  height={24}
                  className="h-[20px] w-[20px] opacity-90"
                  unoptimized
                />
                <span className="text-sm font-medium opacity-90 text-text">Cloud-Neutral</span>
              </Link>
              <div className="hidden items-center gap-5 text-sm font-medium text-text-muted lg:flex">
                {mainLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="text-sm opacity-80 transition hover:text-primary hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  key={downloadLink.key}
                  href={downloadLink.href}
                  className="text-sm opacity-80 transition hover:text-primary hover:opacity-100"
                >
                  {downloadLink.label}
                </Link>
                <div className="group relative">
                  <button className="flex items-center gap-1 text-sm opacity-80 transition hover:text-primary hover:opacity-100">
                    <span>{labels.openSource}</span>
                    <svg
                      className="h-4 w-4 text-text-subtle transition group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full hidden min-w-[200px] translate-y-1 rounded-lg border border-surface-border bg-surface/95 py-2 text-sm text-text opacity-0 shadow-shadow-md transition-all duration-200 group-hover:block group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:block group-focus-within:translate-y-2 group-focus-within:opacity-100">
                    {openSourceProjects.map((project) => (
                      <Link
                        key={project.key}
                        href={project.href}
                        className="block px-4 py-2 text-sm opacity-80 transition hover:bg-primary/10 hover:text-primary hover:opacity-100"
                      >
                        {project.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/about"
                  className="text-sm opacity-80 transition hover:text-primary hover:opacity-100"
                >
                  {labels.about}
                </Link>
                <Link
                  key={servicesLink.key}
                  href={servicesLink.href}
                  className="text-sm opacity-80 transition hover:text-primary hover:opacity-100"
                >
                  {servicesLink.label}
                </Link>
              </div>
            </div>

            <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
              {/* <SearchComponent className="relative w-full max-w-xs" /> */}
              {user ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white shadow-shadow-sm transition hover:from-primary-hover hover:to-accent focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background"
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                  >
                    {accountInitial}
                  </button>
                  {accountMenuOpen ? (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-surface-border bg-surface/95 shadow-shadow-md">
                      <div className="border-b border-surface-border bg-surface-muted px-4 py-3">
                        <p className="text-sm font-semibold text-text">{user.username}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                      <div className="py-1 text-sm text-text">
                        <Link
                          href="/panel"
                          className="block px-4 py-2 text-sm opacity-80 transition hover:bg-primary/10 hover:opacity-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          {accountCopy.userCenter}
                        </Link>
                        <Link
                          href="/logout"
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-danger-foreground opacity-80 transition hover:bg-danger/10 hover:opacity-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          {accountCopy.logout}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                  <Link
                    href="/login"
                    className="text-sm opacity-80 transition hover:text-primary hover:opacity-100"
                  >
                    {nav.account.login}
                  </Link>
                  <span className="h-3 w-px bg-surface-border" aria-hidden="true" />
                  <Link
                    href="/register"
                    className="rounded-md border border-surface-border px-3 py-1 text-primary transition hover:border-primary/40 hover:bg-surface-muted"
                  >
                    {nav.account.register}
                  </Link>
                </div>
              )}
              {/* Mail feature temporarily disabled */}
              <LanguageToggle />
              <ReleaseChannelSelector
                selected={selectedChannels}
                onToggle={toggleChannel}
                variant="icon"
              />
            </div>

            <button
              className="flex items-center text-text focus:outline-none lg:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {menuOpen ? (
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:hidden">
              <div className="flex flex-col gap-4 border-t border-surface-border py-3 text-text">
                {/*
                <SearchComponent
                  className="relative"
                  buttonClassName="h-8 w-8"
                  inputClassName="py-2 pr-12"
                />
                */}
                <div className="flex flex-col gap-2 text-sm font-medium">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className="py-2 text-sm opacity-80 transition hover:opacity-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/about"
                    className="py-2 text-sm opacity-80 transition hover:opacity-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    {labels.about}
                  </Link>
                  <Link
                    key={servicesLink.key}
                    href={servicesLink.href}
                    className="py-2 text-sm opacity-80 transition hover:opacity-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    {servicesLink.label}
                  </Link>
                </div>
                {user ? (
                  <div className="rounded-xl border border-surface-border bg-surface-muted/80 p-4 text-text shadow-shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                        {accountInitial}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/panel"
                      className="mt-3 inline-flex items-center justify-center rounded-md border border-surface-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/10"
                      onClick={() => setMenuOpen(false)}
                    >
                      {accountCopy.userCenter}
                    </Link>
                    <Link
                      href="/logout"
                      className="mt-3 inline-flex items-center justify-center rounded-md border border-surface-border px-3 py-1.5 text-xs font-semibold text-danger transition hover:border-danger/60 hover:bg-danger/10 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:ring-offset-2 focus:ring-offset-background"
                      onClick={() => setMenuOpen(false)}
                    >
                      {accountCopy.logout}
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Link
                      href="/login"
                      className="py-2 text-sm opacity-80 transition hover:opacity-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {nav.account.login}
                    </Link>
                    <span className="h-3 w-px bg-surface-border" aria-hidden="true" />
                    <Link
                      href="/register"
                      className="rounded-md border border-surface-border px-3 py-1.5 text-primary transition hover:border-primary/50 hover:bg-surface-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      {nav.account.register}
                    </Link>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <ReleaseChannelSelector selected={selectedChannels} onToggle={toggleChannel} />
                  <LanguageToggle />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      <AskAIButton />

    </>
  )
}
