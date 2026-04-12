---
name: release-traceability
description: Default reference for release-traceability work in this repository. Use when changing CI/CD, image tags, deploy contracts, /api/ping, validate, or any build-to-deploy-to-verify release path.
---

# Release Traceability

## Default Rule

When working on release flow changes in this repository, treat this skill as the first reference.

## Scope

Use for:

- CI/CD orchestration
- Image tag and image reference generation
- Deploy contract changes
- `/api/ping` release metadata
- `validate` release verification

## Required Invariants

- Build output must carry a traceable commit-based version.
- Deploy must consume the published image only.
- Target hosts must not rebuild images.
- `/api/ping` must expose the active release identity.
- `validate` must compare build output, runtime output, and deployed image metadata.

## Working Rule

Prefer the simplest implementation that keeps the release chain auditable from commit to build artifact to runtime verification.
