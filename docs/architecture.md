# Architecture

## High level

H-Orchestra is a single-container web app that mounts a target repo, parses its harness artifacts, and exposes them via a Nothing Design UI.

```
┌─────────── Docker container (port 3001) ──────────┐
│                                                   │
│   ┌─────── @h-orchestra/backend (Fastify) ────┐   │
│   │  Chokidar watcher                         │   │
│   │     ↓ (debounce 150ms)                    │   │
│   │  ParserRegistry → parsed snapshots        │   │
│   │     ↓                                     │   │
│   │  REST routes (/api/*)                     │   │
│   │  SSE stream (/events)                     │   │
│   │  Static SPA serve (/, /assets/*)          │   │
│   └────────────┬─────────────┬────────────────┘   │
│                │             │                    │
│                │             │ static assets      │
│                ▼             ▼                    │
│   ┌─────── @h-orchestra/frontend (React) ────┐    │
│   │  EventSource → Zustand store              │   │
│   │  Views: Dashboard, Tasks, Agents, Skills, │   │
│   │         Diagram, Scaffold, Tracing        │   │
│   └───────────────────────────────────────────┘   │
│                                                   │
│   Mount: /mounted-repo (ro, set via REPO_PATH)    │
└───────────────────────────────────────────────────┘
```

## Packages

- `packages/shared` — TypeScript types, constants, error enums. Zero runtime deps. Built first; consumed by both backend and frontend.
- `packages/backend` — Fastify 5 server, Chokidar watcher, gray-matter for frontmatter, parsers + routes. Serves the built frontend as static files in production.
- `packages/frontend` — React 19 + Vite 6 + Zustand+immer + Mermaid 11. Tailwind 4 for layout utilities only; all colors/typography come from `tokens.css` CSS variables.

Cross-package imports always go through `@h-orchestra/shared`. Backend never imports from frontend; frontend never imports from backend.

## Module resolution

- TypeScript NodeNext throughout. Relative imports use the `.js` suffix even from `.ts` source (e.g. `import { foo } from './foo.js'`). This is a NodeNext requirement, not optional.
- Workspace deps via `workspace:*` in `package.json`.
- Path aliases are forbidden — they break tsc and Node's resolver alignment.

## Event flow

```
file change in /mounted-repo
   ↓ Chokidar
   ↓ 150ms debounce per path
HarnessChanged event on backend bus
   ↓ ParserRegistry re-parses affected files
   ↓ buildHarnessSnapshot composes new HarnessState
   ↓ SSE broadcaster emits typed event
   ↓ EventSource on frontend
   ↓ Zustand store dispatches (immer-immutable update)
React components re-render
```

## SSE event contract

Defined in `packages/shared/src/types/events.ts` as a discriminated union keyed on `event` name. Payload constants in `packages/shared/src/constants/sse-events.ts`. Adding a new event type requires updating both files plus a parser/route that emits it and a store branch that handles it.

## Tracing adapter pattern

Tracing is optional. Two adapters: Langfuse (self-hosted, `LANGFUSE_BASE_URL` + `LANGFUSE_SECRET_KEY`) and Helicone (`HELICONE_API_KEY`). Selection happens at boot from env. If no adapter is configured, `/api/tracing` returns `[]` — never an error. The adapter contract is one method: `getRecentTraces(limit: number): Promise<TraceSummary[]>`.

LangSmith is intentionally out of scope.

## Templates

Built-in templates (Python, .NET) live in `packages/backend/templates/<id>/` as a directory of files with `{{placeholder}}` syntax. User-uploaded ZIPs are extracted into `${TEMPLATES_DIR:-/data/templates}/<id>/` on receipt and scanned on boot.

Scaffold validates required placeholders before writing any file (atomic — all or nothing). Refuses to overwrite a non-empty target.

## Cross-platform watcher

Chokidar's native FSEvents work on macOS and inotify on Linux. Docker bind mounts on macOS and Windows do not propagate native events reliably, so the container sets `CHOKIDAR_USEPOLLING=true` by default. The polling interval is 1000ms — slow enough to keep CPU low, fast enough that the UI feels live.

## Storage

There is no database. All state is on disk in the mounted repo. The backend has a small writeable data dir (`/data`) only for uploaded templates.

## Production serving

In production the backend serves the built frontend bundle from `packages/backend/public/` (copied during multi-stage Docker build). One port, one process, no nginx layer. The Vite dev server is a development-only convenience that proxies API calls to the backend.

## Build pipeline

```
pnpm install --frozen-lockfile
   → pnpm --filter @h-orchestra/shared build      (tsc -b)
   → pnpm --filter @h-orchestra/backend build     (tsc -b)
   → pnpm --filter @h-orchestra/frontend build    (tsc -b && vite build)
```

The Dockerfile runs all three in stage 1, then stage 2 copies `packages/backend/dist` plus `node_modules` plus the frontend `dist` into the runtime image.
