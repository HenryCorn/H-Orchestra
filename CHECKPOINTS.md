# H-Orchestra — Checkpoints

Objective quality gates. A feature is only `completed` when all relevant checkpoints pass.

## C1 — Harness Complete

- [ ] `AGENTS.md` exists at repo root
- [ ] `CLAUDE.md` exists at repo root
- [ ] `CHECKPOINTS.md` exists (this file)
- [ ] `init.sh` exists and is executable
- [ ] `progress/current.md` exists
- [ ] `progress/history.md` exists
- [ ] `docs/architecture.md` exists
- [ ] `docs/conventions.md` exists
- [ ] `docs/verification.md` exists
- [ ] `.claude/agents/leader.md` exists
- [ ] `.claude/agents/implementer.md` exists
- [ ] `.claude/agents/reviewer.md` exists

Verify: `bash init.sh` exits 0

## C2 — State Coherent

- [ ] At most 1 task has `status: "in_progress"` in `feature_list.json`
- [ ] `progress/current.md` describes the in-progress task (or says "No active session")
- [ ] No task is `completed` unless `pnpm typecheck` and `pnpm build` passed for it

## C3 — Code Health

- [ ] `pnpm typecheck` — zero errors across all 3 packages
- [ ] `pnpm build` — completes without errors
- [ ] No `// @ts-ignore` comments in source
- [ ] No Tailwind color utilities (`text-white`, `bg-gray-*`, etc.) in `.tsx` files
- [ ] All CSS colors use `var(--color-*)` custom properties
- [ ] Backend `.ts` imports use `.js` extension (NodeNext resolution)
- [ ] Cross-package imports use `@h-orchestra/shared`, never relative paths

## C4 — Tests Pass

- [ ] `pnpm --filter @h-orchestra/backend test` — all tests pass, 0 failures
- [ ] New parsers have corresponding unit tests in `__tests__/`
- [ ] New template functions have unit tests

## C5 — Session Closure

- [ ] `progress/current.md` is empty or contains "No active session"
- [ ] Completed work is appended to `progress/history.md`
- [ ] `feature_list.json` accurately reflects all task statuses
- [ ] `bash init.sh` exits 0 after all changes
- [ ] Changes are committed: `git commit -m "feat: <task label>"`
