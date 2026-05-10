---
name: add-backend-route
description: Add a new REST API route to the Fastify backend with a matching typed frontend API client method
trigger: add a route for
version: 1.0.0
author: H-Orchestra
tags:
  - backend
  - fastify
  - typescript
  - api
---

## Context

Routes live in `packages/backend/src/routes/`. Each route file exports a default `async function` that accepts `FastifyInstance`. All routes are registered in `routes/index.ts`. The `FastifyInstance` has two custom decorations available: `fastify.config` (the `Config` object) and `fastify.broadcastSSE(event)` (sends an SSE event to all connected clients).

## Steps

1. **Create the route file** at `packages/backend/src/routes/<name>.route.ts`
   ```typescript
   import type { FastifyInstance } from 'fastify';
   
   export default async function <name>Route(fastify: FastifyInstance) {
     fastify.get('/api/<name>', async (_req, reply) => {
       // access fastify.config.MOUNT_PATH, fastify.broadcastSSE(...)
       return reply.send({ ... });
     });
   }
   ```
   - Use `fastify.config.MOUNT_PATH` to read from the mounted repository
   - For mutations that change `feature_list.json`, use the atomic write pattern:
     write to `.tmp` file first, then `fs.rename(tmp, target)` to avoid partial reads
   - Broadcast an SSE event after mutations so the frontend updates without polling

2. **Register the route** in `packages/backend/src/routes/index.ts`
   - Add `import <name>Route from './<name>.route.js';`
   - Add `await fastify.register(<name>Route);`

3. **Add type-safe request/response shapes** in `packages/shared/src/types/` if needed
   - Export from `packages/shared/src/index.ts`

4. **Add the frontend API client method** in `packages/frontend/src/api/client.ts`
   ```typescript
   <name>: {
     get: () => apiFetch<ResponseType>('/<name>'),
     create: (body: RequestType) => apiFetch<ResponseType>('/<name>', { method: 'POST', body: JSON.stringify(body) }),
   },
   ```

5. **Run typecheck**: `pnpm typecheck` — both backend and frontend must pass

6. **Test the endpoint**: `curl -s http://localhost:3001/api/<name> | python3 -m json.tool`
