'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  MessageSquare,
  PenSquare,
  Package,
} from 'lucide-react'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../i18n/LanguageProvider'

const placeholderCount = 3

type ServiceCard = {
  key: string
  name: string
  description: string
  href: string
  icon: typeof Activity
  external?: boolean
}

export default function ServicesPage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'

  const services: ServiceCard[] = [
    {
      key: 'editor',
      name: isChinese ? '编辑器' : 'Editor',
      description: isChinese
        ? 'Markdown 发布与排版的在线编辑器。'
        : 'Markdown publishing and layout editor.',
      href: 'https://markdown-publisher.svc.plus',
      icon: PenSquare,
      external: true,
    },
    {
      key: 'wechat-to-markdown',
      name: isChinese ? '微信转 Markdown' : 'WeChat to Markdown',
      description: isChinese
        ? '一键将公众号内容转换为 Markdown。'
        : 'Convert WeChat articles into Markdown.',
      href: 'https://wechat-to-markdown.svc.plus',
      icon: MessageSquare,
      external: true,
    },
    {
      key: 'artifact',
      name: isChinese ? '制品 / 镜像' : 'Artifact / Mirror',
      description: isChinese
        ? '获取核心制品、镜像与下载资源。'
        : 'Get core artifacts, mirrors, and downloads.',
      href: '/download',
      icon: Package,
    },
    {
      key: 'cloudIac',
      name: isChinese ? '云 IaC 目录' : 'Cloud IaC Catalog',
      description: isChinese
        ? '浏览云基础设施目录与自动化蓝图。'
        : 'Browse cloud IaC catalog and automation blueprints.',
      href: '/cloud_iac',
      icon: Layers,
    },
    {
      key: 'insight',
      name: isChinese ? 'Insight 工作台' : 'Insight Workbench',
      description: isChinese
        ? '进入观测、告警与智能协作控制面。'
        : 'Observability, alerts, and AI-assisted operations.',
      href: '/insight',
      icon: Activity,
    },
    {
      key: 'docs',
      name: isChinese ? '文档 / 解决方案' : 'Docs / Solutions',
      description: isChinese
        ? '阅读文档、方案与产品指南。'
        : 'Read documentation, solutions, and guides.',
      href: '/docs',
      icon: BookOpen,
    },
  ]

  const placeholderLabel = isChinese ? '更多服务即将上线' : 'More services coming soon'
  const placeholderDescription = isChinese
    ? '预留卡片位置，持续扩充入口。'
    : 'Reserved slots for new service entries.'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_0,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(52,211,153,0.08),transparent_35%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <Navbar />
        <main className="space-y-10 pt-10">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              {isChinese ? '更多服务' : 'More services'}
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {isChinese ? '在这里进入所有扩展入口' : 'Access every extended entry point'}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              {isChinese
                ? '沿用当前主页布局的卡片网格，把新增工具与服务统一收拢。'
                : 'A card grid aligned with the current homepage layout for all services.'}
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => {
              const card = (
                <div className="group flex h-full flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-[1px] hover:border-indigo-400/50 hover:bg-slate-900/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200">
                      <service.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">{service.name}</div>
                      <p className="text-sm text-slate-300">{service.description}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-200 transition group-hover:text-white">
                    {isChinese ? '打开' : 'Open'}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              )

              if (service.external) {
                return (
                  <a
                    key={service.key}
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                )
              }

              return (
                <Link key={service.key} href={service.href} className="block">
                  {card}
                </Link>
              )
            })}

            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex h-full flex-col justify-between rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-slate-300"
              >
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/20 text-sm text-slate-400">
                    <FileText className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="text-sm font-semibold text-white/80">{placeholderLabel}</div>
                  <p className="text-sm text-slate-400">{placeholderDescription}</p>
                </div>
                <span className="mt-4 text-xs font-semibold text-slate-400">{isChinese ? '敬请期待' : 'Stay tuned'}</span>
              </div>
            ))}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
