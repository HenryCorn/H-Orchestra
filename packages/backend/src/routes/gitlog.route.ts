import type { FastifyInstance } from 'fastify';
import { simpleGit } from 'simple-git';
import type { GitLogResponse } from '@h-orchestra/shared';

export default async function gitlogRoute(fastify: FastifyInstance) {
  fastify.get<{ Querystring: { limit?: string } }>('/api/gitlog', async (req, reply) => {
    const limit = Math.min(parseInt(req.query.limit ?? '20', 10) || 20, 100);
    const git = simpleGit(fastify.config.MOUNT_PATH);

    const isRepo = await git.checkIsRepo().catch(() => false);
    if (!isRepo) {
      const result: GitLogResponse = { commits: [], isGitRepo: false };
      return reply.send(result);
    }

    const log = await git.log({ maxCount: limit }).catch(() => null);
    const result: GitLogResponse = {
      isGitRepo: true,
      commits: (log?.all ?? []).map((c) => ({
        hash: c.hash,
        shortHash: c.hash.slice(0, 7),
        message: c.message,
        author: c.author_name,
        date: c.date,
      })),
    };
    return reply.send(result);
  });
}
