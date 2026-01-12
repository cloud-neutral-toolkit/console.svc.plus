# Agent Guidelines for portal.onwalk.net

These rules apply to the entire repository. They exist to keep architecture stable when humans or AI agents modify code.

This repo is a Next.js App Router application (no vendored packages layer).

---

## 1. Repository Mental Model

### Application Layer (Next.js App Router)

Primary code lives in:
- `src/app/**`
- `src/components/**`
- `src/modules/**`
- `src/lib/**`
- `src/server/**`
- `src/content/**`
- `src/data/**`
- `src/i18n/**`

This is where routing, UI, and runtime behavior live.

### Build / Runtime Glue

Used for build-time or runtime wiring only:
- `scripts/**`
- `public/**`
- `src/config/**`

---

## 2. Global State Rules

- Zustand is the preferred mechanism for shared/global state.
- Avoid introducing new global state mechanisms without approval.
- If state must survive navigation or be shared across routes, put it in a store rather than local component state.

---

## 3. URL-Synchronized State

- Keep URL <-> state sync centralized (stores or routing utilities), not scattered across components.
- Avoid duplicating URL parsing logic in multiple components.

---

## 4. Component State Rules

Allowed:
- `useState` for local UI only
- `useEffect` for browser-only effects
- `useRef` for DOM access

Avoid:
- Local state mirroring global/store state

---

## 5. Import & Alias Rules

- Use `@/` aliases only for `src/**`.
- Do not add new path aliases or import rewrites without approval.

---

## 6. Environment & Runtime Config

- No new environment variables without approval.
- Runtime config must live in:
  - `src/config/runtime-service-config*.yaml`

---

## 7. Directory Safety Rules

AI agents MUST NOT:
- Reorganize directories unless explicitly instructed
- Move files across major boundaries (for example, `src/app` <-> `src/lib`) without approval

---

## 8. Testing Expectations (When Applicable)

Before considering a change complete:
- `yarn lint`
- `yarn test`

---

## 9. TL;DR

- This repo is an App Router application (no packages layer).
- Prefer Zustand for shared/global state.
- Keep URL-sync logic centralized.
- Use `@/` only for `src/**`.
- Runtime config lives in `src/config/runtime-service-config*.yaml`.
