# Skill: Upgrade Dependencies

## When to Use

- Explicit dependency upgrade requests
- Security or compatibility fixes

## Steps

1. Identify the target packages and version constraints.
2. Upgrade with minimal scope and document rationale.
3. Validate build and typecheck (see mcp/testing.md).
4. Note any breaking changes or follow-ups.

## Do Not

- Do not upgrade unrelated dependencies.
- Do not change lockfile format unless required by the tool.
