import { parseConfig } from './config.js';
import { createServer } from './server.js';

async function main() {
  const config = parseConfig();
  const server = await createServer(config);

  try {
    await server.listen({ port: config.PORT, host: config.HOST });
    console.log(`H-Orchestra backend listening on ${config.HOST}:${config.PORT}`);
    console.log(`Watching mounted path: ${config.MOUNT_PATH}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
