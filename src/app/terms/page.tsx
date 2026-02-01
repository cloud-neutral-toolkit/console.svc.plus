"use client";

import React from "react";
import UnifiedNavigation from "../../components/UnifiedNavigation";
import Footer from "../../components/Footer";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function TermsPage() {
    const { language } = useLanguage();
    const isChinese = language === "zh";

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-150 flex flex-col">
            <UnifiedNavigation />

            <main className="flex-1 relative overflow-hidden pt-24 pb-20">
                <div className="relative mx-auto max-w-4xl px-6">
                    <h1 className="text-3xl font-bold mb-8">
                        {isChinese ? "服务条款" : "Terms of Service"}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-text-muted">
                        {/* Simple placeholder Terms */}
                        {isChinese ? (
                            <>
                                <p>最后更新：2026年2月1日</p>
                                <h3>1. 介绍</h3>
                                <p>欢迎使用 Cloud-Neutral Toolkit。通过访问我们的网站和使用我们的服务，您同意受这些条款的约束。</p>
                                <h3>2. 使用许可</h3>
                                <p>根据这些条款，我们需要您同意仅将服务用于合法用途。</p>
                                <h3>3. 免责声明</h3>
                                <p>本服务按“原样”提供，不提供任何明示或暗示的保证。</p>
                            </>
                        ) : (
                            <>
                                <p>Last Updated: February 1, 2026</p>
                                <h3>1. Introduction</h3>
                                <p>Welcome to Cloud-Neutral Toolkit. By accessing our website and using our services, you agree to be bound by these terms.</p>
                                <h3>2. License to Use</h3>
                                <p>Subject to these terms, we grant you a limited, non-exclusive license to use our services for lawful purposes.</p>
                                <h3>3. Disclaimer</h3>
                                <p>The services are provided "as is" without warranties of any kind, whether express or implied.</p>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
