import type { FastifyInstance } from 'fastify';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { loadTemplateFromZip } from '../templates/loader.js';

export default async function importTemplateRoute(fastify: FastifyInstance) {
  fastify.addContentTypeParser(
    'application/zip',
    { parseAs: 'buffer' },
    (_req, body, done) => done(null, body),
  );

  fastify.post('/api/templates/import', async (req, reply) => {
    const buf = req.body as Buffer;
    if (!buf || buf.length === 0) {
      return reply.code(400).send({ error: 'Empty body' });
    }

    const tmpPath = join(tmpdir(), `h-orchestra-template-${randomUUID()}.zip`);
    try {
      await writeFile(tmpPath, buf);
      const template = await loadTemplateFromZip(tmpPath);
      return reply.code(201).send(template);
    } finally {
      await unlink(tmpPath).catch(() => {});
    }
  });
}
