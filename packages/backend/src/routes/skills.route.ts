import type { FastifyInstance } from 'fastify';
import { parseSkillsDirectory } from '../parsers/skill.parser.js';

export default async function skillsRoute(fastify: FastifyInstance) {
  fastify.get('/api/skills', async (_req, reply) => {
    const skills = await parseSkillsDirectory(fastify.config.MOUNT_PATH);
    return reply.send(skills);
  });
}
