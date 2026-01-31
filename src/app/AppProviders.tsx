'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '../components/theme'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { AskAIDialog } from '../components/AskAIDialog'
import { useMoltbotStore } from '../lib/moltbotStore'
import { cn } from '../lib/utils'

export function AppProviders({ children }: { children: ReactNode }) {
  const { isOpen, isMinimized, setIsOpen, setMinimized, close, mode } = useMoltbotStore()

  // Reserve space only in sidebar modes, not in overlay/float mode
  const reserveSpace = isOpen && !isMinimized && mode !== 'overlay'

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex flex-col min-h-screen">
          <div className={cn(
            "flex-1 flex flex-col relative w-full overflow-hidden transition-[padding] duration-300 ease-in-out",
            reserveSpace ? "pr-[400px]" : ""
          )}>
            <div className="flex-1 flex flex-col w-full relative">
              {children}
            </div>
            <AskAIDialog
              open={isOpen}
              onMinimize={() => {
                setIsOpen(false)
                setMinimized(true)
              }}
              onEnd={close}
            />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
