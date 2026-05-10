import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { ServerResponse } from 'node:http';
import type { SSEEvent, HarnessSnapshot } from '@h-orchestra/shared';

declare module 'fastify' {
  interface FastifyInstance {
    sseClients: Map<string, ServerResponse>;
    broadcastSSE: (event: SSEEvent) => void;
    currentSnapshot: HarnessSnapshot | null;
  }
}

export function formatSSEMessage(event: SSEEvent): string {
  const id = `${Date.now()}-${event.type.replace(/:/g, '-')}`;
  return `event: ${event.type}\nid: ${id}\ndata: ${JSON.stringify(event)}\n\n`;
}

export default fp(async function ssePlugin(fastify: FastifyInstance) {
  const clients = new Map<string, ServerResponse>();

  fastify.decorate('sseClients', clients);
  fastify.decorate('currentSnapshot', null);

  fastify.decorate('broadcastSSE', (event: SSEEvent) => {
    const message = formatSSEMessage(event);
    for (const [, res] of clients) {
      try {
        res.write(message);
      } catch {
        // client disconnected; will be cleaned up on close event
      }
    }
  });
});
