# H-Orchestra

A self-hosted, Docker-deployable web tool for visualizing and managing Claude Code sub-agent harnesses.

H-Orchestra mounts a target repo, auto-discovers harness artifacts (`CLAUDE.md`, `AGENTS.md`, `feature_list.json`, `.claude/agents/`, `.claude/skills/`, `progress/`, `docs/`), and surfaces them through a Nothing Design UI: task lists, agent definitions, sub-agent interaction diagrams, scaffolding from templates, and tracing integration.

This repository is itself a harness — it uses the leader / implementer / reviewer pattern from [Anthropic's effective harnesses post](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) to build itself.

## Status

Bootstrapped. The harness scaffolding, repo policies, and empty package skeletons are in place. Real implementation work is tracked in [`feature_list.json`](./feature_list.json) (52 pending features) and proceeds feature-by-feature via the leader/implementer/reviewer loop.

## Quick start (Docker)

```bash
REPO_PATH=/absolute/path/to/your/harness docker compose up
```

Then open http://localhost:3001.

The mount is read-only by default. Set `REPO_PATH` to any directory that contains a Claude Code harness (CLAUDE.md, AGENTS.md, etc.).

### Optional: tracing

Set any of the following before `docker compose up` to enable a tracing tab:

```bash
LANGFUSE_BASE_URL=https://langfuse.example.com
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_SECRET_KEY=...
HELICONE_API_KEY=...
```

## Local development

Requires Node 20.11+ and pnpm 9+.

```bash
pnpm install
pnpm dev
```

Backend on `http://localhost:3001`, Vite dev server on `http://localhost:5173`. Vite proxies `/api` and `/events` to the backend.

For end-to-end checks:

```bash
pnpm typecheck
pnpm -r build
pnpm test
./init.sh
```

## How it's built

This repo is a multi-package pnpm workspace:

```
packages/shared/    – TypeScript types and constants
packages/backend/   – Fastify 5 + Chokidar + SSE + parsers + routes
packages/frontend/  – React 19 + Vite 6 + Zustand + Mermaid (Nothing Design)
```

The development process uses three Claude Code subagents:

- **leader** — orchestrator; picks features, dispatches subagents, marks done
- **implementer** — writes one feature's code and tests; never marks done
- **reviewer** — verifies acceptance and conventions; APPROVED or CHANGES_REQUESTED

State lives on disk: `feature_list.json` is the backlog, `progress/current.md` is the live session, `progress/history.md` is the append-only log.

See [`AGENTS.md`](./AGENTS.md) for the navigation map and [`docs/architecture.md`](./docs/architecture.md) for the system overview.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — repo map, naming conventions, subagent protocols
- [`CHECKPOINTS.md`](./CHECKPOINTS.md) — the five quality gates (C1–C5)
- [`docs/architecture.md`](./docs/architecture.md) — packages, event flow, build pipeline
- [`docs/conventions.md`](./docs/conventions.md) — TypeScript, Nothing Design, file naming
- [`docs/verification.md`](./docs/verification.md) — anti-mock testing policy
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to contribute (human or agent)

## Inspiration

- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [`betta-tech/ejemplo-harness-subagentes`](https://github.com/betta-tech/ejemplo-harness-subagentes) — reference harness structure
- [`dominikmartn/nothing-design-skill`](https://github.com/dominikmartn/nothing-design-skill) — UI design system

## License

MIT — see [`LICENSE`](./LICENSE).
