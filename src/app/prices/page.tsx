"use client";

import React from "react";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import Footer from "../../components/Footer";
import { Check, Shield, Zap } from "lucide-react";
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
                name: isChinese ? "开源版" : "Open Source",
                price: isChinese ? "免费" : "Free",
                description: isChinese ? "适合个人开发者和爱好者" : "Perfect for hobbyists and side projects",
                features: isChinese
                    ? ["无限公共项目", "基础 CI/CD", "社区支持", "单用户"]
                    : ["Unlimited public projects", "Basic CI/CD", "Community support", "Single user"],
                button: isChinese ? "开始使用" : "Get Started",
                highlight: false,
                href: "/download"
            },
            {
                name: isChinese ? "专业版" : "Pro",
                price: "$19",
                period: isChinese ? "/月" : "/mo",
                description: isChinese ? "适合专业开发者和通过 Stripe 验证的用户" : "For professional developers and Stripe verified users",
                features: isChinese
                    ? ["包含开源版所有功能", "优先支持", "高级 CI/CD", "Stripe 身份验证", "私有项目"]
                    : ["All Open Source features", "Priority support", "Advanced CI/CD", "Stripe Identity Verification", "Private projects"],
                button: isChinese ? "Stripe 注册验证" : "Verify with Stripe",
                highlight: true,
                href: "https://stripe.com" // Placeholder for Stripe flow
            },
            {
                name: isChinese ? "企业版" : "Enterprise",
                price: isChinese ? "定制" : "Custom",
                description: isChinese ? "适合大型团队和组织" : "For large teams and organizations",
                features: isChinese
                    ? ["包含专业版所有功能", "SSO 单点登录", "SLA 保证", "专属以客户经理", "本地部署支持"]
                    : ["All Pro features", "SSO & SAML", "SLA Guarantee", "Dedicated account manager", "On-premise deployment"],
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

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {content.plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`
                  relative rounded-2xl p-8 border 
                  ${plan.highlight
                                        ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 transform hover:-translate-y-1 transition-all duration-300'
                                        : 'border-surface-border bg-surface hover:border-surface-border-hover'
                                    }
                  flex flex-col h-full
                `}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {isChinese ? "最受欢迎" : "Most Popular"}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-text-muted mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-heading">{plan.price}</span>
                                        {plan.period && <span className="text-text-muted">{plan.period}</span>}
                                    </div>
                                    <p className="text-sm text-text-subtle mt-4">{plan.description}</p>
                                </div>

                                <div className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-primary/20 text-primary' : 'bg-surface-muted text-text-muted'}`}>
                                                <Check size={14} />
                                            </div>
                                            <span className="text-sm text-text-muted">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={plan.href}
                                    className={`
                    w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors
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
