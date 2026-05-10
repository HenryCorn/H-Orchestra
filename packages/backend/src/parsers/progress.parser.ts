import type { ProgressEntry } from '@h-orchestra/shared';

const LOG_LINE_RE = /^\[?(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[^\]]*)\]?\s*(?:\[([^\]]+)\])?\s*(.*)$/;

export function parseProgressFile(filePath: string, content: string): ProgressEntry[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  return lines.map((raw) => parseProgressLine(raw));
}

function parseProgressLine(raw: string): ProgressEntry {
  const m = raw.match(LOG_LINE_RE);
  if (m) {
    const [, ts, agent, msg] = m;
    return {
      timestamp: ts ?? new Date().toISOString(),
      agentName: agent ?? 'unknown',
      message: msg ?? raw,
      level: detectLevel(raw),
      raw,
    };
  }
  return {
    timestamp: new Date().toISOString(),
    agentName: 'unknown',
    message: raw,
    level: 'info',
    raw,
  };
}

function detectLevel(line: string): ProgressEntry['level'] {
  const lower = line.toLowerCase();
  if (lower.includes('error') || lower.includes('fail') || lower.includes('critical')) return 'error';
  if (lower.includes('warn') || lower.includes('warning')) return 'warn';
  return 'info';
}
