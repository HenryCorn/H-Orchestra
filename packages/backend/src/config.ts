import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),
  MOUNT_PATH: z.string().default('/mounted-repo'),
  CHOKIDAR_USEPOLLING: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  LANGFUSE_SECRET_KEY: z.string().optional(),
  LANGFUSE_PUBLIC_KEY: z.string().optional(),
  LANGFUSE_BASE_URL: z.string().url().optional().default('https://cloud.langfuse.com'),
  HELICONE_API_KEY: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export function parseConfig(): Config {
  return ConfigSchema.parse(process.env);
}
