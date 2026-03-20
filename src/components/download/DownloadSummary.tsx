"use client";

import { Boxes, Files, FolderTree } from "lucide-react";

import { useLanguage } from "@i18n/LanguageProvider";
import { translations } from "@i18n/translations";

type DownloadSummaryProps = {
  topLevelCount: number;
  totalCollections: number;
  totalFiles: number;
};

export default function DownloadSummary({
  topLevelCount,
  totalCollections,
  totalFiles,
}: DownloadSummaryProps) {
  const { language } = useLanguage();
  const isChinese = language === "zh";
  const locale = isChinese ? "zh-CN" : "en-US";
  const t = translations[language].download.home;
  const stats = [
    { label: t.stats.categories, value: topLevelCount, icon: FolderTree },
    { label: t.stats.collections, value: totalCollections, icon: Boxes },
    { label: t.stats.files, value: totalFiles, icon: Files },
  ];

  return (
    <section className="rounded-[8px] border border-[color:var(--color-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,245,248,0.92))] p-5 shadow-[var(--shadow-md)] sm:p-6 lg:p-7">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="space-y-3">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-text-subtle">
            {isChinese ? "下载中心" : "Download library"}
          </p>
          <h1
            className={
              isChinese
                ? "text-[1.8rem] font-semibold leading-[1.02] tracking-[-0.05em] text-heading sm:text-[2.2rem]"
                : "text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.04em] text-heading sm:text-[2.3rem]"
            }
          >
            {t.title}
          </h1>
          <p className="max-w-2xl text-[0.95rem] leading-7 text-text-muted sm:text-[1rem]">
            {t.description}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[8px] border border-[color:var(--color-surface-border)] bg-white/88 p-4"
              >
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  <dt className="text-[13px] font-medium">{item.label}</dt>
                </div>
                <dd className="mt-2.5 text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-[var(--color-heading)]">
                  {item.value.toLocaleString(locale)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
