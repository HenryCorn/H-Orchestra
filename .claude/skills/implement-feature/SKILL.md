---
name: implement-feature
description: Drive one pending feature from feature_list.json to APPROVED. The leader's main loop. Read state, pick a feature, dispatch implementer, dispatch reviewer, mark done on APPROVED.
---

# implement-feature

This is the leader's primary skill. It drives one feature through the full lifecycle: pending → in_progress → impl → review → done.

## When to use

- A user has asked you to "implement the next feature" or "keep going on the backlog"
- `init.sh` is green
- There is at least one feature with `status: "pending"`
- There is no feature currently `in_progress` (init.sh enforces this)

## Steps

1. **Read state.** `feature_list.json`, `progress/current.md`, `tail -n 60 progress/history.md`.

2. **Pick a feature.** First `pending` in id order, unless the user named a specific id.

3. **Mark in_progress.** Edit `feature_list.json` to set the chosen feature's `status: "in_progress"`. Run `./init.sh` to confirm only one is in_progress.

4. **Update current.md.** Active feature, plan (3-5 bullets), `Subagent in flight: implementer`.

5. **Dispatch implementer.** Use the `Agent` tool with `subagent_type: "implementer"`. Hand them:
   - feature id
   - acceptance criteria (copy verbatim from feature_list.json)
   - links to `docs/architecture.md`, `docs/conventions.md`, `docs/verification.md`
   - the relevant secondary skill (e.g. `add-backend-parser` for parser features)

6. **Wait for one-line return.** Either:
   - `IMPL READY: <id> see progress/impl_<id>.md` → step 7
   - `BLOCKED: <id> see progress/current.md` → step 11

7. **Read the impl report from disk.** Confirm it exists and is complete.

8. **Dispatch reviewer.** Same `Agent` tool, `subagent_type: "reviewer"`. Hand them:
   - feature id
   - link to `progress/impl_<id>.md`
   - links to `CHECKPOINTS.md`, `docs/conventions.md`, `docs/verification.md`

9. **Wait for one-line return.** Either:
   - `APPROVED: <id>` → step 10
   - `CHANGES_REQUESTED: <id>` → re-dispatch implementer with the review attached, return to step 6

10. **Mark done.** Edit `feature_list.json` to `status: "done"`. Append a one-paragraph entry to `progress/history.md`. Reset `progress/current.md` to bootstrap template. Run `./init.sh`.

11. **Blocked.** Set `status: "blocked"` in feature_list.json. Document in `progress/current.md` under `## Blocker`. Append a `BLOCKED: <id>` line to `progress/history.md`. Stop and surface to the user.

## Anti-patterns

- Do not dispatch implementer for two features in parallel.
- Do not skip the reviewer step.
- Do not edit `progress/impl_<id>.md` or `progress/review_<id>.md` yourself; those belong to the subagents.
- Do not re-dispatch a subagent without first reading their prior report.
