import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import fg from 'fast-glob';
import yaml from 'js-yaml';
import type { SkillDefinition } from '@h-orchestra/shared';

export function parseSkillFile(filePath: string, content: string): SkillDefinition {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!fmMatch) {
    return {
      path: filePath,
      name: filePath.split('/').slice(-2)[0] ?? 'unknown',
      description: '',
      trigger: '',
      version: '0.0.1',
      author: '',
      tags: [],
      rawContent: content,
    };
  }

  const fm = yaml.load(fmMatch[1] ?? '') as Record<string, unknown> | null ?? {};
  const body = (fmMatch[2] ?? '').trim();

  return {
    path: filePath,
    name: String(fm['name'] ?? filePath.split('/').slice(-2)[0] ?? 'unknown'),
    description: String(fm['description'] ?? ''),
    trigger: String(fm['trigger'] ?? ''),
    version: String(fm['version'] ?? '0.0.1'),
    author: String(fm['author'] ?? ''),
    tags: Array.isArray(fm['tags']) ? fm['tags'].map(String) : [],
    rawContent: body,
  };
}

export async function parseSkillsDirectory(mountPath: string): Promise<SkillDefinition[]> {
  const paths = await fg('**/.claude/skills/*/SKILL.md', {
    cwd: mountPath,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  const skills: SkillDefinition[] = [];
  for (const p of paths) {
    try {
      const content = await readFile(p, 'utf-8');
      skills.push(parseSkillFile(p, content));
    } catch {
      // skip unreadable files
    }
  }
  return skills;
}
