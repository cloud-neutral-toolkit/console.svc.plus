# Documentation

This directory follows a standard open-source documentation layout and mirrors the code organization of `console.svc.plus`.

## Structure

- `getting-started/` — new user path to get running quickly.
- `architecture/` — system design, boundaries, and decisions.
- `usage/` — configuration and how-to guides.
- `api/` — service API references.
- `integrations/` — external systems and providers.
- `advanced/` — performance, security, scalability, customization.
- `development/` — contributor guides and local setup.
- `operations/` — logging, monitoring, troubleshooting, runbooks.
- `governance/` — license, security policy, release process.
- `appendix/` — FAQ, glossary, references.

## Codebase Mapping

- App layer (Next.js): `src/app`, `src/components`, `src/lib`, `src/state`, `src/modules`
- Library layer (vendored): `packages/neurapress`
- Build/runtime glue: `scripts`, `config`, `public`

## Index

- Getting Started
  - `getting-started/introduction.md`
  - `getting-started/quickstart.md`
  - `getting-started/installation.md`
  - `getting-started/concepts.md`
- Architecture
  - `architecture/overview.md`
  - `architecture/components.md`
  - `architecture/design-decisions.md`
  - `architecture/roadmap.md`
- Usage
  - `usage/cli.md`
  - `usage/config.md`
  - `usage/deployment.md`
  - `usage/examples.md`
- API
  - `api/overview.md`
  - `api/auth.md`
  - `api/endpoints.md`
  - `api/errors.md`
- Integrations
  - `integrations/databases.md`
  - `integrations/cloud.md`
  - `integrations/ai-providers.md`
- Advanced
  - `advanced/performance.md`
  - `advanced/security.md`
  - `advanced/scalability.md`
  - `advanced/customization.md`
- Development
  - `development/contributing.md`
  - `development/dev-setup.md`
  - `development/testing.md`
  - `development/code-structure.md`
- Operations
  - `operations/logging.md`
  - `operations/monitoring.md`
  - `operations/backup.md`
  - `operations/troubleshooting.md`
  - `operations/runbooks/README.md`
  - `operations/runbooks/rag-server.md`
- Governance
  - `governance/license.md`
  - `governance/security-policy.md`
  - `governance/release-process.md`
- Appendix
  - `appendix/faq.md`
  - `appendix/glossary.md`
  - `appendix/references.md`
