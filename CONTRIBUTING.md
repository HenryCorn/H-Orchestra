# Contributing to H-Orchestra

Two audiences read this file: humans contributing PRs, and AI agents acting as `leader` / `implementer` / `reviewer`. The rules below apply to both.

## Dev setup

Requirements:

- Node ≥ 20.11
- pnpm ≥ 9 (corepack will install the pinned version automatically when you cd into the repo)
- Docker (for compose-based runs)

```bash
git clone git@github.com:HenryCorn/H-Orchestra.git
cd H-Orchestra
pnpm install
pnpm dev      # backend on :3001, frontend dev on :5173
```

Sanity check:

```bash
pnpm typecheck
pnpm -r build
pnpm test
./init.sh
```

All four must exit 0 before you propose changes.

## The harness workflow

This repo is built feature-by-feature via the leader / implementer / reviewer loop.

### If you are an AI agent

You probably arrived here from `CLAUDE.md`. Re-read that file. Your role is `leader` unless explicitly dispatched as `implementer` or `reviewer`. The full protocol is in [`AGENTS.md`](./AGENTS.md).

### If you are a human

1. Pick a feature in [`feature_list.json`](./feature_list.json) with `status: "pending"`. Take the lowest id, unless a discussion has assigned a different one.
2. Set its status to `in_progress`.
3. Update `progress/current.md`: active feature, plan, your name as the worker.
4. Branch off `main`: `git checkout -b feature/<feature-id>-<short-slug>`.
5. Implement the feature **and** colocated tests. Follow [`docs/conventions.md`](./docs/conventions.md).
6. Verify: `pnpm typecheck && pnpm -r build && pnpm test && ./init.sh`.
7. Write `progress/impl_<id>.md` per the template in [`AGENTS.md`](./AGENTS.md) §5.
8. Push and open a PR. The PR template will guide you.
9. After review, set the feature status to `done` and append a one-paragraph entry to `progress/history.md`.

One feature per PR. Do not bundle.

## PR rules

- The PR title is `<type>(<id>): <short summary>` — e.g. `feat(backend-parser-01): feature_list.json parser with Result<T,E>`.
- The PR body uses `.github/PULL_REQUEST_TEMPLATE.md`. Fill every box.
- All three CI checks must be green (ci, harness, docker).
- The branch must rebase cleanly on `main`.
- Reviewers cite line numbers when requesting changes.

## Coding rules (the short version)

- TypeScript strict; NodeNext module resolution; `.js` suffix on relative imports.
- No `any`, `// @ts-ignore`, or `as unknown as X` without a comment.
- Cross-package imports through `@h-orchestra/shared`.
- Tailwind for layout utilities only; colors and typography from `tokens.css` variables.
- No mocked fs, mocked Fastify, or snapshot-only tests. See [`docs/verification.md`](./docs/verification.md).
- One feature `in_progress` at a time, enforced by `./init.sh`.

The full version is in [`docs/conventions.md`](./docs/conventions.md). The reviewer rejects PRs that violate these rules.

## Reporting bugs

Open an issue using the bug template at `.github/ISSUE_TEMPLATE/bug.yml`. Include:

- Steps to reproduce
- Expected vs actual
- Environment (Docker or local, OS, Node version)
- Logs from `/tmp/harness_init.log` if relevant

## Proposing features

Open an issue using the feature template. We discuss; if accepted, the feature is added to `feature_list.json` with acceptance criteria and a status of `pending`.

## Security

Do not file public issues for vulnerabilities. See [`SECURITY.md`](./SECURITY.md).
