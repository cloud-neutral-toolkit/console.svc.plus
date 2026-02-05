'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
    label: string
    href: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={item.href} className="inline-flex items-center">
                        {index > 0 && <ChevronRight className="w-4 h-4 text-[var(--color-text-subtle)] mx-1" />}
                        {index === items.length - 1 ? (
                            <span className="text-sm font-medium text-[var(--color-text-subtle)] cursor-default">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
