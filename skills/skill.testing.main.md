
# skill｜Testing Gate: main (Stable) v1

> 目标：主干任何 commit 都“可发布”
> 要求：全量单测 + 覆盖率 + 关键集成 + 构建可通过

---

## A. Node/TS（必跑）

1) 类型检查
- Run: `node:typecheck`

2) 静态分析
- Run: `node:lint`

3) 格式检查
- Run: `node:format:check`

4) 单元测试 + 覆盖率
- Run: `node:test:cov`

5) API 集成测试（若为 API 项目）
- Run: `node:test:api`
- 要求：至少覆盖核心路径（鉴权/核心 CRUD/关键边界）

6) 构建验证
- Run: `node:build`

---

## B. Go（必跑）

1) 静态分析
- Run: `go:lint`

2) 单元测试 + 覆盖率
- Run: `go:test:cov`

3) 安全扫描（建议 main 必跑）
- Run: `go:sec`

4) 构建验证
- Run: `go:build`

---

## C. E2E（建议）

- Playwright 全量可放 nightly
- main 至少保证：
  - 可选：关键 smoke
  - Run: `node:e2e`（smoke 或 nightly）

---

## D. Gate 输出（建议产物）

- 上传：Node coverage、Go cover.out（或转 html）
- 失败必须阻断合并后发布链路
