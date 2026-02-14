'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '../components/theme'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { AskAIDialog } from '../components/AskAIDialog'
import { useMoltbotStore } from '../lib/moltbotStore'
import { cn } from '../lib/utils'

export function AppProviders({ children }: { children: ReactNode }) {
  const { isOpen, isMinimized, setIsOpen, setMinimized, close, mode, toggleOpen } = useMoltbotStore()

  // Always reserve space if open and not minimized, since we only have "Float/Sidebar" mode now
  // and user wants it to NEVER cover the homepage.
  const reserveSpace = isOpen && !isMinimized

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
              onMinimize={toggleOpen}
              onEnd={close}
            />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
