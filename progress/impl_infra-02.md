# Impl infra-02 — SSE event contract and constants

## What I built

Created `packages/shared/src/constants/sse-events.ts` exporting the `SSE_EVENTS` const object with five event name constants and the derived `SSEEventName` union type. Updated `packages/shared/src/types/events.ts` to import `SSEEventName` and add two compile-time exhaustiveness assertions that enforce bidirectional pairing between every constant in `SSE_EVENTS` and every variant in the `SSEEvent` discriminated union. Re-exported both `SSE_EVENTS` and `SSEEventName` from the package root.

## Files touched

- `packages/shared/src/constants/sse-events.ts` — created
- `packages/shared/src/types/events.ts` — modified (added `SSEEventName` import + exhaustiveness checks)
- `packages/shared/src/index.ts` — modified (added re-exports of `SSE_EVENTS` and `SSEEventName`)
- `packages/shared/src/__tests__/sse-events.test.ts` — created

## How I verified

- `pnpm --filter @h-orchestra/shared build` — exit 0
- `pnpm --filter @h-orchestra/shared test` — 31 tests (12 new in sse-events.test.ts + 19 pre-existing), 0 failures
- `pnpm typecheck` — exit 0
- `./init.sh` — exit 0

## Open questions

none
