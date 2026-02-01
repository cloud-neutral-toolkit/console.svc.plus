"use client";

import React from "react";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import Footer from "../../components/Footer";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function PricesPage() {
    const { language } = useLanguage();
    const isChinese = language === "zh";

    const content = {
        title: isChinese ? "简单透明的价格" : "Simple, Transparent Pricing",
        subtitle: isChinese
            ? "选择适合您的计划，开启云原生之旅"
            : "Choose the plan that's right for you and your team.",
        plans: [
            {
                name: isChinese ? "开源版 (Self-Host)" : "Open Source (Self-Host)",
                price: isChinese ? "免费" : "Free",
                period: isChinese ? "/永久" : "/forever",
                description: isChinese ? "适合个人开发者，完全自主掌控" : "For individual developers, fully self-controlled",
                features: isChinese
                    ? ["全套开源代码 (Apache 2.0)", "私有化部署 (Self-Hosted)", "基础 CI/CD 模板", "社区技术支持"]
                    : ["Full Open Source Code (Apache 2.0)", "Private Deployment (Self-Hosted)", "Basic CI/CD Templates", "Community Support"],
                button: isChinese ? "下载" : "Download",
                highlight: false,
                href: "/download"
            },
            {
                name: isChinese ? "云端共享 (Cloud)" : "Cloud Shared",
                price: "$1.9",
                period: isChinese ? "起 / 月" : "/mo",
                description: isChinese ? "零运维的云原生体验" : "Zero-ops cloud native experience",
                features: isChinese
                    ? ["共享资源起步", "零运维体验", "适合初学者"]
                    : ["Shared resources start", "Zero-ops experience", "For beginners"],
                button: isChinese ? "开始使用" : "Get Started",
                highlight: false,
                href: "/register"
            },
            {
                name: isChinese ? "基础版 (Basic)" : "Basic",
                price: "$9.9",
                period: isChinese ? "/ 月" : "/mo",
                description: isChinese ? "托管式共享节点，省心省力" : "Managed shared nodes, hassle-free",
                features: isChinese
                    ? ["托管式共享节点", "公开项目托管", "基础资源配额"]
                    : ["Managed shared nodes", "Public project hosting", "Basic resource quota"],
                button: isChinese ? "选择计划" : "Choose Plan",
                highlight: false,
                href: "/register"
            },
            {
                name: isChinese ? "专业版 (Pro)" : "Pro",
                price: "$19.9",
                period: isChinese ? "/ 月" : "/mo",
                description: isChinese ? "专为专业开发者打造" : "Built for professional developers",
                features: isChinese
                    ? ["优先技术支持", "专属 AI 编程助手", "独享高性能节点", "全链路可信访问环境"]
                    : ["Priority Support", "Exclusive AI Coding Assistant", "Dedicated High-Performance Nodes", "Full-link Trusted Access Environment"],
                button: isChinese ? "Stripe 注册验证" : "Verify with Stripe",
                highlight: true,
                href: "https://stripe.com"
            },
            {
                name: isChinese ? "定制版本" : "Custom Version",
                price: isChinese ? "定制" : "Custom",
                description: isChinese ? "量身定制的企业级解决方案" : "Tailored enterprise solutions",
                features: isChinese
                    ? ["SLA 保证", "专属 1V1 支持", "SSO 单点登录", "量身定制解决方案", "包含专业版所有功能"]
                    : ["SLA Guarantee", "Exclusive 1V1 Support", "SSO Single Sign-On", "Tailored Solutions", "Includes all Pro features"],
                button: isChinese ? "联系我们" : "Contact Sales",
                highlight: false,
                href: "/support"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-150 flex flex-col">
            <UnifiedNavigation />

            <main className="flex-1 relative overflow-hidden pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-gradient-app-from opacity-20 pointer-events-none"
                    aria-hidden
                />

                <div className="relative mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">
                            {content.title}
                        </h1>
                        <p className="text-lg text-text-muted">
                            {content.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                        {content.plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`
                  relative rounded-2xl p-6 border 
                  ${plan.highlight
                                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 transform hover:-translate-y-1 transition-all duration-300'
                                        : 'border-surface-border bg-surface hover:border-surface-border-hover'
                                    }
                  flex flex-col h-full
                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                                        {isChinese ? "推荐" : "Recommended"}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-base font-semibold text-text-muted mb-2 truncate">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-heading">{plan.price}</span>
                                        {plan.period && <span className="text-xs text-text-muted">{plan.period}</span>}
                                    </div>
                                    <p className="text-xs text-text-subtle mt-3 line-clamp-2 min-h-[2.5em]">{plan.description}</p>
                                </div>

                                <div className="flex-1 space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-surface-muted text-text-muted'}`}>
                                                <Check size={12} />
                                            </div>
                                            <span className="text-xs text-text-muted leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={plan.href}
                                    className={`
                    w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors
                    ${plan.highlight
                                            ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25'
                                            : 'bg-surface-muted text-text hover:bg-surface-hover border border-surface-border'
                                        }
                  `}
                                >
                                    {plan.button}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-surface-border text-xs font-medium text-text-muted">
                            <Shield size={14} />
                            {isChinese ? "所有支付由 Stripe 安全处理" : "Payments secured by Stripe"}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
