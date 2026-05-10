# H-Orchestra — Verification Procedures

## Level 1 — Type Safety (mandatory after every change)

```bash
pnpm typecheck
```

All three packages must pass with zero errors. If shared types changed, build shared first:
```bash
pnpm --filter @h-orchestra/shared build && pnpm typecheck
```

## Level 2 — Build (mandatory before marking done)

```bash
pnpm build
```

Compiles: shared → frontend (Vite) → backend (tsc). Both must succeed. Vite chunk size warnings are acceptable.

## Level 3 — Unit Tests (mandatory for parser/template changes)

```bash
pnpm --filter @h-orchestra/backend test
```

All tests must pass. New parsers require a test file at `packages/backend/src/parsers/__tests__/<name>.parser.test.ts` with at least:
- Happy path with a realistic fixture
- Graceful fallback on malformed input
- Path/metadata field correctness

New template functions require tests in `packages/backend/src/templates/__tests__/`.

## Level 4 — Harness Verification (mandatory before session closure)

```bash
bash init.sh
```

Must exit 0. This validates Node.js version, dependencies, shared build, typecheck, and full build. If it fails, the task is not complete.

## Level 5 — Manual Smoke Test (for new parsers and SSE events)

Start the backend pointing at a test repo:
```bash
MOUNT_PATH=/path/to/harness-repo CHOKIDAR_USEPOLLING=false \
  pnpm --filter @h-orchestra/backend dev
```

Then in a second terminal:
```bash
curl -N --max-time 10 http://localhost:3001/api/events
```

Edit the relevant file in the test repo. Confirm the correct SSE event type appears in the stream within 1 second.

## Level 6 — Visual Check (for new frontend views)

Start the full dev stack:
```bash
MOUNT_PATH=/path/to/harness-repo pnpm dev
```

Open `http://localhost:5173`. Navigate to the new view and verify:
- Text uses Space Grotesk (body) or Space Mono (labels)
- Background is `#000` for root, `var(--color-surface)` for cards
- No colored elements except `var(--color-critical)` for errors
- Borders are `1px solid var(--color-border)` (`#2A2A2A`)
- No Tailwind color classes visible in DevTools

## Test Repo

For manual testing, point `MOUNT_PATH` at a clone of:
`https://github.com/betta-tech/ejemplo-harness-subagentes`

This repo has the full multi-agent harness structure: `.claude/agents/`, `progress/`, `CHECKPOINTS.md`, `feature_list.json`, `init.sh`, `AGENTS.md`.
