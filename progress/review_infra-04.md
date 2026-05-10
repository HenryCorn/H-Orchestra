# Review infra-04 — Result type, error taxonomy, ESLint config

## Verdict

APPROVED

## Acceptance criteria

- [x] `packages/shared/src/util/result.ts` exports `Result`, `Ok`, `Err`, `isOk`, `isErr` — all five symbols present; `Ok<T>` and `Err<E>` are both types and constructors; `Result<T,E>` is a discriminated union; `isOk`/`isErr` are narrowing type guards.
- [x] `packages/shared/src/errors.ts` exports `ParserErrorCode` enum (6 codes, ≥4 required) and `RouteErrorCode` enum (4 codes), plus `ParserError` type, `RouteError` type, and `AppError` discriminated union on `kind: "parser" | "route"`.
- [x] Root-level `eslint.config.js` uses flat config (CJS `require`); no `.eslintrc*` files found in the repo. `pnpm lint` runs `eslint "packages/*/src/**/*.ts" "packages/*/src/**/*.tsx"`.
- [x] `no-unused-vars` set to error with `argsIgnorePattern: '^_'` and `varsIgnorePattern: '^_'` (via `@typescript-eslint/no-unused-vars`); `no-explicit-any` set to error (via `@typescript-eslint/no-explicit-any`).

## Conventions check

- No `any` in `result.ts` or `errors.ts` — confirmed by grep (no matches).
- No `@ts-ignore` in new source files — confirmed by grep (no matches).
- `packages/shared/src/index.ts` re-exports all new symbols: `Ok`, `Err`, `isOk`, `isErr` (values), `Result` (type), `ParserErrorCode`, `RouteErrorCode` (enums), `ParserError`, `RouteError`, `AppError` (types).
- ESLint `ignores` block covers `**/dist/**`, `**/node_modules/**`, `**/*.js`, `**/*.mjs`, and `eslint.config.js` itself.
- Tests use `node:assert/strict` + `vitest describe/it` (no mocks, real logic tested).

## Verification check

- pnpm build result: exit 0 — `tsc -b` succeeded
- pnpm test result: exit 0 — 50 tests passed (10 new in `result.test.ts`; `isOk(Ok(1)) === true`, `isOk(Err("e")) === false`, discriminated narrowing of `.value` and `.error` all verified)
- pnpm typecheck result: exit 0 — all 3 packages (shared, backend, frontend)
- pnpm lint result: exit 0 — ESLint processes all `.ts`/`.tsx` files across packages
- ./init.sh result: exit 0 — "Harness ready"
- Tests are real: yes — tests use `node:assert/strict` with genuine runtime assertions on constructed values; no mocks or trivially-passing stubs

## Required changes

none
