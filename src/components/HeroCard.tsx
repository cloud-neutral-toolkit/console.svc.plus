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
                showGuide ? "border-primary/50 shadow-lg ring-1 ring-primary/20" : "hover:border-primary/50 hover:bg-surface-hover"
            )}
            onMouseEnter={() => guide && setShowGuide(true)}
            onMouseLeave={() => setShowGuide(false)}
        >
            <div className="mt-1 rounded-full border border-surface-border bg-surface-muted p-2 group-hover:border-primary/50 group-hover:text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1 w-full">
                <h3 className="font-semibold text-heading">{title}</h3>
                <p className="text-sm text-text-muted transition-opacity duration-200" style={{ opacity: showGuide ? 0.3 : 1 }}>
                    {description}
                </p>

                {/* Guide Content Overlay */}
                {guide && (
                    <div
                        className={cn(
                            "absolute inset-x-0 top-16 mx-4 z-50 transition-all duration-300 ease-out origin-top",
                            showGuide
                                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                        )}
                    >
                        <div className="rounded-xl border border-surface-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-5 space-y-4 ring-1 ring-black/5 dark:ring-white/10">
                            <div className="flex items-center justify-between border-b border-surface-border/50 pb-3">
                                <h4 className="font-semibold text-primary flex items-center gap-2 text-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    {guide.title}
                                </h4>
                            </div>

                            <div className="space-y-4">
                                {guide.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm text-text-subtle group/step">
                                        <span className={cn(
                                            "flex-none flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold transition-colors",
                                            "bg-surface-muted text-text-muted group-hover/step:bg-primary/10 group-hover/step:text-primary"
                                        )}>
                                            {idx + 1}
                                        </span>
                                        <div className="space-y-1.5 flex-1">
                                            <p className="leading-snug text-xs">{step.text}</p>
                                            {step.link && (
                                                <Link
                                                    href={step.link.url}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover hover:underline underline-offset-2 transition-colors"
                                                >
                                                    {step.link.label}
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            )}

                                            {/* Special handling for VLESS QR code hint */}
                                            {idx === 2 && (
                                                <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface-muted/50 p-2 transition-colors hover:border-primary/30 hover:bg-surface-muted">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white p-0.5">
                                                        <QrCode className="h-full w-full text-black" />
                                                    </div>
                                                    <div className="text-[10px] text-text-muted leading-tight">
                                                        <p className="font-medium text-text">VLESS Protocol Ready</p>
                                                        <p>Scan main panel QR code</p>
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
