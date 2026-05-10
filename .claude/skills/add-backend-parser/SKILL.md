---
name: add-backend-parser
description: Add a new file parser that watches a new harness file type and broadcasts SSE events when it changes
trigger: add a parser for
version: 1.0.0
author: H-Orchestra
tags:
  - backend
  - parser
  - sse
  - typescript
---

## Context

The parser pipeline: Chokidar detects a file change → `ParserRegistry.findParser(filePath)` matches by glob → `parser.parse(filePath, content)` returns a typed payload → the watcher emits `parser.eventType` → `server.ts` catches it → `fastify.broadcastSSE(event)` → connected browser clients receive the SSE event → `harness.store.ts` `dispatch()` updates Zustand state.

## Steps

1. **Define the SSE event shape** in `packages/shared/src/types/events.ts`
   - Add a new interface (e.g., `interface MyFileUpdatedEvent { type: 'myfile:updated'; payload: MyType }`)
   - Add it to the `SSEEvent` union
   - Add a type guard: `export function isMyFileEvent(e: SSEEvent): e is MyFileUpdatedEvent { return e.type === 'myfile:updated'; }`
   - Export the new type from `packages/shared/src/index.ts`

2. **Add the glob pattern** to `packages/shared/src/constants/file-patterns.ts`
   - Add a new key to `HARNESS_PATTERNS`

3. **Create the parser** at `packages/backend/src/parsers/<name>.parser.ts`
   - Export a pure function: `export function parse<Name>(filePath: string, content: string): MyType`
   - Use `js-yaml` for YAML front-matter, `JSON.parse` for JSON, plain string processing for text files
   - Wrap in try/catch — return a safe fallback rather than throwing

4. **Register the parser** in `packages/backend/src/parsers/index.ts`
   - Add to `createDefaultRegistry()`:
     ```typescript
     registry.register({
       glob: HARNESS_PATTERNS.myFile,
       eventType: 'myfile:updated',
       parse: parseMyFile,
     });
     ```
   - If the file should be included in the initial snapshot, add a glob query to `buildHarnessSnapshot()`

5. **Handle the event in the frontend store** (`packages/frontend/src/stores/harness.store.ts`)
   - Add a field to `HarnessState`
   - Add a `case 'myfile:updated':` branch in the `dispatch()` immer setter

6. **Run typecheck**: `pnpm typecheck` — all three packages must pass before continuing

7. **Manual smoke test**: Start the backend with `MOUNT_PATH=/tmp/test-harness pnpm --filter @h-orchestra/backend dev`, edit the watched file, confirm the SSE event appears in `curl -N http://localhost:3001/api/events`
