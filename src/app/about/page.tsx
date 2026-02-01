"use client";

import React from "react";
import { translations } from "../../i18n/translations";
import { useLanguage } from "../../i18n/LanguageProvider";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import Footer from "../../components/Footer";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-150">
      <div
        className="absolute inset-0 bg-gradient-app-from opacity-20"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <UnifiedNavigation />

        <main className="pt-20 lg:pt-32">
          <div className="mx-auto max-w-3xl space-y-12">
            {/* Header */}
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">
                {t.title}
              </h1>
              <p className="text-lg text-text-muted">{t.subtitle}</p>
            </div>

            {/* Disclaimer Section */}
            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-8 shadow-inner shadow-warning/10">
              <div className="flex gap-4">
                <div className="mt-1 shrink-0 text-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-alert-triangle"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-warning-foreground">
                    Disclaimer
                  </h3>
                  <p className="text-sm leading-relaxed text-warning-foreground/80 whitespace-pre-wrap">
                    {t.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Acknowledgments */}
            <div className="space-y-8 rounded-3xl border border-surface-border bg-surface p-8 lg:p-12 shadow-2xl backdrop-blur-sm">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-text-muted whitespace-pre-wrap">
                  {t.acknowledgments}
                </p>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {t.toolsTitle}
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {t.tools.map((tool, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-text-muted"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-text hover:underline hover:decoration-primary"
                        >
                          {tool.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-subtle">{t.toolsNote}</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-primary/10 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50" />
                <div className="relative flex items-center gap-4 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart h-6 w-6"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <p className="font-medium whitespace-pre-wrap">{t.opensource}</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
