# Deployment

This repository primarily delivers a web frontend experience and should document product flows, UI boundaries, and integration touchpoints.

Use this page to standardize deployment prerequisites, supported topologies, operational checks, and rollback notes.

## Current code-aligned notes

- Documentation target: `console.svc.plus`
- Repo kind: `frontend`
- Manifest and build evidence: package.json (`dashboard`)
- Primary implementation and ops directories: `src/`, `scripts/`, `tests/`, `config/`, `public/`
- Package scripts snapshot: `dev`, `prebuild`, `build`, `build:static`, `start`, `lint`

## Existing docs to reconcile

- `development/dev-setup.md`
- `getting-started/installation.md`
- `getting-started/quickstart.md`
- `governance/release-process.md`
- `operations/runbooks/README.md`
- `operations/runbooks/rag-server.md`
- `usage/deployment.md`
- `zh/development/dev-setup.md`

## What this page should cover next

- Describe the current implementation rather than an aspirational future-only design.
- Keep terminology aligned with the repository root README, manifests, and actual directories.
- Link deeper runbooks, specs, or subsystem notes from the legacy docs listed above.
- Verify deployment steps against current scripts, manifests, CI/CD flow, and environment contracts before each release.
