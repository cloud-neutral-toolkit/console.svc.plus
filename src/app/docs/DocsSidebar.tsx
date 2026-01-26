'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight, ChevronDown, FileText } from 'lucide-react'
import type { DocCollection } from './types'

interface DocsSidebarProps {
    collections: DocCollection[]
}

export default function DocsSidebar({ collections }: DocsSidebarProps) {
    const pathname = usePathname()

    // Sort collections by title or defined order if any
    const sortedCollections = [...collections].sort((a, b) => a.title.localeCompare(b.title))

    return (
        <aside className="sticky top-[64px] hidden h-[calc(100vh-64px)] w-64 shrink-0 overflow-y-auto border-r border-surface-border bg-background py-6 pl-8 pr-4 lg:block">
            <nav className="space-y-6">
                {sortedCollections.map((collection) => (
                    <SidebarGroup
                        key={collection.slug}
                        collection={collection}
                        activePath={pathname}
                    />
                ))}
            </nav>
        </aside>
    )
}

function SidebarGroup({ collection, activePath }: { collection: DocCollection; activePath: string }) {
    const [isOpen, setIsOpen] = useState(true)

    // Check if any child is active to auto-expand (optional, defaulted to true for now)
    const isActive = collection.versions.some(v => activePath === `/docs/${collection.slug}/${v.slug}`)

    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-sm font-semibold text-heading transistion hover:text-primary"
            >
                <span>{collection.title}</span>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isOpen && (
                <ul className="space-y-1 border-l border-surface-border pl-4">
                    {collection.versions.map((version) => {
                        const href = `/docs/${collection.slug}/${version.slug}`
                        const isPageActive = activePath === href

                        return (
                            <li key={version.slug}>
                                <Link
                                    href={href}
                                    className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${isPageActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-text-muted hover:text-heading hover:bg-surface-muted'
                                        }`}
                                >
                                    {version.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
