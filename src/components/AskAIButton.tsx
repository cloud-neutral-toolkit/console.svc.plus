'use client'

import { Bot } from 'lucide-react'
import { AskAIDialog, type InitialQuestionPayload } from './AskAIDialog'
import { useMoltbotStore } from '@lib/moltbotStore'
import { useAccess } from '@lib/accessControl'
import { cn } from '@lib/utils'

type AskAIButtonProps = {
  variant?: 'floating' | 'navbar'
  initialQuestion?: InitialQuestionPayload
}

export function AskAIButton({ variant = 'floating', initialQuestion }: AskAIButtonProps) {
  const { isOpen, isMinimized, setIsOpen, setMinimized, close } = useMoltbotStore()
  const { allowed, isLoading } = useAccess({ allowGuests: true })
  const isFloating = variant === 'floating'
  const isNavbar = variant === 'navbar'

  if (!allowed && !isLoading) {
    return null
  }

  const handleOpen = () => {
    setIsOpen(true)
    setMinimized(false)
  }
  const handleMinimize = () => {
    if (isFloating) {
      setMinimized(true)
    }
    setIsOpen(false)
  }
  const handleEnd = () => {
    close()
  }

  const buttonClassName = cn(
    isFloating
      ? "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary text-white shadow-lg transition hover:bg-primary-hover"
      : "flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-text-muted transition hover:border-primary-muted hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background",
    isFloating && isMinimized ? 'h-12 w-12 justify-center' : isFloating ? 'px-4 py-3' : ''
  )

  const showTrigger = isFloating ? !isOpen : true

  return (
    <>
      {showTrigger ? (
        <button type="button" onClick={handleOpen} className={buttonClassName} aria-expanded={isOpen} aria-label="Ask AI">
          <Bot className="h-4 w-4" />
          {!isNavbar && (!isMinimized || !isFloating) && <span className="text-sm">Ask AI</span>}
        </button>
      ) : null}
    </>
  )
}
