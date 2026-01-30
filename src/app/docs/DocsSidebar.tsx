'use client'

import { usePathname } from 'next/navigation'
import type { DocCollection } from './types'
import { SidebarRoot } from '../../components/layout/SidebarRoot'
import { DocsSidebarContent } from './DocsSidebarContent'

interface DocsSidebarProps {
    collections: DocCollection[]
}

export default function DocsSidebar({ collections }: DocsSidebarProps) {
    const pathname = usePathname()

    return (
        <SidebarRoot className="sticky top-[64px] hidden h-[calc(100vh-64px)] w-72 shrink-0 border-r border-surface-border bg-background/50 backdrop-blur-sm py-8 pl-8 pr-4 lg:block">
            <DocsSidebarContent collections={collections} activePath={pathname} />
        </SidebarRoot>
    )
}
