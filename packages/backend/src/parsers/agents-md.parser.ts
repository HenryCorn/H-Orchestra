import type { AgentSystemPrompt } from '@h-orchestra/shared';

export function parseAgentsMd(filePath: string, content: string): AgentSystemPrompt {
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

  return { path: filePath, rawContent: content, sections };
}
