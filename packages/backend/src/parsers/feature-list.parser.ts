import { readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import fg from 'fast-glob';
import type { FeatureList, FeatureTask } from '@h-orchestra/shared';

export function parseFeatureList(filePath: string, content: string): FeatureList {
  const raw = JSON.parse(content) as unknown;

  const tasks: FeatureTask[] = [];

  if (raw && typeof raw === 'object') {
    // Support both array format and {tasks: [...]} format
    const items = Array.isArray(raw)
      ? raw
      : 'tasks' in raw && Array.isArray((raw as Record<string, unknown>).tasks)
        ? ((raw as Record<string, unknown>).tasks as unknown[])
        : Object.values(raw as Record<string, unknown>).find((v) => Array.isArray(v)) ?? [];

    for (const item of items as unknown[]) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const t = item as Record<string, unknown>;
        tasks.push({
          id: String(t['id'] ?? crypto.randomUUID()),
          label: String(t['label'] ?? t['title'] ?? t['name'] ?? ''),
          status: coerceStatus(t['status']),
          priority: Number(t['priority'] ?? 3),
          category: String(t['category'] ?? 'general'),
          metadata: {},
        });
      }
    }
  }

  return { path: filePath, tasks, lastModified: new Date().toISOString() };
}

function coerceStatus(v: unknown): FeatureTask['status'] {
  const s = String(v ?? '').toLowerCase();
  if (s === 'in_progress' || s === 'in progress' || s === 'inprogress') return 'in_progress';
  if (s === 'completed' || s === 'done' || s === 'complete') return 'completed';
  if (s === 'blocked') return 'blocked';
  return 'pending';
}

export async function readFeatureList(mountPath: string): Promise<FeatureList | null> {
  const paths = await fg('**/feature_list.json', {
    cwd: mountPath,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });
  if (paths.length === 0) return null;
  const content = await readFile(paths[0]!, 'utf-8');
  return parseFeatureList(paths[0]!, content);
}

export async function writeFeatureList(mountPath: string, fl: FeatureList): Promise<void> {
  const tmp = fl.path + '.tmp';
  await writeFile(tmp, JSON.stringify({ tasks: fl.tasks }, null, 2), 'utf-8');
  await rename(tmp, fl.path);
}
