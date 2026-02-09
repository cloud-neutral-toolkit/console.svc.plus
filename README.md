# console.svc.plus

**工程师 · 开源 · 云中立**

关注 **Ops / Infra / AI** 与 **技术自由**。
🏗️ 热衷于构建“逃生舱”，防止基础设施被厂商锁定。

> **Accountable Engineer · Open Source · Cloud Neutral**
>
> Focus on **Ops / Infra / AI** and **Technical Freedom**.
> 🏗️ Passionate about building "escape pods" to prevent infrastructure vendor lock-in.

---

**console.svc.plus** 是 Cloud Neutral Toolkit 的**开放云控制面板**。

> **console.svc.plus** is the **Open Cloud Control Panel** for the Cloud Neutral Toolkit.

## 项目简介 (About The Project)

本项目是 Cloud Neutral 生态系统的核心可视化界面（前端仪表盘）。它连接各个微服务，为管理云中立基础设施提供统一的控制平面。

> This repository serves as the central visual interface (Frontend Dashboard) for the Cloud Neutral ecosystem. It connects various micro-services to provide a unified control plane for managing your cloud-neutral infrastructure.

该生态系统目前包含多个专用的微后端和服务：

*   **console.svc.plus**: (本项目) 主前端仪表盘。
*   **accounts.svc.plus**: 身份与账户管理服务。
*   **rag-server.svc.plus**: 检索增强生成 (RAG) 后端。
*   **postgresql.svc.plus**: 带有专用扩展的 PostgreSQL 数据库服务。
*   **page-reading-agent-backend**: 页面阅读智能体后端逻辑。
*   **page-reading-agent-dashboard**: 页面阅读智能体专用仪表盘。
*   **wechat-to-markdown.svc.plus**: 微信内容转 Markdown 工具服务 (开源引用项目)

## 技术栈 (Tech Stack)

本仪表盘使用现代 Web 技术构建：
> This dashboard is built using modern web technologies:

*   **框架**: [Next.js](https://nextjs.org/)
*   **语言**: TypeScript
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI 组件**: [Radix UI](https://www.radix-ui.com/)
*   **内容管理**: [Contentlayer](https://contentlayer.dev/)

## 快速开始 (Getting Started)

### 前置要求 (Prerequisites)

*   Node.js (`>=18.17 <25`)
*   Yarn (推荐) 或 npm

### 一键初始化 (Setup Script)

支持使用 `curl | bash` 在本地快速拉取仓库并完成依赖安装（不写入任何 secrets；若本地不存在 `.env`，会从 `.env.example` 生成占位 `.env`）：

```bash
curl -fsSL "https://raw.githubusercontent.com/cloud-neutral-toolkit/console.svc.plus/main/scripts/setup.sh?$(date +%s)" | bash -s -- console.svc.plus
```

> Notes: If `cloud-neutral-toolkit/console.svc.plus` is private, you'll need access/auth (e.g. `gh auth login`) before cloning works.

### 安装 (Installation)

```bash
yarn install
```

### 本地运行 (Running Locally)

启动开发服务器：
> To start the development server:

```bash
yarn dev
```

此命令会运行设置脚本 (`scripts/Dev-MCP-Server.sh`) 并启动带有 TurboPack 的 Next.js 开发服务器。
> This command runs the setup script (`scripts/Dev-MCP-Server.sh`) and starts the Next.js development server with TurboPack.

### 构建生产版本 (Building for Production)

```bash
yarn build
```

## 认证配置 (Authentication Configuration)

有关如何配置 GitHub 和 Google OIDC 认证的详细步骤，请参阅 [OIDC 认证指南](./docs/integrations/oidc-auth.md)。

> For detailed steps on configuring GitHub and Google OIDC authentication, please refer to the [OIDC Authentication Guide](./docs/integrations/oidc-auth.md).

## 统计配置 (Homepage Stats Configuration)

首页“注册用户数 / 访问量”所需 Cloudflare 变量说明，请参阅 [Cloudflare Web Analytics 集成配置](./docs/integrations/cloudflare-web-analytics.md)。

> For Cloudflare variables used by homepage stats, see the [Cloudflare Web Analytics integration guide](./docs/integrations/cloudflare-web-analytics.md).

## 开发指南 (Development Guidelines)

有关详细的编码标准、架构规则和 Agent 特定说明，请参阅 [AGENTS.md](./AGENTS.md)。

> For detailed coding standards, architecture rules, and agent-specific instructions, please refer to [AGENTS.md](./AGENTS.md).

## 文档 (Docs)

- EN: `docs/` (see `docs/README.md`)
- ZH: `docs/zh/` (see `docs/zh/README.md`)

## 脚本 (Scripts)

*   `dev`: 启动开发服务器。
*   `build`: 构建生产版本应用。
*   `test`: 使用 Vitest 运行单元测试。
*   `test:e2e`: 使用 Playwright 运行端到端测试。
*   `lint`: 运行代码检查 (Linter)。
