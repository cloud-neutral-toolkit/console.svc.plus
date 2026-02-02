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
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl mb-4">
                            {isChinese ? "服务条款 (Terms of Service)" : "Terms of Service"}
                        </h1>
                        <p className="text-text-muted">
                            {isChinese ? "生效日期：2026年2月1日 | 最后更新：2026年2月1日" : "Effective Date: February 1, 2026 | Last Updated: February 1, 2026"}
                        </p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
                        {isChinese ? (
                            <>
                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">1. 服务协议的接受 / Acceptance of Terms</h3>
                                    <p>访问或使用 svc.plus 提供的服务（下称“服务”），即表示您同意接受本条款的约束。如果您代表某个实体使用服务，则您声明具有代表该实体接受本条款的合法权限。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">2. 账户与安全 / Accounts & Security</h3>
                                    <p>您必须确保账户信息的准确性，并对账户下的所有活动负责。您不得将账户泄露或转让给第三方。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">3. 订阅、支付与退款 / Subscription, Payment & Refunds</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>费用：</strong> 部分服务需付费订阅。所有价格以页面显示为准。</li>
                                        <li><strong>支付：</strong> 我们通过 Stripe 处理支付。订阅通常会自动续订，除非您在账单周期结束前取消。</li>
                                        <li><strong>退款：</strong> 除法律要求外，已收取的费用通常不予退还。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">4. 使用规范与限制 / Acceptable Use</h3>
                                    <p className="mb-2">您不得利用本服务进行以下行为：</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>违反任何适用的法律法规。</li>
                                        <li>干扰或破坏服务、服务器或网络的完整性。</li>
                                        <li>逆向工程、反编译或试图获取服务的源代码。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">5. 第三方云服务免责 / Third-Party Cloud Providers</h3>
                                    <p>本服务作为云原生工具，依赖于 Google Cloud、AWS 等第三方服务商。对于因第三方服务商导致的宕机、数据丢失或服务中断，svc.plus 不承担赔偿责任。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">6. 免责声明与责任限制 / Limitation of Liability</h3>
                                    <p>服务按“现状”提供，不提供任何形式的担保。在法律允许的最大范围内，svc.plus 对任何间接、附带或特殊损害（包括利润损失、数据丢失）不承担责任。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">7. 条款变更 / Changes to Terms</h3>
                                    <p>我们保留随时修改本条款的权利。重大变更将通过邮件或网站公告通知。继续使用服务即视为接受修订后的条款。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">8. 联系我们 / Contact Us</h3>
                                    <p>如有任何疑问，请联系：<a href="mailto:support@svc.plus" className="text-primary hover:underline">support@svc.plus</a></p>
                                </section>
                            </>
                        ) : (
                            <>
                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">1. Acceptance of Terms</h3>
                                    <p>By accessing or using the services provided by svc.plus (the "Service"), you agree to be bound by these terms. If you are using the Service on behalf of an entity, you represent that you have the legal authority to bind that entity to these terms.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">2. Accounts & Security</h3>
                                    <p>You must ensure the accuracy of your account information and are responsible for all activities under your account. You shall not disclose or transfer your account to any third party.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">3. Subscription, Payment & Refunds</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Fees:</strong> Certain parts of the Service are billed on a subscription basis. All prices are as displayed on the platform.</li>
                                        <li><strong>Payment:</strong> We process payments via Stripe. Subscriptions typically renew automatically unless canceled before the end of the billing cycle.</li>
                                        <li><strong>Refunds:</strong> Except as required by law, paid fees are generally non-refundable.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">4. Acceptable Use</h3>
                                    <p className="mb-2">You may not use the Service to:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Violate any applicable laws or regulations.</li>
                                        <li>Interfere with or disrupt the integrity of the Service, servers, or networks.</li>
                                        <li>Reverse engineer, decompile, or attempt to derive the source code of the Service.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">5. Third-Party Cloud Providers</h3>
                                    <p>As a cloud-native toolkit, the Service relies on third-party providers (e.g., Google Cloud, AWS). svc.plus is not liable for any downtime, data loss, or service interruption caused by these third-party providers.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">6. Limitation of Liability</h3>
                                    <p>The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, svc.plus shall not be liable for any indirect, incidental, or special damages (including loss of profits or data).</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">7. Changes to Terms</h3>
                                    <p>We reserve the right to modify these terms at any time. Major changes will be notified via email or website announcement. Continued use of the Service constitutes acceptance of the revised terms.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">8. Contact Us</h3>
                                    <p>For any questions, please contact: <a href="mailto:support@svc.plus" className="text-primary hover:underline">support@svc.plus</a></p>
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
