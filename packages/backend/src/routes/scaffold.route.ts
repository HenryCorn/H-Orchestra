import type { FastifyInstance } from 'fastify';
import type { ScaffoldRequest } from '@h-orchestra/shared';
import { scaffoldTemplate } from '../templates/engine.js';

export default async function scaffoldRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: ScaffoldRequest }>('/api/scaffold', async (req, reply) => {
    const result = await scaffoldTemplate(req.body);
    if (!result.success) {
      return reply.code(422).send(result);
    }
    return reply.code(201).send(result);
  });
}
