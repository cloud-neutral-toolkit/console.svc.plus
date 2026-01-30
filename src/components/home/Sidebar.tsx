'use client'

import React from 'react'
import { SidebarRoot } from '../layout/SidebarRoot'
import { HomeSidebarContent } from './HomeSidebarContent'

export default function Sidebar() {
  return (
    <SidebarRoot className="w-full rounded-lg border border-black/10 bg-white p-5 text-slate-800">
      <HomeSidebarContent />
    </SidebarRoot>
  )
}
