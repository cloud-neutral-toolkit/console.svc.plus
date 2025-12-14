# Agent Guidelines for dashboard/

These rules apply to the entire dashboard repository.
They exist to keep architecture stable when humans or AI agents modify code.

This repo contains:
- A large Next.js App Router application (dashboard)
- Vendored internal libraries under packages/*
- No monorepo tooling assumptions beyond local file dependencies

AI agents MUST respect these boundaries.

---

## 1. Repository Mental Model (Read This First)

This repository has **three clearly separated layers**:

### A. Application Layer (Next.js App Router)

src/app/**
src/components/**
src/lib/**
src/state/**
src/modules/**

yaml
复制代码

This is the **only place** where:
- Routing exists
- Global state exists
- Runtime config is loaded
- Zustand is allowed

---

### B. Vendored Library Layer

packages/neurapress/**

yaml
复制代码

This is a **library**, not an application.

It may contain:
- React components
- Editor logic
- Markdown utilities
- Styles and assets

It MUST NOT:
- Behave like a Next.js app
- Depend on dashboard routing or aliases
- Own global state

---

### C. Build / Runtime Glue

scripts/**
config/**
public/**

yaml
复制代码

Used for build-time or runtime wiring only.

---

## 2. Global State Rules (Dashboard Only)

✅ Zustand is the **only** allowed global state mechanism  
❌ React Context for shared/global state is forbidden

Allowed only in:
src/state/**
src/app/store/**

yaml
复制代码

Forbidden everywhere else (including packages/*).

Rule:
> If state must survive navigation or be shared → it lives in Zustand.

---

## 3. URL-Synchronized State

Anything involving:
- URL ↔ state
- Editor deep links
- Shareable views

MUST be handled inside Zustand slices.

❌ Forbidden:
- Parsing URL params inside components
- Sync logic inside useEffect

---

## 4. Component State Rules

Allowed:
- useState for local UI only
- useEffect for browser-only effects
- useRef for DOM access

Forbidden:
- useState for cross-component data
- Local state mirroring global state

---

## 5. Import & Alias Rules (Critical)

### Dashboard code (src/**)

Allowed:
```ts
import { X } from '@/components/X'
import { Y } from '@/lib/Y'
Vendored packages (packages/**)
🚫 ABSOLUTELY FORBIDDEN:

ts
复制代码
import { X } from '@/components/X'
import { Y } from '@/lib/Y'
These aliases do not exist inside packages.

✅ Allowed inside packages:

ts
复制代码
import { ArticleList } from '../components/ArticleList'
or

ts
复制代码
import { ArticleList } from '@internal/neurapress/components'
Packages must be path-self-contained.

Dashboard config MUST NOT be modified to “fix” package imports.

6. packages/neurapress Rules (Very Important)
packages/neurapress is treated as a vendored internal library.

MUST:
Keep its own internal structure

Use relative imports or package exports

Remain usable outside this repo

Export public APIs via:

src/index.ts

src/editor/index.ts

src/components/index.ts

src/lib/index.ts

MUST NOT:
Assume Next.js App Router context

Introduce app/, page.tsx, layout.tsx dependencies into dashboard

Introduce Zustand, Context, or global state

Depend on dashboard-specific CSS or runtime config

7. Fixing Build Errors Involving packages/*
When a build error originates from packages/*:

✅ Correct approach:

Fix the import inside the package

Adjust package-level exports

Preserve original behavior

🚫 Forbidden shortcuts:

Adding webpack aliases in dashboard

Moving package files into src/

Duplicating components across layers

8. Directory Safety Rules
AI agents MUST NOT:

Reorganize directories unless explicitly instructed

Move files across src/ ↔ packages/

Collapse packages into app code

9. Environment & Runtime Config
No new environment variables without approval

All runtime config must live in:

arduino
复制代码
src/config/runtime-service-config*.yaml
Runtime config is hydrated in dashboard only

packages/* must remain config-agnostic.

10. Testing Expectations (When Applicable)
Before considering a change complete:

bash
复制代码
yarn lint
yarn test
If touching:

URL state

Editor routing

Insight / CMS behavior

→ add or update tests accordingly.

11. TL;DR for AI Agents
dashboard = application

packages = libraries

Zustand only in dashboard

No @/ imports inside packages

Never “fix” libraries by polluting the app
