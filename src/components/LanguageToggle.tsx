'use client'
import { useLanguage } from '../i18n/LanguageProvider'

type Props = {
  className?: string
}

export default function LanguageToggle({ className = '' }: Props) {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
      className={`rounded border border-surface-border bg-surface px-2 py-1 text-sm text-text ${className}`}
    >
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  )
}
