# AGENTS.md — Navigation Map for H-Orchestra

This is the map. CLAUDE.md tells you what role you have. AGENTS.md tells you where everything lives so you can pull rules on demand.

## 1. Repo overview

```
H-Orchestra/
  CLAUDE.md              ← role definition (leader-only on auto-load)
  AGENTS.md              ← this file (navigation + protocols)
  CHECKPOINTS.md         ← five quality gates (C1–C5)
  feature_list.json      ← single source of truth for backlog
  init.sh                ← gatekeeper script (must exit 0)
  progress/
    current.md           ← live session state, OVERWRITTEN each session
    history.md           ← append-only chronological log
    impl_<id>.md         ← implementer report per feature
    review_<id>.md       ← reviewer verdict per feature
  docs/
    architecture.md      ← what we're building and how layers fit
    conventions.md       ← code style, naming, file rules
    verification.md      ← anti-mock testing policy
  .claude/
    agents/{leader,implementer,reviewer}.md   ← subagent contracts
    skills/<skill>/SKILL.md                    ← reusable workflows
    settings.json                              ← PostToolUse + Stop hooks
  packages/
    shared/              ← TS types and constants only
    backend/             ← Fastify + Chokidar + SSE
    frontend/            ← React 19 + Vite 6 + Zustand
  Dockerfile, docker-compose*.yml, entrypoint.sh
  .github/workflows/{ci,harness,docker,release}.yml
```

## 2. Where state lives

| What                | Where                     | Mutated by                             |
| ------------------- | ------------------------- | -------------------------------------- |
| Feature backlog     | `feature_list.json`       | leader (status changes)                |
| Live session        | `progress/current.md`     | leader                                 |
| Session log         | `progress/history.md`     | leader (append)                        |
| Implementer reports | `progress/impl_<id>.md`   | implementer (one per feature)          |
| Reviewer verdicts   | `progress/review_<id>.md` | reviewer (one per review pass)         |
| Code, tests, types  | `packages/<pkg>/src`      | implementer                            |
| Standards           | `docs/*.md`               | leader (rare; treat as constitutional) |

## 3. Naming conventions

- Feature IDs: kebab-case grouped by area, e.g. `infra-01`, `backend-parser-03`, `frontend-view-05`.
- Files: kebab-case (`feature-list.parser.ts`); React components PascalCase (`TasksView.tsx`).
- Tests: `<unit>.test.ts` colocated under `__tests__/`.
- Branches: `feature/<id>-<short-slug>`, e.g. `feature/backend-parser-01-feature-list`.
- Commits: imperative, scope by id, e.g. `feat(backend-parser-01): feature_list.json parser with Result<T,E> return`.
- Reports: `progress/impl_<id>.md` and `progress/review_<id>.md`. If a feature needs a second pass, append `_v2`, `_v3` to the review file (never overwrite a verdict).

## 4. How to find a feature to work on

1. Read `feature_list.json`.
2. Filter by `status: "pending"`.
3. Sort by id (the order encodes intended sequence).
4. Pick the first; do not skip ahead unless the user names a different one.
5. If that feature has cross-package implications, read the matching skill file in `.claude/skills/`.

## 5. How to write an implementer report

`progress/impl_<id>.md`:

```
# Impl <id> — <title>

## What I built
<2-4 sentences>

## Files touched
- packages/<pkg>/src/<path> — created | modified
- packages/<pkg>/src/__tests__/<path>.test.ts — created

## How I verified
- pnpm typecheck — green
- pnpm test — N tests, 0 failures
- ./init.sh — exit 0 (with logs at /tmp/harness_init.log)
- <any manual / curl / docker step>

## Open questions
<things the reviewer should look at, or flag "none">
```

Then return one line: `IMPL READY: <id> see progress/impl_<id>.md`.

## 6. How to write a reviewer verdict

`progress/review_<id>.md`:

```
# Review <id> — <title>

## Verdict
APPROVED  |  CHANGES_REQUESTED

## Acceptance criteria
- [x] <criterion 1>
- [ ] <criterion 2 — failing because …>

## Conventions check
<follows docs/conventions.md? cite line if not>

## Verification check
<C4: real tests, no mocks, init.sh green?>

## Required changes
<concrete diffs or "none">
```

Then return one line: `APPROVED: <id>` or `CHANGES_REQUESTED: <id>`.

## 7. Anti-phone-broken protocol

- Subagents write to disk; they do not summarise their work back through chat.
- The leader reads files from disk between subagent dispatches.
- Code, diffs, and large outputs never travel through the leader's context.
- One-line returns only.

## 8. Escalation table

| Symptom                                           | Action                                                       |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `init.sh` fails on `feature_list.json` parse      | Stop. Fix JSON. Surface to user.                             |
| Implementer returns `BLOCKED:`                    | Mark feature `blocked`, document in `current.md`, stop.      |
| Reviewer returns `CHANGES_REQUESTED:`             | Re-dispatch implementer; do not mark done.                   |
| Two features `in_progress` after a hand edit      | Stop. Resolve to one. Re-run `init.sh`.                      |
| Reviewer asks for a code edit you'd normally make | Don't. Re-dispatch the implementer with the review attached. |

## 9. When in doubt

- Want to know the _what_: `docs/architecture.md`.
- Want to know the _how_: `docs/conventions.md` + relevant `SKILL.md`.
- Want to know the _bar_: `docs/verification.md` + `CHECKPOINTS.md`.
