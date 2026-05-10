# Impl infra-04 — Result type, error taxonomy, ESLint config

## What I built

Added a generic `Result<T,E>` type with `Ok`/`Err` constructors and `isOk`/`isErr` guards to `packages/shared/src/util/result.ts`. Added `ParserErrorCode`, `RouteErrorCode`, `ParserError`, `RouteError`, and `AppError` to `packages/shared/src/errors.ts`. Wired ESLint flat config at the repo root using `typescript-eslint` v8 with `no-unused-vars` (underscore-prefix exception) and `no-explicit-any` rules; `pnpm lint` runs ESLint across all `packages/*/src/**/*.ts` and `*.tsx` files.

## Files touched

- `packages/shared/src/util/result.ts` — created
- `packages/shared/src/errors.ts` — created
- `packages/shared/src/index.ts` — modified (re-exports Result, Ok, Err, isOk, isErr, ParserErrorCode, RouteErrorCode, ParserError, RouteError, AppError)
- `packages/shared/src/__tests__/result.test.ts` — created
- `eslint.config.js` — created (root-level flat config, CJS `require` since root has no `"type": "module"`)
- `package.json` — modified (root lint script changed from `pnpm -r lint` to direct `eslint` invocation; ESLint devDependencies added by `pnpm add`)
- `pnpm-lock.yaml` — updated (eslint ^9, @eslint/js ^9, typescript-eslint ^8 installed)

## How I verified

- `pnpm --filter @h-orchestra/shared build` — exit 0
- `pnpm --filter @h-orchestra/shared test` — 50 tests, 0 failures (10 new: result.test.ts covers Ok, Err, isOk, isErr, discriminated union narrowing)
- `pnpm typecheck` — exit 0 (all 3 packages)
- `pnpm lint` — exit 0, ESLint processes .ts files across all packages (confirmed via --debug)
- Rule enforcement verified: inserting `const x = 1;` unused in a package src file triggers `@typescript-eslint/no-unused-vars` error
- `./init.sh` — exit 0

## Open questions

- The root `package.json` lint script was previously `pnpm -r lint` (which ran per-package echo stubs). It is now a direct `eslint` invocation. The per-package `"lint"` scripts remain as no-op stubs; if a reviewer prefers each package to run its own ESLint invocation, those stubs could be updated instead. Either approach satisfies the acceptance criteria.
