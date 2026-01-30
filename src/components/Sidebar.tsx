'use client'

import React from 'react'
import { SidebarRoot } from './layout/SidebarRoot'
import { AppSidebarContent } from './AppSidebarContent'

export function Sidebar() {
  return (
    <SidebarRoot className="w-64 border-r border-surface-border p-6 bg-background dark:bg-background hidden md:flex justify-between">
      <AppSidebarContent />
    </SidebarRoot>
  )
}

export default Sidebar
