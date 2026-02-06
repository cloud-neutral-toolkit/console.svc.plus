'use client';

import { useState, useRef, useEffect } from 'react';
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
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        if (guide) setShowGuide(true);
    };

    const handleMouseLeave = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => {
            setShowGuide(false);
        }, 300); // 300ms grace period to move mouse to sidebar
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    return (
        <>
            <div
                className={cn(
                    "group relative flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-6 transition-all duration-300",
                    showGuide ? "border-primary/50 shadow-lg" : "hover:border-primary/50 hover:bg-surface-hover"
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="mt-1 rounded-full border border-surface-border bg-surface-muted p-2 group-hover:border-primary/50 group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 w-full">
                    <h3 className="font-semibold text-heading">{title}</h3>
                    <p className="text-sm text-text-muted">{description}</p>
                </div>
            </div>

            {/* Right Sidebar Guide Drawer */}
            {guide && (
                <div
                    className={cn(
                        "fixed top-0 right-0 h-full w-[400px] z-[100] bg-surface border-l border-surface-border shadow-2xl transition-transform duration-300 ease-in-out transform",
                        showGuide ? "translate-x-0" : "translate-x-full"
                    )}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="h-full flex flex-col p-8 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xl font-bold text-heading flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                {guide.title}
                            </h4>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="rounded-full p-2 hover:bg-surface-muted text-text-muted hover:text-text transition-colors"
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">{guide.dismiss}</span>
                            </button>
                        </div>

                        <div className="space-y-8 flex-1">
                            {guide.steps.map((step, idx) => (
                                <div key={idx} className="relative pl-8 group/step">
                                    {/* Timeline line */}
                                    {idx !== guide.steps.length - 1 && (
                                        <div className="absolute left-[11px] top-8 bottom-[-2rem] w-[2px] bg-surface-border group-hover/step:bg-primary/20 transition-colors" />
                                    )}

                                    <span className={cn(
                                        "absolute left-0 top-0 flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ring-4 ring-surface transition-all duration-300",
                                        "bg-surface-muted text-text-muted group-hover/step:bg-primary group-hover/step:text-white group-hover/step:scale-110"
                                    )}>
                                        {idx + 1}
                                    </span>

                                    <div className="space-y-3">
                                        <p className="text-base text-text leading-relaxed">{step.text}</p>

                                        {step.link && (
                                            <Link
                                                href={step.link.url}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                                            >
                                                {step.link.label}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        )}

                                        {/* Special handling for VLESS QR code hint */}
                                        {idx === 2 && (
                                            <div className="mt-4 p-4 rounded-xl border border-dashed border-surface-border bg-surface-muted/30 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-crosshair group/qr">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                                        <QrCode className="h-12 w-12 text-black" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-heading text-sm">VLESS Protocol Ready</p>
                                                        <p className="text-xs text-text-muted leading-relaxed">
                                                            {/* English fallback if not found in props (though guide steps usually text) */}
                                                            Scan the QR code in the control panel to connect automatically.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-surface-border">
                            <button
                                onClick={() => setShowGuide(false)}
                                className="w-full py-3 rounded-xl border border-surface-border text-sm font-medium text-text-muted hover:bg-surface-muted hover:text-text transition-all"
                            >
                                {guide.dismiss}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
