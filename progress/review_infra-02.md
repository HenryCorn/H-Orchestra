# Review infra-02 — SSE event contract and constants

## Verdict

APPROVED

## Acceptance criteria

- [x] `packages/shared/src/constants/sse-events.ts` exports `SSE_EVENTS` (5 entries) and `SSEEventName`
- [x] `packages/shared/src/types/events.ts` defines a discriminated union (`SSEEvent`) keyed on the event name constants
- [x] Constants and types are paired — compile-time exhaustiveness checks (`_AssertAllEventsHaveConstant`, `_AssertAllConstantsHaveEvent`) enforce bidirectional pairing
- [x] Unit test asserts every event name has a matching payload type (12 new tests, each variant constructed and asserted)

## Conventions check

- No `any`, no `@ts-ignore` anywhere in the new or modified files
- All relative imports use `.js` suffixes (NodeNext compliant)
- File names are kebab-case (`sse-events.ts`)
- Tests use `node:assert/strict` with real object construction — no mocks, no snapshots
- Test descriptions describe behaviour, not implementation
- No `console.log` in committed code

Minor observation: `events.ts` still exports a hand-written `SSEEventType` union that is effectively identical to `SSEEventName`. The compile-time exhaustiveness checks ensure they stay in sync, so there is no correctness risk. This is a benign redundancy, not a convention violation; removing it would be a separate cleanup.

## Verification check

- pnpm build result: exit 0 (tsc -b, no errors)
- pnpm test result: exit 0 — 31 tests passed (12 new in sse-events.test.ts + 19 pre-existing)
- pnpm typecheck result: exit 0 across shared, backend, and frontend packages
- ./init.sh result: exit 0 — "Harness ready"
- Tests are real: yes — each SSEEvent variant is instantiated with real field values and asserted against `SSE_EVENTS.<KEY>` constants; no stubs, spies, or snapshot files

## Required changes

none
