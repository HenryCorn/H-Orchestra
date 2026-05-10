import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FastifyInstance } from 'fastify';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default fp(async function staticPlugin(fastify: FastifyInstance) {
  if (fastify.config.NODE_ENV !== 'production') return;

  // Resolve frontend dist relative to the backend dist output
  const frontendDist = join(__dirname, '..', '..', '..', 'frontend', 'dist');

  await fastify.register(fastifyStatic, {
    root: frontendDist,
    prefix: '/',
  });

  // SPA fallback: serve index.html for any non-API route
  fastify.setNotFoundHandler((req, reply) => {
    if (!req.url.startsWith('/api')) {
      return reply.sendFile('index.html');
    }
    return reply.code(404).send({ error: 'Not found' });
  });
});
