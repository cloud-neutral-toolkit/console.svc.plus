'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from './store'
import type { ThemeName } from './types'

export function ThemeToggle() {
    const { resolvedTheme, setSystemTheme } = useThemeStore()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => {
        const nextTheme: ThemeName = resolvedTheme === 'dark' ? 'light' : 'dark'
        setSystemTheme(nextTheme)
    }

    return (
        <div className="fixed bottom-8 right-8 z-[60]">
            <button
                type="button"
                onClick={toggleTheme}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
                aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {resolvedTheme === 'dark' ? (
                    <span className="material-symbols-outlined text-yellow-400">light_mode</span>
                ) : (
                    <span className="material-symbols-outlined text-primary">dark_mode</span>
                )}
            </button>
        </div>
    )
}
