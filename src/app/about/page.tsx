'use client'

import React from 'react'
import { translations } from '../../i18n/translations'
import { useLanguage } from '../../i18n/LanguageProvider'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AboutPage() {
    const { language } = useLanguage()
    const t = translations[language].about

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_0,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(52,211,153,0.08),transparent_35%)]" aria-hidden />

            <div className="relative mx-auto max-w-7xl px-6 pb-20">
                <Navbar />

                <main className="pt-20 lg:pt-32">
                    <div className="mx-auto max-w-3xl space-y-12">

                        {/* Header */}
                        <div className="space-y-4 text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                {t.title}
                            </h1>
                            <p className="text-lg text-slate-300">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Disclaimer Section */}
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 shadow-inner shadow-yellow-500/10">
                            <div className="flex gap-4">
                                <div className="mt-1 shrink-0 text-yellow-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-yellow-200">Disclaimer</h3>
                                    <p className="text-sm leading-relaxed text-yellow-100/80">
                                        {t.disclaimer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Acknowledgments */}
                        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12 shadow-2xl backdrop-blur-sm">
                            <div className="space-y-6">
                                <p className="text-lg leading-relaxed text-slate-300">
                                    {t.acknowledgments}
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                                        {t.toolsTitle}
                                    </h3>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {t.tools.map((tool, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                {tool}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-slate-500">
                                        {t.toolsNote}
                                    </p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-xl bg-indigo-500/10 p-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-50" />
                                <div className="relative flex items-center gap-4 text-indigo-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-6 w-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                    <p className="font-medium">
                                        {t.opensource}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}
