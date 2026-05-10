# H-Orchestra — Agent Instructions

## Role

You are the **leader agent**. Your job is to orchestrate — not to code.

Read `AGENTS.md` first. It tells you the repository map, task selection rules, and session closure steps. Then:

1. Check `feature_list.json` for the first `pending` task
2. Check `progress/current.md` to see if a task is already in progress
3. Delegate implementation to the **implementer** subagent via the Agent tool
4. Delegate review to the **reviewer** subagent via the Agent tool
5. Only after the reviewer approves: mark the task `completed` and update `progress/history.md`

**Do not edit files in `packages/` directly.** Delegate all source code changes to the implementer.

---

## Project Overview

H-Orchestra is a **pnpm monorepo** with three TypeScript packages:
- `packages/shared` — zero-runtime types and constants (compiled to `dist/` before others)
- `packages/backend` — Fastify 5 server, Chokidar file watcher, SSE broadcast, REST API
- `packages/frontend` — React 19, Vite 6, Tailwind CSS 4, Zustand, Nothing Design UI

Reference: [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

---

## Session Start

1. Read `AGENTS.md` — understand current state and which agent files to delegate to
2. Run `bash init.sh` — verify baseline is clean (exits 0)
3. Read `feature_list.json` — find the first `pending` task
4. Read `progress/current.md` — check for any in-progress work from prior sessions
5. Select a task and delegate via Agent tool to `.claude/agents/implementer.md`

## Session End

1. Confirm implementer finished and reviewer approved
2. Mark task `completed` in `feature_list.json`
3. Append to `progress/history.md`
4. Set `progress/current.md` to "No active session."
5. Commit: `git commit -m "feat: <task label>"`

---

## Workspace Commands (for reference — pass these to subagents)

```bash
pnpm install                                    # install all packages
pnpm typecheck                                  # type-check all three packages
pnpm build                                      # shared → frontend → backend
pnpm --filter @h-orchestra/backend dev          # backend watch mode
pnpm --filter @h-orchestra/frontend dev         # frontend Vite dev server
pnpm --filter @h-orchestra/backend test         # run unit tests
pnpm --filter @h-orchestra/<package> add <dep>  # add a dependency
```

---

## Architecture Quick Reference

See `docs/architecture.md` for the full SSE pipeline, parser registry pattern, and Nothing Design rules.
See `docs/conventions.md` for TypeScript strict mode rules, `.js` extensions, and CSS variable requirements.
See `docs/verification.md` for the 6-level verification procedure.

### Adding a harness file parser
1. Create `packages/backend/src/parsers/<name>.parser.ts`
2. Register in `packages/backend/src/parsers/index.ts`
3. Add event shape to `packages/shared/src/types/events.ts`
4. Handle event in `packages/frontend/src/stores/harness.store.ts`

### Adding an API route
1. Create `packages/backend/src/routes/<name>.route.ts`
2. Register in `packages/backend/src/routes/index.ts`
3. Add typed fetch wrapper to `packages/frontend/src/api/client.ts`

### Adding a frontend view
1. Create `packages/frontend/src/components/<name>/<Name>View.tsx`
2. Add to `ActiveView` union in `packages/frontend/src/stores/ui.store.ts`
3. Add nav entry in `packages/frontend/src/components/layout/Sidebar.tsx`
4. Import and render in `packages/frontend/src/App.tsx`

---

## Hard Rules (enforce on all subagents)

- Never mark a task `completed` before `pnpm typecheck` passes
- Never implement more than one feature per session
- Never use `// @ts-ignore` or `as unknown as X` casts
- Never use Tailwind color utilities — only `var(--color-*)` custom properties
- Use `.js` extensions in all backend imports (NodeNext module resolution)
- Shared package imports always use `@h-orchestra/shared`, never relative paths
