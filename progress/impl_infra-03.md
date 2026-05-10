# Impl infra-03 — Cross-platform path utilities

## What I built

Created `packages/shared/src/util/paths.ts` with two pure functions: `normalizeMountPath` normalizes MOUNT_PATH values from any host OS by trimming whitespace, converting backslashes to forward slashes, and stripping trailing slashes (while preserving a bare `/`). `resolveHarnessFile` safely joins a normalized root with a relative harness file path, throwing `RangeError` on any path traversal attempt (relative starting with `..`). Both functions are pure with no fs access or side effects. Re-exported via `packages/shared/src/index.ts`.

## Files touched

- packages/shared/src/util/paths.ts — created
- packages/shared/src/**tests**/paths.test.ts — created
- packages/shared/src/index.ts — modified (added re-export of normalizeMountPath, resolveHarnessFile)

## How I verified

- pnpm --filter @h-orchestra/shared build — exit 0
- pnpm --filter @h-orchestra/shared test — 9 tests, 0 failures (normalizeMountPath × 6, resolveHarnessFile × 3)
- pnpm typecheck — exit 0
- ./init.sh — exit 0

## Open questions

none
