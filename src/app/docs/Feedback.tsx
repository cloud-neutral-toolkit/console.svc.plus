'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export default function Feedback() {
    const [voted, setVoted] = useState<'yes' | 'no' | null>(null)

    return (
        <div className="mt-16 border-t border-surface-border pt-8">
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-heading">Is this page helpful?</h3>
                {voted === null ? (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setVoted('yes')}
                            className="flex items-center gap-2 rounded-md border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:border-primary hover:text-primary"
                        >
                            <ThumbsUp className="h-4 w-4" />
                            Yes
                        </button>
                        <button
                            onClick={() => setVoted('no')}
                            className="flex items-center gap-2 rounded-md border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:border-danger hover:text-danger"
                        >
                            <ThumbsDown className="h-4 w-4" />
                            No
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-text-muted">Thanks for your feedback!</p>
                )}
            </div>
        </div>
    )
}
