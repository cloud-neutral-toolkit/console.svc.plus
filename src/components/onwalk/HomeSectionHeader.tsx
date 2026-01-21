'use client'

import { useOnwalkCopy } from '@/i18n/useOnwalkCopy'

type HomeSectionKey = 'blog' | 'image' | 'video'

export default function HomeSectionHeader({ section }: { section: HomeSectionKey }) {
  const copy = useOnwalkCopy()
  const data = copy.home.sections[section]

  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <h2 className="text-3xl font-bold text-heading">{data.title}</h2>
      <span className="text-sm font-medium text-text-muted">{data.subtitle}</span>
    </div>
  )
}
