import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { formatSSEMessage } from '../plugins/sse.js';
import type { ConnectionEvent } from '@h-orchestra/shared';

export default async function sseRoute(fastify: FastifyInstance) {
  fastify.get('/api/events', async (req, reply) => {
    const clientId = randomUUID();

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.flushHeaders();

    fastify.sseClients.set(clientId, reply.raw);

    const established: ConnectionEvent = {
      type: 'connection:established',
      payload: { clientId, timestamp: new Date().toISOString() },
    };
    reply.raw.write(formatSSEMessage(established));

    // Push current snapshot so clients don't need a separate REST call
    if (fastify.currentSnapshot) {
      reply.raw.write(formatSSEMessage({ type: 'harness:snapshot', payload: fastify.currentSnapshot }));
    }

    const heartbeatInterval = setInterval(() => {
      const heartbeat: ConnectionEvent = {
        type: 'connection:heartbeat',
        payload: { clientId, timestamp: new Date().toISOString() },
      };
      try {
        reply.raw.write(formatSSEMessage(heartbeat));
      } catch {
        clearInterval(heartbeatInterval);
      }
    }, 15_000);

    req.raw.on('close', () => {
      fastify.sseClients.delete(clientId);
      clearInterval(heartbeatInterval);
    });

    // Hold connection open indefinitely
    return new Promise<void>(() => {});
  });
}
