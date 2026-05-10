import type { FastifyInstance } from 'fastify';
import type { TaskCreateRequest, TaskMutationRequest, TaskReorderRequest } from '@h-orchestra/shared';
import { readFeatureList, writeFeatureList } from '../parsers/feature-list.parser.js';
import { randomUUID } from 'node:crypto';

export default async function tasksRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: TaskCreateRequest }>('/api/tasks', async (req, reply) => {
    const fl = await readFeatureList(fastify.config.MOUNT_PATH);
    if (!fl) return reply.code(404).send({ error: 'No feature_list.json found' });

    const task = {
      id: randomUUID(),
      label: req.body.label,
      status: req.body.status,
      priority: req.body.priority,
      category: req.body.category,
      metadata: {},
    };
    fl.tasks.push(task);
    await writeFeatureList(fastify.config.MOUNT_PATH, fl);
    return reply.code(201).send(task);
  });

  fastify.patch<{ Body: TaskMutationRequest }>('/api/tasks/:id', async (req, reply) => {
    const fl = await readFeatureList(fastify.config.MOUNT_PATH);
    if (!fl) return reply.code(404).send({ error: 'No feature_list.json found' });

    const idx = fl.tasks.findIndex((t) => t.id === (req.params as { id: string }).id);
    if (idx === -1) return reply.code(404).send({ error: 'Task not found' });

    const existing = fl.tasks[idx];
    if (!existing) return reply.code(404).send({ error: 'Task not found' });

    fl.tasks[idx] = { ...existing, ...req.body };
    await writeFeatureList(fastify.config.MOUNT_PATH, fl);
    return reply.send(fl.tasks[idx]);
  });

  fastify.delete<{ Params: { id: string } }>('/api/tasks/:id', async (req, reply) => {
    const fl = await readFeatureList(fastify.config.MOUNT_PATH);
    if (!fl) return reply.code(404).send({ error: 'No feature_list.json found' });

    fl.tasks = fl.tasks.filter((t) => t.id !== req.params.id);
    await writeFeatureList(fastify.config.MOUNT_PATH, fl);
    return reply.code(204).send();
  });

  fastify.put<{ Body: TaskReorderRequest }>('/api/tasks/reorder', async (req, reply) => {
    const fl = await readFeatureList(fastify.config.MOUNT_PATH);
    if (!fl) return reply.code(404).send({ error: 'No feature_list.json found' });

    const idMap = new Map(fl.tasks.map((t) => [t.id, t]));
    fl.tasks = req.body.ids
      .map((id, i) => {
        const t = idMap.get(id);
        if (!t) return null;
        return { ...t, priority: i + 1 };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    await writeFeatureList(fastify.config.MOUNT_PATH, fl);
    return reply.send(fl.tasks);
  });
}
