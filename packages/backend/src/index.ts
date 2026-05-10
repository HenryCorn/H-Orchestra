import Fastify from 'fastify';
import { VERSION } from '@h-orchestra/shared';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';

const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });

app.get('/health', async () => ({ ok: true }));
app.get('/api/version', async () => ({ version: VERSION }));

app
  .listen({ port: PORT, host: HOST })
  .then(() => {
    app.log.info(`H-Orchestra backend listening on http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
