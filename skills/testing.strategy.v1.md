
# skill｜Testing & Static Analysis Strategy v1 (Node/TS + Go)

> 目的：用最小主流栈构建“PR 快 / main 严 / release 最严”的质量门禁。
> 范围：Node.js/TypeScript + Go
> 原则：不追求全跑，追求在正确分支跑正确内容。

---

## 0. 栈与边界（固定，不扩散）

### Node.js / TypeScript（最小主流）
- 类型：`tsc --noEmit`
- 静态分析：`eslint`
- 格式：`prettier -c`
- 单测：`jest`
- API 集成：`supertest`（仅 API 项目）
- E2E：`playwright`（仅需要时）

### Go（最小主流）
- 静态分析：`golangci-lint run`
- 安全：`gosec ./...`（按策略启用）
- 单测/集成：`go test ./...`
- HTTP 集成：`httptest`（通过 go test 执行）

---

## 1. 目录与命名约定（推荐）

> 单测/集成测试应尽量走单一入口命令，避免“只能在 CI 跑”的测试。

### Node/TS
- 单测：`**/*.test.ts` 或 `**/*.spec.ts`
- API 集成（supertest）：`tests/api/**/*.test.ts`
- E2E（playwright）：`tests/e2e/**/*.(spec|test).ts`

### Go
- 单测/集成：`*_test.go`
- HTTP 集成：`httptest` 放在对应 package 的 `*_test.go`

---

## 2. 统一执行入口（必须可 CLI 一键运行）

> 这里定义“命令语义”，具体实现可落在 package.json / Makefile / scripts/。

### Node/TS Commands (semantic)
- `node:typecheck`  => `tsc --noEmit`
- `node:lint`       => `eslint .`
- `node:format:check` => `prettier -c .`
- `node:test`       => `jest`
- `node:test:cov`   => `jest --coverage`
- `node:test:api`   => `jest tests/api` (包含 supertest)
- `node:e2e`        => `playwright test`
- `node:build`      => (Next.js) `next build` / (其他) 对应 build

### Go Commands (semantic)
- `go:lint`         => `golangci-lint run`
- `go:test`         => `go test ./...`
- `go:test:cov`     => `go test ./... -coverprofile=cover.out`
- `go:test:race`    => `go test ./... -race`
- `go:sec`          => `gosec ./...`
- `go:build`        => `go build ./...`

---

## 3. 分支策略（入口）

> 本策略通过“子 Skill”拆分执行内容，便于 AI/CI 调用。

### PR Gate
- 调用：`skills/skill.testing.pr.md`

### Main Gate
- 调用：`skills/skill.testing.main.md`

### Release Gate
- 调用：`skills/skill.testing.release.md`

---

## 4. 失败处理（统一规则）

- 任一 Gate 中的 **必跑项失败 => Gate 失败**
- 可选项失败：
  - PR：允许“软失败”（仅提示）或按仓库策略升级为硬失败
  - main/release：建议硬失败（尤其安全与构建）

---

## 5. 输出与产物（建议）

- main/release 保存：
  - 测试报告（JUnit 或默认）
  - 覆盖率（Node/Go）
  - 构建产物（release 必须）

---

## 6. Skill 执行提示（给 AI/Agent）

当你作为 AI/Agent 执行此 Skill：
1) 识别当前分支类型（PR/main/release）
2) 打开并严格执行对应子 Skill
3) 只在需要时启用可选项（supertest/playwright/gosec）
4) 输出简短结论：通过/失败 + 失败项清单 + 修复建议（按优先级）
