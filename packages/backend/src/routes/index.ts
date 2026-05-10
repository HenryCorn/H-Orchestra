import type { FastifyInstance } from 'fastify';
import sseRoute from './sse.route.js';
import harnessRoute from './harness.route.js';
import tasksRoute from './tasks.route.js';
import skillsRoute from './skills.route.js';
import tracingRoute from './tracing.route.js';
import templatesRoute from './templates.route.js';
import scaffoldRoute from './scaffold.route.js';
import gitlogRoute from './gitlog.route.js';
import importTemplateRoute from './import-template.route.js';

export default async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(sseRoute);
  await fastify.register(harnessRoute);
  await fastify.register(tasksRoute);
  await fastify.register(skillsRoute);
  await fastify.register(tracingRoute);
  await fastify.register(templatesRoute);
  await fastify.register(scaffoldRoute);
  await fastify.register(gitlogRoute);
  await fastify.register(importTemplateRoute);
}
