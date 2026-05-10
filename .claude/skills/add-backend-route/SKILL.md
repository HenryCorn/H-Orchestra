---
name: add-backend-route
description: Add a new HTTP route to packages/backend/src/routes/. Use when exposing parsed harness data, accepting mutations, or proxying to a tracing adapter.
---

# add-backend-route

Recipe for adding a Fastify route.

## Where things live

```
packages/backend/src/routes/
  index.ts                        ← registerRoutes(app)
  <name>.route.ts                 ← new route plugin
  __tests__/
    <name>.route.test.ts          ← real Fastify instance
```

## Contract

Each route file exports a default async Fastify plugin:

```ts
import type { FastifyPluginAsync } from 'fastify';

const <name>Route: FastifyPluginAsync = async (app) => {
  app.get('/api/<path>', { schema: { /* JSONSchema */ } }, async (req, reply) => {
    // ...
  });
};
export default <name>Route;
```

Mutating routes (POST/PATCH/DELETE) write atomically (`<file>.tmp` + rename) and broadcast an SSE event after the write.

## Steps

1. **Add request/response types** to `packages/shared/src/types/` if reusable, or local types if route-specific.
2. **Define a Fastify schema** in the route file. Use Fastify's TypeBox or a plain JSONSchema. This validates input and shapes the response.
3. **Implement the handler.** For mutations, use the atomic-write helper from `packages/backend/src/util/atomic-write.ts`.
4. **Emit SSE on mutation.** Call the SSE broadcaster (decorated on the Fastify instance as `app.broadcastSSE(event)`). The event must match the contract in `packages/shared/src/types/events.ts`.
5. **Register in `routes/index.ts`.**
6. **Add API client method** in `packages/frontend/src/api/client.ts` (in the matching frontend feature).
7. **Write tests** with a real Fastify instance (`fastify()`, `await app.ready()`) and a tmp dir for any file-touching test.
8. **Run `pnpm --filter @h-orchestra/backend test`**.
9. **Run `./init.sh`**.

## Test pattern

```ts
import { test, expect, beforeEach, afterEach } from 'vitest';
import fastify from 'fastify';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import route from '../<name>.route.js';

let tmp: string;
let app: ReturnType<typeof fastify>;

beforeEach(async () => {
  tmp = await mkdtemp(join(tmpdir(), 'horch-'));
  app = fastify();
  app.decorate('config', { mountPath: tmp });
  await app.register(route);
  await app.ready();
});

afterEach(async () => {
  await app.close();
  await rm(tmp, { recursive: true, force: true });
});

test('returns 200 with expected shape', async () => {
  const res = await app.inject({ method: 'GET', url: '/api/<path>' });
  expect(res.statusCode).toBe(200);
  expect(res.json()).toMatchObject({
    /* ... */
  });
});
```

## Anti-patterns

- Mocking Fastify, `fastify.inject`, or `node:http`. Use a real instance.
- Skipping schema validation. Every route declares its schema.
- Non-atomic file writes — partial writes are visible to the watcher.
- Broadcasting SSE before the write completes.
