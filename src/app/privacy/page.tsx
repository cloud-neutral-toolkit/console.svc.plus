"use client";

import React from "react";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import Footer from "../../components/Footer";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function PrivacyPage() {
    const { language } = useLanguage();
    const isChinese = language === "zh";

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-150 flex flex-col">
            <UnifiedNavigation />

            <main className="flex-1 relative overflow-hidden pt-24 pb-20">
                <div className="relative mx-auto max-w-4xl px-6">
                    <h1 className="text-3xl font-bold mb-8">
                        {isChinese ? "隐私政策" : "Privacy Policy"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-10 text-text-muted">
                        {isChinese ? (
                            <>
                                <p className="text-sm">最后更新日期：2026年2月1日</p>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">1. 我们收集的信息 / Information We Collect</h2>
                                    <p className="mb-4">我们仅收集为您提供服务所必需的信息：</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>账户信息：</strong> 您的邮箱地址、头像及第三方登录提供的基本公开信息（如通过 Google 登录）。</li>
                                        <li><strong>支付信息：</strong> 我们的支付由第三方处理商（如 Stripe）处理。我们不会直接存储您的完整信用卡号或安全码。</li>
                                        <li><strong>使用数据：</strong> 包括 IP 地址、浏览器类型、设备信息以及您在平台上的操作日志。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">2. 信息如何使用 / How We Use Information</h2>
                                    <p className="mb-4">收集的信息用于：</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>创建与管理您的账户。</li>
                                        <li>处理订单、订阅及支付。</li>
                                        <li>通过可观测性工具优化系统性能及修复 Bug。</li>
                                        <li>发送重要的服务更新和通知。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">3. 数据共享与安全 / Data Sharing & Security</h2>
                                    <p className="mb-4">我们不会向第三方出售您的个人信息。我们仅在以下情况共享数据：</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>服务供应商：</strong> 如云基础设施提供商（Google Cloud）、支付网关（Stripe）和分析工具。</li>
                                        <li><strong>法律要求：</strong> 在法律强制要求或保护我们权利的情况下。 我们采用行业标准的加密技术（如 SSL/TLS）来保护您的数据。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">4. 您的权利与联系方式 / Your Rights & Contact</h2>
                                    <p>您有权随时查看、修改或请求删除您的个人数据。如果您有任何疑问，请通过以下方式联系我们：</p>
                                    <p className="mt-2 text-primary">邮箱：<a href="mailto:support@svc.plus" className="hover:underline">support@svc.plus</a></p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">5. 政策更新 / Policy Updates</h2>
                                    <p>我们可能会不时更新本政策。更新后，我们将在网站显著位置发布通知。</p>
                                </section>
                            </>
                        ) : (
                            <>
                                <p className="text-sm">Last Updated: February 1, 2026</p>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">1. Information We Collect</h2>
                                    <p className="mb-4">We only collect information necessary to provide you with our services:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Account Information:</strong> Your email address, profile picture, and basic public info provided by third-party logins (e.g., Google OAuth).</li>
                                        <li><strong>Payment Information:</strong> Payments are processed by third-party providers (e.g., Stripe). We do not directly store your full credit card numbers or security codes.</li>
                                        <li><strong>Usage Data:</strong> Includes IP addresses, browser types, device information, and logs of your activities on the platform.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">2. How We Use Information</h2>
                                    <p className="mb-4">The information collected is used to:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Create and manage your account.</li>
                                        <li>Process orders, subscriptions, and payments.</li>
                                        <li>Optimize system performance and fix bugs via observability tools.</li>
                                        <li>Send important service updates and notifications.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">3. Data Sharing & Security</h2>
                                    <p className="mb-4">We do not sell your personal information to third parties. Data is shared only with:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Service Providers:</strong> Such as cloud infrastructure (Google Cloud), payment gateways (Stripe), and analytical tools.</li>
                                        <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights. We use industry-standard encryption (e.g., SSL/TLS) to secure your data.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">4. Your Rights & Contact</h2>
                                    <p>You have the right to access, modify, or request the deletion of your personal data at any time. For questions, please contact us at:</p>
                                    <p className="mt-2 text-primary">Email: <a href="mailto:support@svc.plus" className="hover:underline">support@svc.plus</a></p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-text mb-4">5. Policy Updates</h2>
                                    <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
                                </section>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
