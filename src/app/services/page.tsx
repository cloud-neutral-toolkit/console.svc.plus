"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  LineChart,
  MessageSquare,
  PenSquare,
  Package,
} from "lucide-react";
import Footer from "../../components/Footer";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useViewStore } from "../../components/theme/viewStore";
import Material3Layout from "./Material3Layout";

const placeholderCount = 3;
type ServiceCardData = {
  key: string;
  name: string;
  description: string;
  href: string;
  icon: any;
  external?: boolean;
};

const ServiceCard = ({
  service,
  view,
  isChinese,
}: {
  service: ServiceCardData;
  view: "classic" | "material";
  isChinese: boolean;
}) => {
  const isMaterial = view === "material";

  const cardContent = (
    <div
      className={`group flex h-full flex-col justify-between rounded-xl p-5 transition ${isMaterial
        ? "border border-surface-border bg-surface hover:-translate-y-[1px] hover:border-primary/50 hover:bg-background-muted"
        : "border border-white/10 bg-white/5 hover:-translate-y-[1px] hover:border-indigo-400/50 hover:bg-slate-900/60"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${isMaterial
            ? "bg-primary/15 text-primary"
            : "bg-indigo-500/15 text-indigo-200"
            }`}
        >
          <service.icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <div
            className={`text-sm font-semibold ${isMaterial ? "text-heading" : "text-white"}`}
          >
            {service.name}
          </div>
          <p
            className={`text-sm ${isMaterial ? "text-text-muted" : "text-slate-300"}`}
          >
            {service.description}
          </p>
        </div>
      </div>
      <span
        className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold transition ${isMaterial
          ? "text-primary group-hover:text-primary-hover"
          : "text-indigo-200 group-hover:text-white"
          }`}
      >
        {isChinese ? "打开" : "Open"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </div>
  );

  if (service.external) {
    return (
      <a
        href={service.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={service.href} className="block">
      {cardContent}
    </Link>
  );
};

const PlaceholderCard = ({
  view,
  isChinese,
}: {
  view: "classic" | "material";
  isChinese: boolean;
}) => {
  const isMaterial = view === "material";
  const placeholderLabel = isChinese
    ? "更多服务即将上线"
    : "More services coming soon";
  const placeholderDescription = isChinese
    ? "预留卡片位置，持续扩充入口。"
    : "Reserved slots for new service entries.";

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-xl border border-dashed p-5 ${isMaterial
        ? "border-surface-border-strong bg-surface text-text-muted"
        : "border-white/15 bg-white/5 text-slate-300"
        }`}
    >
      <div className="space-y-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-dashed text-sm ${isMaterial
            ? "border-surface-border-strong text-text-subtle"
            : "border-white/20 text-slate-400"
            }`}
        >
          <FileText className="h-4 w-4" aria-hidden />
        </div>
        <div
          className={`text-sm font-semibold ${isMaterial ? "text-heading" : "text-white/80"}`}
        >
          {placeholderLabel}
        </div>
        <p
          className={`text-sm ${isMaterial ? "text-text-subtle" : "text-slate-400"}`}
        >
          {placeholderDescription}
        </p>
      </div>
      <span
        className={`mt-4 text-xs font-semibold ${isMaterial ? "text-text-subtle" : "text-slate-400"}`}
      >
        {isChinese ? "敬请期待" : "Stay tuned"}
      </span>
    </div>
  );
};

const ServiceGrid = ({
  view,
  services,
  isChinese,
}: {
  view: "classic" | "material";
  services: ServiceCardData[];
  isChinese: boolean;
}) => {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service) => (
        <ServiceCard
          key={service.key}
          service={service}
          view={view}
          isChinese={isChinese}
        />
      ))}
      {Array.from({ length: placeholderCount }).map((_, index) => (
        <PlaceholderCard
          key={`placeholder-${index}`}
          view={view}
          isChinese={isChinese}
        />
      ))}
    </section>
  );
};

const ClawdbotLogo = (props: any) => (
  <img
    src="https://mintcdn.com/clawdhub/4rYvG-uuZrMK_URE/assets/pixel-lobster.svg?fit=max&auto=format&n=4rYvG-uuZrMK_URE&q=85&s=da2032e9eac3b5d9bfe7eb96ca6a8a26"
    alt="Clawdbot"
    {...props}
  />
);

export default function ServicesPage() {
  const { view, isHydrated } = useViewStore();
  const { language } = useLanguage();
  const isChinese = language === "zh";

  const services: ServiceCardData[] = [
    {
      key: "editor",
      name: isChinese ? "编辑器" : "Editor",
      description: isChinese
        ? "Markdown 发布与排版的在线编辑器。"
        : "Markdown publishing and layout editor.",
      href: "https://markdown-publisher.svc.plus",
      icon: PenSquare,
      external: true,
    },
    {
      key: "wechat-to-markdown",
      name: isChinese ? "微信转 Markdown" : "WeChat to Markdown",
      description: isChinese
        ? "一键将公众号内容转换为 Markdown。"
        : "Convert WeChat articles into Markdown.",
      href: "https://wechat-to-markdown.svc.plus",
      icon: MessageSquare,
      external: true,
    },
    {
      key: "page-reading",
      name: isChinese ? "Page Reading Agent" : "Page Reading Agent",
      description: isChinese
        ? "智能网页阅读与分析服务。"
        : "Intelligent web page reading and analysis service.",
      href: "https://page-reading.svc.plus",
      icon: FileText,
      external: true,
    },
    {
      key: "artifact",
      name: isChinese ? "制品 / 镜像" : "Artifact / Mirror",
      description: isChinese
        ? "获取核心制品、镜像与下载资源。"
        : "Get core artifacts, mirrors, and downloads.",
      href: "/download",
      icon: Package,
    },
    {
      key: "cloudIac",
      name: isChinese ? "云 IaC 目录" : "Cloud IaC Catalog",
      description: isChinese
        ? "浏览云基础设施目录与自动化蓝图。"
        : "Browse cloud IaC catalog and automation blueprints.",
      href: "/cloud_iac",
      icon: Layers,
    },
    {
      key: "insight",
      name: isChinese ? "Insight 工作台" : "Insight Workbench",
      description: isChinese
        ? "进入观测、告警与智能协作控制面。"
        : "Observability, alerts, and AI-assisted operations.",
      href: "/insight",
      icon: Activity,
    },
    {
      key: "infra-monitor",
      name: isChinese ? "基础设施监控" : "Infrastructure Monitoring",
      description: isChinese
        ? "基于 Pigsty 4.0 (Apache-2.0) 构建的开源可观测性与监控平台。"
        : "Open-source observability based on Pigsty 4.0 (Apache-2.0).",
      href: "https://infra.svc.plus/",
      icon: LineChart,
      external: true,
    },
    {
      key: "docs",
      name: isChinese ? "文档 / 解决方案" : "Docs / Solutions",
      description: isChinese
        ? "阅读文档、方案与产品指南。"
        : "Read documentation, solutions, and guides.",
      href: "/docs",
      icon: BookOpen,
    },
    {
      key: "moltbot",
      name: isChinese ? "Moltbot 服务" : "Moltbot Service",
      description: isChinese
        ? "Moltbot 节点管理服务。"
        : "Moltbot node management service.",
      href: "https://clawdbot.svc.plus/",
      icon: ClawdbotLogo,
      external: true,
    },
  ];

  if (!isHydrated) {
    return null;
  }

  if (view === "material") {
    return (
      <Material3Layout>
        <div className="mb-10">
          <h2 className="text-heading text-4xl font-black tracking-tight mb-2">
            Service Overview
          </h2>
          <p className="text-text-muted text-lg max-w-2xl">
            Real-time metrics and system health for your current production
            environment.
          </p>
        </div>
        <ServiceGrid
          view="material"
          services={services}
          isChinese={isChinese}
        />
      </Material3Layout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_0,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_50%_60%,rgba(52,211,153,0.08),transparent_35%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <UnifiedNavigation />
        <main className="space-y-10 pt-10">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              {isChinese ? "更多服务" : "More services"}
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {isChinese
                ? "在这里进入所有扩展入口"
                : "Access every extended entry point"}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              {isChinese
                ? "沿用当前主页布局的卡片网格，把新增工具与服务统一收拢。"
                : "A card grid aligned with the current homepage layout for all services."}
            </p>
          </header>
          <ServiceGrid
            view="classic"
            services={services}
            isChinese={isChinese}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}
