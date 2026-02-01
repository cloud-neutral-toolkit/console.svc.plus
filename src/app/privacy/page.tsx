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

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-text-muted">
                        {/* Simple placeholder Privacy Policy */}
                        {isChinese ? (
                            <>
                                <p>最后更新：2026年2月1日</p>
                                <h3>1. 信息收集</h3>
                                <p>我们会收集您在注册或使用服务时提供的部分信息，例如邮箱地址。</p>
                                <h3>2. 信息使用</h3>
                                <p>我们收集的信息主要用于提供和改进服务，以及与您进行沟通。</p>
                                <h3>3. 数据安全</h3>
                                <p>我们采取合理的措施来保护您的个人信息安全。</p>
                            </>
                        ) : (
                            <>
                                <p>Last Updated: February 1, 2026</p>
                                <h3>1. Information Collection</h3>
                                <p>We collect certain information you provide when you register or use our services, such as your email address.</p>
                                <h3>2. Information Use</h3>
                                <p>The information we collect is primarily used to provide and improve our services and to communicate with you.</p>
                                <h3>3. Data Security</h3>
                                <p>We take reasonable measures to protect the security of your personal information.</p>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
