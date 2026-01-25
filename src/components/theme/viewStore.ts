'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import React from 'react'

interface ViewState {
  view: 'classic' | 'material'
  setView: (view: 'classic' | 'material') => void
}

const useViewStoreBase = create<ViewState>()(
  persist(
    (set) => ({
      view: 'classic',
      setView: (view) => set({ view }),
    }),
    {
      name: 'view-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const useViewStore = () => {
  const store = useViewStoreBase()
  const [isHydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return { ...store, isHydrated }
}
