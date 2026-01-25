'use client'

export const dynamic = 'error'

import {
  AppWindow,
  ArrowRight,
  BookOpen,
  Command,
  Layers,
  Link,
  Lock,
  MousePointerClick,
  Play,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useUserStore } from '../lib/userStore'
import { useLanguage } from '../i18n/LanguageProvider'
import { translations } from '../i18n/translations'

const iconMap: Record<string, any> = {
  // English keys
  'Create your app': PlusCircle,
  'Register your app': ShieldCheck,
  'Deploy your app': Users,
  'Add a new user to your project': Users,
  'Register a new application': AppWindow,
  'Deploy your application': Command,
  'Invite a user': MousePointerClick,
  'Get started': Sparkles,
  'Creating your application': AppWindow,
  'More about Authentication': ShieldCheck,
  'Understanding Authorization': Lock,
  'Machine-to-Machine': Layers,
  'Connect via CLI': Terminal,
  'REST & Admin APIs': Link,
  // Chinese keys
  '创建您的应用': PlusCircle,
  '注册您的应用': ShieldCheck,
  '部署您的应用': Users,
  '向项目添加新用户': Users,
  '注册新应用程序': AppWindow,
  '部署您的应用程序': Command,
  '邀请用户': MousePointerClick,
  '开始使用': Sparkles,
  '创建您的应用程序': AppWindow,
  '关于身份验证': ShieldCheck,
  '了解授权': Lock,
  '机器对机器': Layers,
  '通过 CLI 连接': Terminal,
}

const getIcon = (key: string, fallback: any) => iconMap[key] || fallback

const nextSteps = [
  { title: 'Add a new user to your project', status: 'NEW', icon: Users },
  { title: 'Register a new application', status: 'NEW', icon: AppWindow },
  { title: 'Deploy your application', status: 'READY', icon: Command },
  { title: 'Invite a user', status: 'READY', icon: MousePointerClick },
]

const stats = [
  { value: '~150k', label: 'Applications integrated with Cloud-Neutral Toolkit' },
  { value: '~330k', label: 'Daily active users' },
  { value: '7', label: 'Go check out our examples & guides' },
]

const shortcuts = [
  { title: 'Get started', description: 'An overview of using Cloud-Neutral Toolkit', icon: Sparkles },
  { title: 'Creating your application', description: 'Integrate Cloud-Neutral Toolkit into your application', icon: AppWindow },
  {
    title: 'More about Authentication',
    description: 'Understand all about authenticating with Cloud-Neutral Toolkit',
    icon: ShieldCheck,
  },
  {
    title: 'Understanding Authorization',
    description: 'Scope out all about authorization using Cloud-Neutral Toolkit',
    icon: Lock,
  },
  { title: 'Machine-to-Machine', description: 'Integrate Cloud-Neutral Toolkit into your services', icon: Layers },
  { title: 'Connect via CLI', description: 'Connect Cloud-Neutral Toolkit with your application via CLI', icon: Terminal },
  {
    title: 'REST & Admin APIs',
    description: 'Programmatically integrate Cloud-Neutral Toolkit into your application',
    icon: Link,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-150">
      <div className="absolute inset-0 bg-gradient-app-from opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <Navbar />
        <main className="space-y-12 pt-10">
          <HeroSection />
          <NextStepsSection />
          <StatsSection />
          <ShortcutsSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

function HeroSection() {
  const { user } = useUserStore()
  const { language } = useLanguage()
  const t = translations[language].marketing.home

  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <p className="font-semibold uppercase tracking-wider text-text-subtle">{t.hero.eyebrow}</p>
          <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">{t.hero.title}</h1>
          <p className="text-lg text-text-muted">{t.hero.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {t.signedIn} as {user.username}
            </div>
          ) : (
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover">
              <PlusCircle className="h-4 w-4" />
              {t.heroButtons.create}
            </button>
          )}
          <button className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-6 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-hover">
            <Play className="h-4 w-4" />
            {t.heroButtons.playground}
          </button>
          <button className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-6 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-hover">
            <BookOpen className="h-4 w-4" />
            {t.heroButtons.tutorials}
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <p>{t.trustedBy}</p>
          <div className="flex gap-2">
            <LogoPill label="Vue" />
            <LogoPill label="Svelte" />
            <LogoPill label="Node" />
            <LogoPill label="Django" />
            <LogoPill label="Laravel" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {t.heroCards.map((card, index: number) => {
          const Icon = getIcon(card.title, PlusCircle)
          return (
            <div key={card.title} className="group flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6 transition hover:border-primary/50 hover:bg-surface-hover">
              <div className="mt-1 rounded-full border border-surface-border bg-surface-muted p-2 group-hover:border-primary/50 group-hover:text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-heading">{card.title}</h3>
                <p className="text-sm text-text-muted">{card.description}</p>
                <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:text-primary-hover">
                  Go to action <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function NextStepsSection() {
  const { language } = useLanguage()
  const t = translations[language].marketing.home

  return (
    <section className="space-y-4">
      <header className="flex items-center gap-3 text-sm text-text-muted">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-subtle">{t.nextSteps.title}</p>
        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-primary">{t.nextSteps.badge}</span>
      </header>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {t.nextSteps.items.map((item, index: number) => {
          const Icon = getIcon(item.title, Users)
          return (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface p-4 shadow-lg shadow-shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary-muted">
                  <span className="rounded-full bg-primary/20 px-2 py-0.5">{item.status}</span>
                </div>
                <p className="text-sm font-semibold text-heading">{item.title}</p>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-hover">
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function StatsSection() {
  const { language } = useLanguage()
  const t = translations[language].marketing.home

  return (
    <section className="rounded-2xl border border-surface-border bg-gradient-to-r from-surface-muted via-surface/0 to-surface-muted p-6 shadow-inner shadow-shadow-sm">
      <div className="grid gap-6 md:grid-cols-3">
        {t.stats.map((stat, index: number) => (
          <div key={index} className="space-y-1 text-center md:text-left">
            <div className="text-3xl font-semibold text-heading">{stat.value}</div>
            <p className="text-sm text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ShortcutsSection() {
  const { language } = useLanguage()
  const t = translations[language].marketing.home

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-subtle">{t.shortcuts.title}</p>
          <p className="text-sm text-text-muted">{t.shortcuts.subtitle}</p>
        </div>
        <div className="flex gap-2 text-xs font-semibold text-primary">
          <button className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 transition hover:bg-surface-hover">{t.shortcuts.buttons.start}</button>
          <button className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 transition hover:bg-surface-hover">{t.shortcuts.buttons.docs}</button>
          <button className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 transition hover:bg-surface-hover">{t.shortcuts.buttons.guides}</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {t.shortcuts.items.map((item, index: number) => {
          const Icon = getIcon(item.title, Sparkles)
          return (
            <a
              key={index}
              href="#"
              className="group flex items-start gap-3 rounded-xl border border-surface-border bg-surface p-4 transition hover:-translate-y-[1px] hover:border-primary/50 hover:bg-surface-hover"
            >
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-heading">{item.title}</div>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-text-subtle transition group-hover:text-primary" aria-hidden />
            </a>
          )
        })}
      </div>
    </section>
  )
}

function LogoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text">
      <div className="h-2 w-2 rounded-full bg-success" />
      {label}
    </span>
  )
}
