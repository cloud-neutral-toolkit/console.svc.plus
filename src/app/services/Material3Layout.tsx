'use client'

import React from 'react'
import { Header } from '../../components/Header'

interface Material3LayoutProps {
  children: React.ReactNode
}

export function Material3Layout({ children }: Material3LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Material3Layout
