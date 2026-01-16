# Agent Guidelines for dashboard/

These rules apply to the entire dashboard repository.
They exist to keep architecture stable when humans or AI agents modify code.

This repo contains:

- A large Next.js App Router application (dashboard)
- Vendored internal libraries under packages/\*
- No monorepo tooling assumptions beyond local file dependencies

AI agents MUST respect these boundaries.

---

## 1. Build, Lint & Test Commands

### Development

```bash
yarn dev              # Start development server with MCP server
yarn build            # Production build (runs prebuild scripts)
yarn build:static     # Static build (includes prebuild)
yarn start            # Start production server
yarn preview          # Build and start production server
```

### Code Quality

```bash
yarn lint             # Run ESLint
yarn typecheck        # TypeScript type checking
yarn format           # Format code with Prettier
```

### Testing

```bash
yarn test             # Run unit tests (Vitest)
yarn test:unit        # Run unit tests explicitly
yarn test:e2e         # Run E2E tests (Playwright)

# Run a single unit test file
yarn test path/to/file.test.ts
yarn test --run path/to/file.test.ts

# Run a single Playwright spec
yarn test:e2e path/to/spec.test.ts
```

---

## 2. Repository Mental Model (Read This First)

This repository has **three clearly separated layers**:

### A. Application Layer (Next.js App Router)

src/app/**, src/components/**, src/lib/**, src/state/**, src/modules/\*\*

This is the **only place** where:

- Routing exists
- Global state exists
- Runtime config is loaded
- Zustand is allowed

### B. Vendored Library Layer

packages/neurapress/\*\*

This is a **library**, not an application. It may contain:

- React components
- Editor logic
- Markdown utilities
- Styles and assets

It MUST NOT:

- Behave like a Next.js app
- Depend on dashboard routing or aliases
- Own global state

### C. Build / Runtime Glue

scripts/**, config/**, public/\*\*

Used for build-time or runtime wiring only.

---

## 3. Import & Alias Rules (Critical)

### Dashboard code (src/\*\*)

- Allowed: `import { X } from "@/components/X"`
- Group imports: React → third-party → local types → local components

```ts
import React, { useEffect } from "react";
import { Button } from "@radix-ui/react-button";
import type { User } from "@/types/user";
import { UserCard } from "@/components/UserCard";
```

### Vendored packages (packages/\*\*)

- 🚫 ABSOLUTELY FORBIDDEN: `@/` aliases inside packages
- ✅ Use relative imports or package exports

---

## 4. TypeScript & Formatting Rules

- Strict mode enabled
- Use `type` for type definitions, `interface` for object shapes
- Prefer explicit return types for public APIs
- Use `const` for variables that won't be reassigned
- Run Prettier via `yarn format` before finalizing changes
- Keep functions small; avoid large inline objects in JSX

---

## 5. Naming Conventions

- Components: PascalCase (`UserProfile.tsx`)
- Files: kebab-case for utilities (`user-utils.ts`), PascalCase for components
- Variables: camelCase (`userName`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types: PascalCase with `T` prefix for generic types (`TUser`)

---

## 6. Error Handling & Logging

- Use try/catch for async operations
- Return Result types or throw errors consistently
- Log errors with context, never expose stack traces to users
- Avoid swallowing errors without comment or fallback

---

## 7. React Patterns

- Use `'use client'` directive for client components
- Prefer function components with hooks
- Use `React.memo` for expensive components
- Avoid inline functions in render props

---

## 8. Global State Rules (Dashboard Only)

✅ Zustand is the **only** allowed global state mechanism
❌ React Context for shared/global state is forbidden

Allowed only in: src/state/**, src/app/store/**

Rule: If state must survive navigation or be shared → it lives in Zustand.

---

## 9. URL-Synchronized State

Anything involving:

- URL ↔ state
- Editor deep links
- Shareable views

MUST be handled inside Zustand slices.

❌ Forbidden:

- Parsing URL params inside components
- Sync logic inside useEffect

---

## 10. Component State Rules

Allowed:

- useState for local UI only
- useEffect for browser-only effects
- useRef for DOM access

Forbidden:

- useState for cross-component data
- Local state mirroring global state

---

## 11. packages/neurapress Rules (Very Important)

packages/neurapress is treated as a vendored internal library.

MUST:

- Keep its own internal structure
- Use relative imports or package exports
- Remain usable outside this repo
- Export public APIs via: src/index.ts, src/editor/index.ts, src/components/index.ts, src/lib/index.ts

MUST NOT:

- Assume Next.js App Router context
- Introduce app/, page.tsx, layout.tsx dependencies into dashboard
- Introduce Zustand, Context, or global state
- Depend on dashboard-specific CSS or runtime config

---

## 12. Testing Guidelines

- Unit tests: Vitest with jsdom environment
- E2E tests: Playwright
- Test files: `*.test.{ts,tsx}` or `__tests__/**/*`
- Use `describe`, `it`, `expect` from Vitest
- Mock external dependencies in test setup

---

## 13. Environment & Runtime Config

- No new environment variables without approval
- Runtime config must live in: src/config/runtime-service-config\*.yaml
- Runtime config is hydrated in dashboard only
- packages/\* must remain config-agnostic

---

## 14. Cursor / Copilot Rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found

---

## 15. TL;DR for AI Agents

- dashboard = application
- packages = libraries
- Zustand only in dashboard
- No @/ imports inside packages
- Never "fix" libraries by polluting the app
- Always run `yarn lint` and `yarn typecheck` before completing tasks
