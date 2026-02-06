'use client';

import { useState } from 'react';
import { ArrowRight, X, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';
import Link from 'next/link';

interface GuideStep {
    text: string;
    link?: { url: string; label: string };
    code?: string;
    image?: string;
}

interface HeroCardProps {
    icon: any;
    title: string;
    description: string;
    guide?: {
        title: string;
        steps: GuideStep[];
        dismiss: string;
    };
}

export function HeroCard({ icon: Icon, title, description, guide }: HeroCardProps) {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div
            className={cn(
                "group relative flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6 transition-all duration-300",
                showGuide ? "border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]" : "hover:border-primary/50 hover:bg-surface-hover"
            )}
            onMouseEnter={() => guide && setShowGuide(true)}
            onMouseLeave={() => setShowGuide(false)}
        >
            <div className="mt-1 rounded-full border border-surface-border bg-surface-muted p-2 group-hover:border-primary/50 group-hover:text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1 w-full">
                <h3 className="font-semibold text-heading">{title}</h3>
                <p className="text-sm text-text-muted">{description}</p>

                {/* Guide Content Overlay */}
                {guide && showGuide && (
                    <div className="absolute inset-x-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="rounded-xl border border-primary/20 bg-surface/95 backdrop-blur-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-surface-border pb-2">
                                <h4 className="font-semibold text-primary flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    {guide.title}
                                </h4>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowGuide(false);
                                    }}
                                    className="text-xs text-text-muted hover:text-text flex items-center gap-1"
                                >
                                    <X className="h-3 w-3" />
                                    {guide.dismiss}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {guide.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm text-text-subtle">
                                        <span className="flex-none flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <div className="space-y-2 flex-1">
                                            <p className="leading-tight">{step.text}</p>
                                            {step.link && (
                                                <Link
                                                    href={step.link.url}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline hover:text-primary-hover transition-colors"
                                                >
                                                    {step.link.label}
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            )}

                                            {/* Special handling for VLESS QR code hint */}
                                            {idx === 2 && (
                                                <div className="mt-2 p-3 bg-surface-muted rounded-lg border border-surface-border flex items-center gap-3">
                                                    <QrCode className="h-8 w-8 text-primary opacity-80" />
                                                    <div className="text-xs text-text-muted">
                                                        <p className="font-medium text-text">VLESS Protocol Ready</p>
                                                        <p>Scan QR code in panel</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
