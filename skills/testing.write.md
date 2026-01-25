# Skill: Write Tests

## When to Use

- New features
- Bug fixes with reproducible behavior
- Refactors that change logic

## Steps

1. Identify test scope and location.
2. Add or update unit tests under \*.test.ts/tsx.
3. Mock external dependencies in test setup.
4. Run minimal verification (see mcp/testing.md).

## Do Not

- Do not add E2E tests unless requested.
- Do not change production code to fit tests.
