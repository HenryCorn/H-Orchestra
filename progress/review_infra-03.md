# Review infra-03 — Cross-platform path utilities

## Verdict

APPROVED

## Acceptance criteria

- [x] `packages/shared/src/util/paths.ts` exports `normalizeMountPath(path)` and `resolveHarnessFile(root, relative)`
- [x] Tests cover macOS, POSIX, and Windows-style inputs against real strings
- [x] Functions are pure and have no fs side effects

## Conventions check

- No imports at all in `paths.ts` — functions are fully self-contained
- No `any`, no `@ts-ignore`, no `fs`, no `path.resolve`, no `process.env`
- `.js` suffix on import in test file: `from '../util/paths.js'` ✓
- Both functions re-exported from `packages/shared/src/index.ts` ✓
- `RangeError` thrown on `..` traversal ✓
- TypeScript types are explicit (parameter and return types declared) ✓

## Verification check

- pnpm build result: exit 0 (tsc -b, no errors)
- pnpm test result: 9 tests pass (6 × normalizeMountPath, 3 × resolveHarnessFile), 0 failures
- pnpm typecheck result: exit 0 (all three packages clean)
- ./init.sh result: exit 0, "Harness ready"
- Tests are real: yes — use `node:assert/strict`, no mocks, test real string inputs/outputs

## Test coverage detail

normalizeMountPath covers:

- [x] Clean POSIX path passthrough
- [x] Trailing slash removal
- [x] Windows backslash conversion
- [x] WSL2-style path passthrough
- [x] Surrounding whitespace stripping
- [x] Bare root `/` preservation

resolveHarnessFile covers:

- [x] Normal join (top-level filename)
- [x] Nested relative path
- [x] Path traversal (`..`) throws RangeError

## Required changes

none
