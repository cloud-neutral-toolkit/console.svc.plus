# Architecture & Stack

## Layers

- Application layer: src/app/**, src/components/**, src/lib/**, src/state/**, src/modules/\*\*
- Library layer: packages/\*\* (vendored libraries, no app dependencies)
- Build/runtime glue: scripts/**, config/**, public/\*\*

## Tech Stack

- Framework: Next.js App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS
- UI: Radix UI
- Content: Contentlayer

## State Management

- Global state uses Zustand only, confined to src/state/** or src/app/store/**.
- URL-synced state must live in Zustand slices.
