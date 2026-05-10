import type { FastifyInstance } from 'fastify';
import { createTracingAdapter } from '../tracing/index.js';

export default async function tracingRoute(fastify: FastifyInstance) {
  fastify.get('/api/tracing/traces', async (_req, reply) => {
    const adapter = createTracingAdapter(fastify.config);
    if (!adapter) return reply.send({ traces: [], total: 0, provider: 'none' });
    const result = await adapter.listTraces();
    return reply.send(result);
  });

  fastify.get<{ Params: { id: string } }>(
    '/api/tracing/traces/:id',
    async (req, reply) => {
      const adapter = createTracingAdapter(fastify.config);
      if (!adapter) return reply.code(404).send({ error: 'No tracing provider configured' });
      const trace = await adapter.getTrace(req.params.id);
      return reply.send(trace);
    }
  );
}
