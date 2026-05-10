# H-Orchestra — Architecture

## Monorepo Structure

```
H-Orchestra/
├── packages/
│   ├── shared/      TypeScript types + constants only (no runtime code)
│   ├── backend/     Fastify 5 + Chokidar + SSE + REST API
│   └── frontend/    React 19 + Vite 6 + Tailwind CSS 4 + Zustand
```

Dependency order: `shared` → `backend` and `shared` → `frontend`. The backend and frontend never import from each other. Always update shared types first.

## SSE Pipeline

```
Chokidar detects file change
  → HarnessWatcher.handleChange()
  → ParserRegistry.findParser(filePath)
  → parser.parse(filePath, content)   → typed payload
  → watcher.emit(eventType, payload)
  → server.ts listener
  → fastify.broadcastSSE(event)
  → all connected EventSource clients
  → harness.store.ts dispatch()
  → Zustand state update
  → React re-render
```

## Parser Registry Pattern

`packages/backend/src/parsers/index.ts` maintains a list of `{ glob, eventType, parse }` objects. `findParser(filePath)` matches by substring — a file path containing `"feature_list.json"` matches the `**/feature_list.json` glob.

Adding a new file type: create a parser, register it in `createDefaultRegistry()`, add the event type to `SSEEvent` in shared, handle it in `harness.store.ts`.

## Harness File Auto-Discovery

On startup, `buildHarnessSnapshot(mountPath)` runs parallel `fast-glob` queries for all known harness patterns and reads the results. The snapshot is stored in `fastify.currentSnapshot` and pushed to new SSE clients immediately on connection — no REST poll needed.

## Supported Harness Files

| File pattern | Purpose |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | System prompt / navigation map |
| `feature_list.json` | Task list with status tracking |
| `progress/current.md` | Live session state |
| `progress/history.md` | Completed session archive |
| `CHECKPOINTS.md` | Quality gate definitions |
| `init.sh` | Bootstrap + verification script |
| `.claude/agents/*.md` | Agent role definitions (leader, implementer, reviewer) |
| `.claude/skills/*/SKILL.md` | Claude Code skill definitions (legacy) |

## Frontend State

Zustand store (`harness.store.ts`) is the single source of truth. It is seeded from the initial `harness:snapshot` SSE event and patched by subsequent events. Components read from the store via selectors — never from REST directly, except for data outside the SSE stream (tracing, git log).

## Nothing Design System

Colors: only `var(--color-*)` custom properties. Never Tailwind color utilities.
Typography: `var(--font-body)` for prose, `var(--font-mono)` for labels/code, `var(--font-display)` for large metrics.
Layout: Tailwind layout utilities only (`flex`, `grid`, `w-full`, `gap-*`, `overflow-hidden`).
No shadows, border-radius, gradients, or blur.
Red (`var(--color-critical)`) reserved for errors and destructive actions only.

## Atomic File Writes

Any route that mutates `feature_list.json` must use write-to-temp-then-rename:
```typescript
const tmp = targetPath + '.tmp';
await writeFile(tmp, content, 'utf-8');
await rename(tmp, targetPath);
```
This prevents the file watcher from reading a partial write.

## Production vs Development

Development: Vite dev server on port 5173 proxies `/api` to Fastify on port 3001.
Production: Fastify serves `packages/frontend/dist/` via `@fastify/static` with SPA fallback. Single port (3001).
