'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '../components/theme'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { AskAIDialog } from '../components/AskAIDialog'
import { useMoltbotStore } from '../lib/moltbotStore'

export function AppProviders({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen, setMinimized, close } = useMoltbotStore()

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col relative w-full overflow-hidden">
            {children}
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
