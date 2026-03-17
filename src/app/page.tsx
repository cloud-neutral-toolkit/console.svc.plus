"use client";

export const dynamic = "error";

import {
  AppWindow,
  ArrowRight,
  BookOpen,
  Command,
  Layers,
  Link,
  Lock,
  MousePointerClick,
  Play,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import Footer from "../components/Footer";
import UnifiedNavigation from "../components/UnifiedNavigation";
import { useUserStore } from "../lib/userStore";
import { useLanguage } from "../i18n/LanguageProvider";
import { translations } from "../i18n/translations";
import { useMoltbotStore } from "../lib/moltbotStore";
import { cn } from "../lib/utils";
import { AskAIDialog } from "../components/AskAIDialog";
import { HeroCard } from "../components/HeroCard";
import useSWR from "swr";

const iconMap: Record<string, any> = {
  // English keys
  "Global Acceleration Network": Link,
  "Full-link SaaS Hosting": Layers,
  "AI-Driven Observability": Sparkles,
  "Add a new user to your project": Users,
  "Register a new application": AppWindow,
  "Deploy your application": Command,
  "Invite a user": MousePointerClick,
  "Get started": Sparkles,
  "Creating your application": AppWindow,
  "More about Authentication": ShieldCheck,
  "Understanding Authorization": Lock,
  "Machine-to-Machine": Layers,
  "Connect via CLI": Terminal,
  "REST & Admin APIs": Link,
  // Chinese keys
  全球加速网络: Link,
  "全链路 SaaS 托管": Layers,
  "AI 驱动的可观测性": Sparkles,
  向项目添加新用户: Users,
  注册新应用程序: AppWindow,
  部署您的应用程序: Command,
  邀请用户: MousePointerClick,
  开始使用: Sparkles,
  创建您的应用程序: AppWindow,
  关于身份验证: ShieldCheck,
  了解授权: Lock,
  机器对机器: Layers,
  "通过 CLI 连接": Terminal,
};

const getIcon = (key: string, fallback: any) => iconMap[key] || fallback;

export default function HomePage() {
  const { mode, isOpen } = useMoltbotStore();

  return (
    <div className="mobile-home-shell relative flex min-h-screen flex-col overflow-x-hidden bg-background text-text transition-colors duration-150">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(37,78,219,0.16),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-8rem] top-[8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-8 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(17,24,39,0.08),transparent)]" />
      </div>
      <UnifiedNavigation />

      <div
        className={cn(
          "relative flex flex-1 overflow-hidden",
          mode === "left-sidebar" && isOpen && "flex-row-reverse",
        )}
      >
        <div className="relative flex-1 overflow-y-auto">
          <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] rounded-b-[3rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.45)_58%,transparent),radial-gradient(circle_at_top_left,rgba(37,78,219,0.1),transparent_30%),radial-gradient(circle_at_82%_15%,rgba(17,24,39,0.08),transparent_24%)]"
              aria-hidden
            />
            <main className="relative space-y-8 pt-6 sm:space-y-12 sm:pt-10">
              <HeroSection />
              <NextStepsSection />
              <StatsSection />
              <ShortcutsSection />
            </main>
            <div className="relative">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { user } = useUserStore();
  const { language } = useLanguage();
  const t = translations[language].marketing.home;

  return (
    <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
      <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-5">
          {t.hero.eyebrow && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full border border-slate-900/10 bg-white/90 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-text-subtle shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                {t.hero.eyebrow}
              </p>
              <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Product surface
              </span>
            </div>
          )}
          <h1 className="editorial-display max-w-[11ch] text-[2.9rem] leading-[0.86] text-heading sm:max-w-none sm:text-[3.4rem] lg:text-[4.85rem]">
            {t.hero.title}
          </h1>
          <p className="max-w-xl text-[1.05rem] leading-8 text-text-muted">
            {t.hero.subtitle}
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          {user ? (
            <div className="flex items-center justify-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success shadow-[0_18px_30px_rgba(22,163,74,0.12)] sm:justify-start sm:py-1.5">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {t.signedIn.replace("{{username}}", user.username)}
            </div>
          ) : (
            <button className="flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-primary sm:py-2.5">
              <PlusCircle className="h-4 w-4" />
              {t.heroButtons.create}
            </button>
          )}
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white/90 px-6 py-3 text-sm font-semibold text-text shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-surface-hover sm:py-2.5">
            <Play className="h-4 w-4" />
            {t.heroButtons.playground}
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-[#f8f3ea] px-6 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:bg-[#f4ecdd] sm:py-2.5">
            <BookOpen className="h-4 w-4" />
            {t.heroButtons.tutorials}
          </button>
        </div>
        <div className="grid gap-4 rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(248,243,234,0.9))] p-5 shadow-[0_20px_42px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">
              {t.trustedBy}
            </p>
            <div className="flex flex-wrap gap-2">
              <LogoPill label="Next.js" />
              <LogoPill label="Go" />
              <LogoPill label="Vercel" />
              <LogoPill label="Cloud Run" />
              <LogoPill label="PostgreSQL" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-950/10 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-4 text-white shadow-[0_20px_40px_rgba(15,23,42,0.24)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/60">
              Experience
            </p>
            <p className="mt-3 editorial-display text-[2rem] leading-none text-white">
              Focused
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              More contrast, stronger typography, and a cleaner hierarchy for
              product entry points.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(240,244,255,0.94))] p-4 shadow-[0_24px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subtle">
              Launch paths
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Pricing, onboarding, and observability as one surface.
            </p>
          </div>
          <span className="rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-xs font-semibold text-primary">
            3 guides
          </span>
        </div>
        <div className="relative flex flex-col gap-3 sm:gap-4">
          {t.heroCards.map((card) => {
            const Icon = getIcon(card.title, PlusCircle);
            return (
              <HeroCard
                key={card.title}
                icon={Icon}
                title={card.title}
                description={card.description}
                guide={card.guide}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function NextStepsSection() {
  const { language } = useLanguage();
  const t = translations[language].marketing.home;

  return (
    <section className="space-y-4 rounded-[2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,243,234,0.8))] p-5 shadow-[0_20px_48px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:p-7">
      <header className="flex flex-col gap-2 text-sm text-text-muted sm:flex-row sm:items-center sm:gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subtle">
          {t.nextSteps.title}
        </p>
        <span className="w-fit rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-primary">
          {t.nextSteps.badge}
        </span>
      </header>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {t.nextSteps.items.map((item, index: number) => {
          const Icon = getIcon(item.title, Users);
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-[1.5rem] border border-slate-900/10 bg-white/88 p-4 shadow-[0_14px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary-muted">
                  <span className="rounded-full bg-primary/20 px-2 py-0.5">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-heading">
                  {item.title}
                </p>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-hover">
                  {t.nextSteps.learnMore}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StatsSection() {
  const { language } = useLanguage();
  const t = translations[language].marketing.home;
  const { data } = useSWR<HomeStatsResponse>(
    "/api/marketing/home-stats",
    async (url: string) => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load home stats: ${response.status}`);
      }
      return (await response.json()) as HomeStatsResponse;
    },
    {
      refreshInterval: 60 * 60 * 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const locale = language === "zh" ? "zh-CN" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale);
  const compactFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  const registeredUsersValue =
    typeof data?.registeredUsers === "number"
      ? numberFormatter.format(data.registeredUsers)
      : (t.stats[0]?.value ?? "0+");

  const dailyVisits =
    typeof data?.visits?.daily === "number" ? data.visits.daily : null;
  const weeklyVisits =
    typeof data?.visits?.weekly === "number" ? data.visits.weekly : null;
  const monthlyVisits =
    typeof data?.visits?.monthly === "number" ? data.visits.monthly : null;

  const displayStats = [
    {
      value: registeredUsersValue,
      label: t.statsLabels.registeredUsers,
    },
    {
      value:
        typeof dailyVisits === "number"
          ? compactFormatter.format(dailyVisits)
          : (t.stats[1]?.value ?? "0+"),
      label: t.statsLabels.dailyVisits,
    },
    {
      value:
        typeof weeklyVisits === "number"
          ? compactFormatter.format(weeklyVisits)
          : "0+",
      label: t.statsLabels.weeklyVisits,
    },
    {
      value:
        typeof monthlyVisits === "number"
          ? compactFormatter.format(monthlyVisits)
          : "0+",
      label: t.statsLabels.monthlyVisits,
    },
    t.stats[2],
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-950/5 bg-[linear-gradient(135deg,#0f172a,#1e293b_45%,#1d4ed8)] p-5 shadow-[0_26px_60px_rgba(15,23,42,0.18)] sm:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            Platform pulse
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/72">
            Metrics need contrast and tension, not another pale card.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/68">
          Updated hourly
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-5">
        {displayStats.map((stat, index: number) => (
          <div
            key={index}
            className="space-y-1 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-left even:text-right md:text-left"
          >
            <div className="editorial-display text-[2.15rem] leading-none text-white sm:text-[2.7rem]">
              {stat.value}
            </div>
            <p className="max-w-[9rem] text-sm text-white/70 even:ml-auto md:max-w-none">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

type HomeStatsResponse = {
  registeredUsers: number | null;
  visits: {
    daily: number | null;
    weekly: number | null;
    monthly: number | null;
  };
  updatedAt: string;
};

export function ShortcutsSection() {
  const { language } = useLanguage();
  const t = translations[language].marketing.home;
  const { data: latestBlogs } = useSWR<LatestBlogPost[]>(
    "/api/blogs/latest?limit=7",
    async (url: string) => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load latest blogs: ${response.status}`);
      }
      return (await response.json()) as LatestBlogPost[];
    },
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const shortcutItems =
    latestBlogs && latestBlogs.length > 0
      ? latestBlogs.map((post) => ({
          title: post.title,
          description: post.date
            ? new Date(post.date).toLocaleDateString(
                language === "zh" ? "zh-CN" : "en-US",
              )
            : t.shortcuts.subtitle,
          href: `/blogs/${post.slug}`,
        }))
      : t.shortcuts.items.map((item) => ({
          ...item,
          href: "#",
        }));

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(180deg,#ffffff,#f5f7fb)] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] lg:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {t.shortcuts.title}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {t.shortcuts.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
          <button className="rounded-full border border-slate-900/10 bg-slate-950 px-3 py-2 text-white transition hover:bg-primary">
            {t.shortcuts.buttons.start}
          </button>
          <button className="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50">
            {t.shortcuts.buttons.docs}
          </button>
          <button className="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50">
            {t.shortcuts.buttons.guides}
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {shortcutItems.map((item, index: number) => {
          const Icon = getIcon(item.title, Sparkles);
          return (
            <a
              key={index}
              href={item.href}
              className="group flex items-start gap-3 rounded-[1.5rem] border border-slate-900/10 bg-white p-4 shadow-[0_14px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-primary/40 hover:bg-slate-50"
            >
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-base font-semibold leading-7 text-slate-900">
                  {item.title}
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className="ml-auto h-4 w-4 text-slate-500 transition group-hover:text-primary"
                aria-hidden
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

type LatestBlogPost = {
  slug: string;
  title: string;
  date?: string;
};

function LogoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/92 px-3.5 py-1.5 text-xs font-semibold text-text shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
      <div className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#10b981,#2563eb)]" />
      {label}
    </span>
  );
}
