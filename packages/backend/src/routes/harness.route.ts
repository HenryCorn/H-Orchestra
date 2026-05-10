import type { FastifyInstance } from 'fastify';
import type { HarnessSnapshot } from '@h-orchestra/shared';
import { buildHarnessSnapshot } from '../parsers/index.js';

export default async function harnessRoute(fastify: FastifyInstance) {
  fastify.get<{ Reply: HarnessSnapshot }>(
    '/api/harness',
    async (req, reply) => {
      const snapshot = await buildHarnessSnapshot(fastify.config.MOUNT_PATH);
      return reply.send(snapshot);
    }
  );
}
