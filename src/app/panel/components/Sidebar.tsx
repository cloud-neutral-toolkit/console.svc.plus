'use client'

import React from 'react'
import { SidebarRoot } from '../../../components/layout/SidebarRoot'
import { PanelSidebarContent, PanelSidebarContentProps } from './PanelSidebarContent'

export interface SidebarProps extends PanelSidebarContentProps {
  className?: string
}

export default function Sidebar({ className = '', onNavigate }: SidebarProps) {
  return (
    <SidebarRoot
      className={`w-64 border-r border-[color:var(--color-surface-border)] bg-[var(--color-surface-elevated)] p-6 text-[var(--color-text)] shadow-[var(--shadow-md)] backdrop-blur ${className}`}
    >
      <PanelSidebarContent onNavigate={onNavigate} />
    </SidebarRoot>
  )
}
