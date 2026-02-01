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
                                    <h3 className="text-xl font-semibold text-heading mb-3">1. 介绍</h3>
                                    <p>欢迎使用 console.svc.plus（以下简称“本服务”或“我们”）。本服务旨在为开发者提供云中立（Cloud-Neutral）的架构构建、部署及托管工具。通过访问我们的网站、注册账户或使用我们的服务，即表示您已阅读、理解并同意受本条款的约束。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">2. 账户注册与安全</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>资格：</strong> 您必须年满 18 岁方可注册使用本服务。</li>
                                        <li><strong>账户安全：</strong> 您有责任维护账户凭证（用户名和密码）的机密性。对于因凭证丢失或被盗而导致的任何活动，您需自行承担责任。</li>
                                        <li><strong>真实信息：</strong> 您同意在注册时提供真实、准确、最新的信息。对于专业版（Pro）用户，我们可能通过 Stripe Identity 进行实名认证，提供虚假身份信息可能导致账户立即终止。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">3. 订阅、计费与退款</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>订阅服务：</strong> 本服务提供免费版及付费订阅版（包括但不限于 $1.9/月的基础版及 $19.9/月的专业版及定制版）。</li>
                                        <li><strong>支付处理：</strong> 所有支付均通过第三方支付处理商 Stripe 安全进行。</li>
                                        <li><strong>自动续费：</strong> 除非您在当前计费周期结束前取消订阅，否则您的订阅将自动续费。</li>
                                        <li><strong>退款政策：</strong> 除非法律另有规定，已支付的订阅费用通常不予退还。您可以随时取消订阅，服务将在当前计费周期结束时停止。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">4. 用户内容与知识产权</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>您的代码：</strong> 您保留您在 console.svc.plus 上托管的代码、文件和项目（统称“用户内容”）的所有权。我们不会主张您代码的知识产权。</li>
                                        <li><strong>许可：</strong> 您授予我们有限的、非独占的许可，以便我们在提供服务所需的范围内（如存储、备份、运行构建任务）使用、托管和复制您的内容。</li>
                                        <li><strong>平台权利：</strong> console.svc.plus 的所有权、商标、界面设计及底层技术归我们所有。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">5. 可接受使用政策 (AUP)</h3>
                                    <p className="mb-2">为维护服务质量，特别是保障独享节点和共享资源的稳定性，严禁进行以下活动：</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>禁止挖矿：</strong> 严禁利用我们的计算资源进行加密货币挖掘（Crypto Mining）。</li>
                                        <li><strong>禁止非法内容：</strong> 严禁托管恶意软件、钓鱼网站、侵权内容或任何违反适用法律的内容。</li>
                                        <li><strong>禁止滥用：</strong> 严禁对平台进行压力测试、DDoS 攻击或试图绕过身份验证机制。</li>
                                        <li><strong>违规处理：</strong> 违反上述规定将导致服务立即暂停或终止，且不予退款。</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">6. 免责声明</h3>
                                    <p>本服务按“原样”和“可用”状态提供。除企业定制版（Enterprise）中明确约定的 SLA（服务等级协议）外，我们不保证服务不会中断或没有错误。您应自行负责定期备份您的数据和代码。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">7. 责任限制</h3>
                                    <p>在法律允许的最大范围内，console.svc.plus 不对因使用或无法使用本服务而导致的任何直接、间接、附带或后果性损害（包括数据丢失或利润损失）承担责任。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">8. 适用法律</h3>
                                    <p>本条款受 香港特别行政区 法律管辖。因本条款引起的任何争议，双方同意提交至香港法院具有专属管辖权。</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">9. 条款修改</h3>
                                    <p>我们保留随时修改这些条款的权利。重大变更将通过电子邮件或网站公告通知您。继续使用服务即视为您接受修改后的条款。</p>
                                </section>
                            </>
                        ) : (
                            <>
                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">1. Introduction</h3>
                                    <p>Welcome to console.svc.plus ("the Service" or "we"). The Service is designed to provide developers with Cloud-Neutral architecture building, deployment, and hosting tools. By accessing our website, registering an account, or using our services, you confirm that you have read, understood, and agree to be bound by these terms.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">2. Account Registration and Security</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Eligibility:</strong> You must be at least 18 years old to register for the Service.</li>
                                        <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials (username and password). You act separately for any activity resulting from lost or stolen credentials.</li>
                                        <li><strong>Real Information:</strong> You agree to provide true, accurate, and current information upon registration. For Pro users, we may verify identity via Stripe Identity; providing false identity information may result in immediate account termination.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">3. Subscription, Billing, and Refunds</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Subscription Service:</strong> The Service offers a free version and paid subscription versions (including but not limited to the Basic plan at $1.9/month and the Pro plan at $19.9/month).</li>
                                        <li><strong>Payment Processing:</strong> All payments are securely processed through third-party payment processor Stripe.</li>
                                        <li><strong>Auto-Renewal:</strong> Unless you cancel your subscription before the end of the current billing cycle, your subscription will automatically renew.</li>
                                        <li><strong>Refund Policy:</strong> Unless otherwise required by law, paid subscription fees are generally non-refundable. You may cancel your subscription at any time, and the service will stop at the end of the current billing cycle.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">4. User Content and Intellectual Property</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Your Code:</strong> You retain ownership of the code, files, and projects you host on console.svc.plus ("User Content"). We claim no intellectual property rights over your code.</li>
                                        <li><strong>License:</strong> You grant us a limited, non-exclusive license to use, host, and reproduce your content to the extent necessary to provide the Service (e.g., storage, backup, running build tasks).</li>
                                        <li><strong>Platform Rights:</strong> We own the trademarks, interface design, and underlying technology of console.svc.plus.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">5. Acceptable Use Policy (AUP)</h3>
                                    <p className="mb-2">In order to maintain service quality, specifically the stability of dedicated and shared nodes, the following activities are strictly prohibited:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>No Mining:</strong> Crypto Mining using our computing resources is strictly prohibited.</li>
                                        <li><strong>No Illegal Content:</strong> Hosting malware, phishing sites, infringing content, or any content violating applicable laws is strictly prohibited.</li>
                                        <li><strong>No Abuse:</strong> Stress testing the platform, DDoS attacks, or attempting to bypass authentication mechanisms is strictly prohibited.</li>
                                        <li><strong>Violation Handling:</strong> Violation of the above rules will result in immediate suspension or termination of service without refund.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">6. Disclaimer</h3>
                                    <p>The Service is provided "as is" and "as available". Except as explicitly agreed in the SLA for the Enterprise version, we do not guarantee that the service will be uninterrupted or error-free. You are solely responsible for regularly backing up your data and code.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">7. Limitation of Liability</h3>
                                    <p>To the maximum extent permitted by law, console.svc.plus shall not be liable for any direct, indirect, incidental, or consequential damages (including loss of data or profits) arising from the use or inability to use the Service.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">8. Governing Law</h3>
                                    <p>These Terms shall be governed by the laws of the Hong Kong Special Administrative Region. Any dispute arising from these Terms shall be submitted to the exclusive jurisdiction of the courts of Hong Kong.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-heading mb-3">9. Modifications</h3>
                                    <p>We reserve the right to modify these terms at any time. Material changes will be notified to you via email or website announcement. Continued use of the service constitutes your acceptance of the modified terms.</p>
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
