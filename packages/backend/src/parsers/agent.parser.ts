import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import fg from 'fast-glob';
import type { AgentDefinition } from '@h-orchestra/shared';

export function parseAgentFile(filePath: string, content: string): AgentDefinition {
  const name = basename(filePath, '.md');
  const sections: Record<string, string> = {};
  const headingRe = /^#{1,3}\s+(.+)$/gm;
  let lastHeading: string | null = null;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(content)) !== null) {
    if (lastHeading !== null) {
      sections[lastHeading] = content.slice(lastIndex, match.index).trim();
    }
    lastHeading = match[1]?.trim() ?? '';
    lastIndex = match.index + match[0].length;
  }
  if (lastHeading !== null) {
    sections[lastHeading] = content.slice(lastIndex).trim();
  }

  return { path: filePath, name, role: name, rawContent: content, sections };
}

export async function parseAgentsDirectory(mountPath: string): Promise<AgentDefinition[]> {
  const paths = await fg('**/.claude/agents/*.md', {
    cwd: mountPath,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  const agents: AgentDefinition[] = [];
  for (const p of paths) {
    try {
      const content = await readFile(p, 'utf-8');
      agents.push(parseAgentFile(p, content));
    } catch {
      // skip unreadable files
    }
  }
  return agents;
}
