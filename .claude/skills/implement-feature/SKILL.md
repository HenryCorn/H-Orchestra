---
name: implement-feature
description: Implement the next pending feature from feature_list.json in the H-Orchestra codebase
trigger: implement the next feature
version: 1.0.0
author: H-Orchestra
tags:
  - workflow
  - typescript
  - tdd
---

## Steps

1. **Orient**: Read `claude-progress.txt` → Read `feature_list.json` → identify first `pending` task

2. **Understand scope**: Determine which package(s) are involved
   - `backend-*` tasks → `packages/backend/src/`
   - `frontend-*` tasks → `packages/frontend/src/`
   - `testing-*` tasks → add `.test.ts` files alongside the module being tested
   - `infra-*` tasks → root-level config files

3. **Read existing code** before writing any new code
   - For backend tasks: read the relevant route/parser/plugin files
   - For frontend tasks: read the relevant view, store, and hook files
   - For parser tasks: follow the `add-backend-parser` skill
   - For route tasks: follow the `add-backend-route` skill
   - For view tasks: follow the `add-frontend-view` skill

4. **Implement** — one file at a time, smallest change first

5. **Verify**:
   ```bash
   pnpm typecheck          # must pass with zero errors
   pnpm build              # must complete without errors
   ```
   For testing tasks: `pnpm --filter @h-orchestra/backend test`

6. **Update feature_list.json**: Set the task `status` to `completed`

7. **Append to claude-progress.txt**:
   ```
   [YYYY-MM-DD HH:MM:SS] [AGENT] Completed <task-id>: <one-line summary of what was done>
   ```

8. **Commit**:
   ```bash
   git add -p                          # stage only relevant files
   git commit -m "feat: <task label>"
   ```

## Quick Reference — Key Files

| What | Where |
|---|---|
| SSE event types | `packages/shared/src/types/events.ts` |
| Harness snapshot builder | `packages/backend/src/parsers/index.ts` |
| File watch patterns | `packages/shared/src/constants/file-patterns.ts` |
| Zustand harness store | `packages/frontend/src/stores/harness.store.ts` |
| Nothing Design tokens | `packages/frontend/src/styles/tokens.css` |
| CSS component classes | `packages/frontend/src/styles/components.css` |
| Frontend API client | `packages/frontend/src/api/client.ts` |
| Route registration | `packages/backend/src/routes/index.ts` |
| Fastify instance type | `packages/backend/src/server.ts` (module augmentation) |
