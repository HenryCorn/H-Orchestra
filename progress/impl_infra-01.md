# Impl infra-01 — Shared types package baseline

## What I built

Created six TypeScript type files under `packages/shared/src/types/` covering all required shapes: Feature/FeatureList/FeatureStatus, AgentDefinition, SkillDefinition, ProgressEntry/ProgressCurrent/ImplReport/ReviewReport, ParseError/HarnessState, and the SSEEvent discriminated union. Updated `packages/shared/src/index.ts` to re-export all types. Added vitest as a dev dependency with a config file and 19 runtime-assertion tests covering every type shape and all five SSEEvent variants.

## Files touched

- `packages/shared/src/types/feature.ts` — created
- `packages/shared/src/types/agent.ts` — created
- `packages/shared/src/types/skill.ts` — created
- `packages/shared/src/types/progress.ts` — created
- `packages/shared/src/types/harness.ts` — created
- `packages/shared/src/types/events.ts` — created
- `packages/shared/src/index.ts` — modified (added re-exports of all types)
- `packages/shared/src/__tests__/types.test.ts` — created
- `packages/shared/package.json` — modified (test script changed to vitest run, added vitest devDep)
- `packages/shared/vitest.config.ts` — created

## How I verified

- `pnpm --filter @h-orchestra/shared build` — exit 0, emits .d.ts for all 7 source files
- `pnpm --filter @h-orchestra/shared test` — 19 tests, 0 failures
- `pnpm typecheck` — exit 0 (all three packages: shared, backend, frontend)
- `./init.sh` — exit 0

## Open questions

none
