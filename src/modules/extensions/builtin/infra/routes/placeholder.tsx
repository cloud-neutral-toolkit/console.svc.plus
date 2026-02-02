'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function PlaceholderPage() {
    const pathname = usePathname()
    const title = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page'

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <span className="text-2xl font-bold uppercase">{title.charAt(0)}</span>
            </div>
            <h1 className="text-3xl font-bold text-heading mb-3 capitalize">{title}</h1>
            <p className="text-text-muted max-w-md">
                This feature is currently under active development.
                It will soon provide a powerful interface for managing your {title.toLowerCase()}.
            </p>
        </div>
    )
}
