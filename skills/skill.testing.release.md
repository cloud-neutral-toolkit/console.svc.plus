# skill｜Testing Gate: release (Strict) v1

> 目标：“我跑过的就是我发的”
> 要求：最严门禁 + 可复现产物 + 端到端验证

---

## A. Node/TS（必跑）

1) 类型检查
- Run: `node:typecheck`

2) 静态分析
- Run: `node:lint`

3) 格式检查
- Run: `node:format:check`

4) 单元测试 + 覆盖率（可加门槛）
- Run: `node:test:cov`
- Coverage Gate（建议，按团队成熟度逐步提高）：
  - lines >= 70%（起步）
  - 或 diff coverage >= 80%

5) API 集成测试（若为 API 项目）
- Run: `node:test:api`
- 要求：全量或覆盖关键路径 + 错误分支

6) E2E（Playwright 全量）
- Run: `node:e2e`

7) 构建产物（必须保存）
- Run: `node:build`
- 要求：保存 artifacts（dist/.next 等）

---

## B. Go（必跑）

1) 静态分析
- Run: `go:lint`

2) 单元测试（Race 优先）
- Run: `go:test:race`
- 若环境不支持 race：至少 `go:test`

3) 覆盖率
- Run: `go:test:cov`

4) 安全扫描（必须）
- Run: `go:sec`

5) 构建产物（必须保存）
- Run: `go:build`（或 docker build）
- 要求：保存 artifacts / 镜像 digest

---

## C. Release Gate 输出要求

- 必须输出：
  - 版本号 / commit sha
  - 覆盖率摘要
  - E2E 通过摘要
  - 构建产物指纹（hash/digest）
- 任何失败 => 阻断发布
