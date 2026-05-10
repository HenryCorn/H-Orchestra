# CHECKPOINTS.md — Five Quality Gates

Every feature passes through these five gates before being marked `done`. The reviewer evaluates each box in `progress/review_<id>.md`.

## C1 — Harness completeness

The structural files exist and parse:

- [ ] `CLAUDE.md`, `AGENTS.md`, `CHECKPOINTS.md` present
- [ ] `feature_list.json` valid JSON; every status is one of `pending | in_progress | done | blocked`
- [ ] `progress/current.md` and `progress/history.md` present
- [ ] `docs/architecture.md`, `docs/conventions.md`, `docs/verification.md` present
- [ ] `.claude/agents/leader.md`, `implementer.md`, `reviewer.md` present
- [ ] `init.sh` present and executable

## C2 — State coherence

The feature_list and progress files agree on reality:

- [ ] At most one feature has `status: "in_progress"`
- [ ] Every `progress/impl_<id>.md` matches a feature id in `feature_list.json`
- [ ] Every `progress/review_<id>.md` matches a feature id
- [ ] `progress/current.md` `Active feature` field matches the actual `in_progress` feature (or `none`)
- [ ] No orphan reports (impl/review for a feature that doesn't exist)

## C3 — Architecture compliance

The implementation respects the standards:

- [ ] Follows `docs/architecture.md` (correct package, correct layer)
- [ ] Follows `docs/conventions.md` (TS strict, NodeNext `.js` suffixes, kebab-case files, tokens.css for colors)
- [ ] Leader did not edit `packages/**` source or tests
- [ ] Cross-package imports go through `@h-orchestra/shared`
- [ ] No `any`, `as unknown as`, `// @ts-ignore` without a code comment justifying it

## C4 — Real verification

Tests are real and the build is clean:

- [ ] `./init.sh` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm -r build` exits 0
- [ ] `pnpm test` exits 0 with at least one test that exercises the feature
- [ ] No mocked file system, mocked Fastify, or mocked SSE in new tests
- [ ] Frontend tests assert against rendered DOM, not snapshot strings
- [ ] Mermaid output validated by parsing, not by string match

## C5 — Clean closure

The session is closeable:

- [ ] `progress/review_<id>.md` exists and verdict is `APPROVED`
- [ ] `progress/history.md` has an entry for this feature
- [ ] `progress/current.md` has been cleared (active feature: none) **after** the leader marks done
- [ ] `feature_list.json` shows the feature `done`
- [ ] No untracked files outside `progress/` and `node_modules/`
