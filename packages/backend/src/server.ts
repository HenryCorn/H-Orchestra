import Fastify from 'fastify';
import corsPlugin from './plugins/cors.js';
import ssePlugin from './plugins/sse.js';
import staticPlugin from './plugins/static.js';
import registerRoutes from './routes/index.js';
import { HarnessWatcher } from './watcher/index.js';
import { createDefaultRegistry, buildHarnessSnapshot } from './parsers/index.js';
import type { Config } from './config.js';
import type { SSEEvent } from '@h-orchestra/shared';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export async function createServer(config: Config) {
  const fastify = Fastify({
    logger: config.NODE_ENV === 'development',
  });

  fastify.decorate('config', config);

  await fastify.register(corsPlugin);
  await fastify.register(ssePlugin);
  await fastify.register(staticPlugin);
  await registerRoutes(fastify);

  fastify.get('/health', async () => ({ status: 'ok' }));

  // Start file watcher after server is ready
  fastify.addHook('onReady', async () => {
    const registry = createDefaultRegistry();
    const watcher = new HarnessWatcher(config.MOUNT_PATH, config.CHOKIDAR_USEPOLLING, registry);

    // Build and cache the initial harness snapshot
    try {
      const snapshot = await buildHarnessSnapshot(config.MOUNT_PATH);
      fastify.currentSnapshot = snapshot;
      fastify.broadcastSSE({ type: 'harness:snapshot', payload: snapshot });
    } catch (err) {
      fastify.log.error({ err }, 'Failed to build initial harness snapshot');
    }

    // Wire watcher events to SSE broadcast and keep snapshot current
    watcher.on('file:changed', (payload) => {
      fastify.broadcastSSE({ type: 'file:changed', payload } as SSEEvent);
    });
    watcher.on('featurelist:updated', (payload) => {
      fastify.broadcastSSE({ type: 'featurelist:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, featureList: payload } };
      }
    });
    watcher.on('progress:updated', (payload) => {
      fastify.broadcastSSE({ type: 'progress:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, progress: payload.entries } };
      }
    });
    watcher.on('skills:updated', (payload) => {
      fastify.broadcastSSE({ type: 'skills:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, skills: payload } };
      }
    });
    watcher.on('agents:updated', (payload) => {
      fastify.broadcastSSE({ type: 'agents:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, agents: payload } };
      }
    });
    watcher.on('progress-current:updated', (payload) => {
      fastify.broadcastSSE({ type: 'progress-current:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, progressCurrent: payload.content } };
      }
    });
    watcher.on('progress-history:updated', (payload) => {
      fastify.broadcastSSE({ type: 'progress-history:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, progressHistory: payload.entries } };
      }
    });
    watcher.on('checkpoints:updated', (payload) => {
      fastify.broadcastSSE({ type: 'checkpoints:updated', payload } as SSEEvent);
      if (fastify.currentSnapshot) {
        fastify.currentSnapshot = { ...fastify.currentSnapshot, files: { ...fastify.currentSnapshot.files, checkpoints: payload } };
      }
    });

    watcher.start();

    fastify.addHook('onClose', async () => {
      await watcher.stop();
    });
  });

  return fastify;
}
