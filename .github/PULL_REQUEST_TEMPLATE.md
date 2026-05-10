<!-- Title format: <type>(<id>): <short summary> -->
<!-- Examples: feat(backend-parser-01): feature_list.json parser  •  fix(frontend-view-02): drag-reorder rollback on 4xx -->

## Feature

Closes feature: `<id>` (e.g. `backend-parser-01`)

## Summary

<2-4 sentences. What changed and why.>

## Acceptance criteria

<Copy from feature_list.json. Tick each:>

- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## Verification

- [ ] `pnpm typecheck` exits 0 locally
- [ ] `pnpm -r build` exits 0 locally
- [ ] `pnpm test` exits 0 locally with at least one new test exercising this feature
- [ ] `./init.sh` exits 0 locally
- [ ] No mocked fs / Fastify / SSE in new tests (see `docs/verification.md`)
- [ ] No Tailwind color utilities in new components; tokens.css only
- [ ] Cross-package imports through `@h-orchestra/shared`

## Reports on disk

- [ ] `progress/impl_<id>.md` written
- [ ] `progress/review_<id>.md` written and verdict is `APPROVED`
- [ ] `progress/history.md` updated with a one-paragraph entry

## Screenshots (UI only)

<Drop screenshots here, or write `n/a`.>

## Notes for reviewer

<Anything reviewer should pay extra attention to.>
