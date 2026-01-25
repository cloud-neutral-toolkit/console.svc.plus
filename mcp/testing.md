# Minimal Verification

## Next.js Dashboard

Required:

- yarn lint (currently fails under Next 16 CLI; use eslint command below)
- ./node_modules/.bin/eslint . --no-eslintrc --config .eslintrc.json --resolve-plugins-relative-to .
- yarn typecheck
- yarn build

Best effort:

- yarn dev

Do not ask the user to run these unless manual interaction is required.
