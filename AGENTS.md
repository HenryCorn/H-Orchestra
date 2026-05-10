# H-Orchestra — Agent Navigation Map

## Before Starting Any Session

1. Run `bash init.sh` — it must exit 0
2. Read `progress/current.md` — understand what was in progress last session
3. Read `feature_list.json` — identify the first `pending` task (lowest id)
4. Execute **one task only** per session

## Repository Map

| File / Dir | Read when |
|---|---|
| `AGENTS.md` | Start of every session (this file) |
| `CLAUDE.md` | First session, or if unsure about your role |
| `.claude/agents/leader.md` | You are orchestrating the session |
| `.claude/agents/implementer.md` | You are writing code |
| `.claude/agents/reviewer.md` | You are reviewing code |
| `feature_list.json` | Selecting a task, updating status |
| `progress/current.md` | Resuming work, checking session state |
| `progress/history.md` | Understanding past decisions |
| `CHECKPOINTS.md` | Verifying a feature before marking done |
| `docs/architecture.md` | Designing or reviewing changes |
| `docs/conventions.md` | Writing TypeScript code |
| `docs/verification.md` | Verifying a completed feature |

## Task Selection Protocol

1. Open `feature_list.json`
2. Filter to `status: "pending"`
3. Select the item with the lowest priority number
4. Set its status to `"in_progress"`
5. Document your plan in `progress/current.md`

## Hard Rules

- **One feature per session** — no exceptions
- **Never mark a task `completed`** without `pnpm typecheck` and `pnpm build` passing
- **Never mark a task `completed`** without `bash init.sh` exiting 0
- **Never use `// @ts-ignore`** or `as unknown as X` casts
- **Never use Tailwind color utilities** — always `var(--color-*)` CSS custom properties
- **Leave `progress/current.md` clean** at session end — move completed work to `progress/history.md`

## Session Closure

1. Run `bash init.sh` — must exit 0
2. If task complete: set status to `"completed"` in `feature_list.json`
3. Move session notes from `progress/current.md` → append to `progress/history.md`
4. Empty `progress/current.md`
5. Commit: `git commit -m "feat: <task label>"`

## If Blocked

- Set task status to `"blocked"` in `feature_list.json`
- Document the blocker in `progress/current.md`
- End the session cleanly
