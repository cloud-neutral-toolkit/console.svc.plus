
# skill｜Testing Gate: PR (Fast) v1

> 目标：快速阻断低成本错误（类型 / lint / 格式 / 单测 / 关键集成）
> 时间预算：建议 ≤ 10 分钟

---

## A. Node/TS（必跑）

1) 类型检查
- Run: `node:typecheck`

2) 静态分析
- Run: `node:lint`

3) 格式检查
- Run: `node:format:check`

4) 单元测试（快速模式）
- Run: `node:test`

---

## B. Go（必跑）

1) 静态分析（聚合）
- Run: `go:lint`

2) 单元测试（包含 httptest 的集成测试）
- Run: `go:test`

---

## C. PR 可选项（按项目启用）

### C1. API 项目（推荐启用：Smoke）
- Run: `node:test:api`
- 范围：只跑关键路径/冒烟用例（登录/健康检查/核心 API）

### C2. 安全扫描（轻量策略）
- 默认：可不跑
- 若启用：优先“变更范围”扫描（或按目录）
- Run: `go:sec`（Go）
- Node 依赖：`npm/pnpm/yarn audit`（如有需要）

### C3. E2E（Playwright）
- 默认：不全跑
- 若启用：只跑 smoke（1-3 条关键流程）
- Run: `node:e2e`

---

## D. Gate 输出格式（给 CI/AI）

- ✅ PASS：列出执行项 + 用时
- ❌ FAIL：列出失败项（命令 + 最关键报错）+ 修复建议（最多 5 条，按优先级）
