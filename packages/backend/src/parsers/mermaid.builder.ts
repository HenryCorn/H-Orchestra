import type { ProgressEntry } from '@h-orchestra/shared';

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
}

function escapeText(text: string): string {
  return text.replace(/[:"]/g, '').slice(0, 120);
}

export function buildMermaidDiagram(entries: ProgressEntry[]): string {
  if (entries.length === 0) {
    return 'sequenceDiagram\n  note over System: No agent activity recorded yet';
  }

  const agentNames = [...new Set(entries.map((e) => e.agentName).filter(Boolean))];
  const participantBlock = agentNames
    .map((a) => `  participant ${sanitizeId(a)} as ${a}`)
    .join('\n');

  const messages = entries
    .filter((e) => e.message.trim().length > 0)
    .slice(-50) // cap to last 50 entries for readability
    .map((e) => {
      const from = sanitizeId(e.agentName);
      // Look for "→ AgentName:" pattern to determine target
      const targetMatch = e.message.match(/→\s*([A-Za-z][A-Za-z0-9 _]+?):/);
      const to = targetMatch ? sanitizeId(targetMatch[1] ?? '') : 'SYSTEM';
      const arrow = e.level === 'error' ? '-->>' : '->>';
      return `  ${from}${arrow}${to}: ${escapeText(e.message)}`;
    })
    .join('\n');

  return `sequenceDiagram\n${participantBlock}\n${messages}`;
}
