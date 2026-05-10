import type { FastifyInstance } from 'fastify';
import { getTemplateRegistry } from '../templates/registry.js';

export default async function templatesRoute(fastify: FastifyInstance) {
  fastify.get('/api/templates', async (_req, reply) => {
    const templates = getTemplateRegistry();
    return reply.send(templates);
  });
}
