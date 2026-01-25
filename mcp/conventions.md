# Naming, Directory, Style

## Naming

- Components: PascalCase (UserProfile.tsx)
- Utilities: kebab-case (user-utils.ts)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase with T prefix for generics (TUser)

## Imports

- src/\*\* may use @/ aliases.
- packages/\*\* must use relative imports or package exports.
- Group imports: React, third-party, local types, local components.

## TypeScript

- Use type for type definitions.
- Use interface for object shapes.
- Prefer explicit return types for public APIs.

## Formatting

- Use Prettier via yarn format.
- Avoid reformatting unrelated code.
