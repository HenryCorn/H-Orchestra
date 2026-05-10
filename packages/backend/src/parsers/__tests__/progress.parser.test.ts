import { describe, it, expect } from 'vitest';
import { parseProgressFile } from '../progress.parser.js';

const PATH = '/repo/claude-progress.txt';

describe('parseProgressFile', () => {
  it('parses standard bracketed timestamp lines', () => {
    const content = '[2026-01-01 10:00:00] [AGENT] Completed task-001: did something';
    const result = parseProgressFile(PATH, content);
    expect(result).toHaveLength(1);
    expect(result[0]?.agentName).toBe('AGENT');
    expect(result[0]?.message).toContain('Completed task-001');
    expect(result[0]?.level).toBe('info');
  });

  it('detects error level from keyword', () => {
    const content = '[2026-01-01 10:00:00] [AGENT] ERROR: something failed critically';
    const result = parseProgressFile(PATH, content);
    expect(result[0]?.level).toBe('error');
  });

  it('detects warn level from keyword', () => {
    const content = '[2026-01-01 10:00:00] [AGENT] WARNING: disk space low';
    const result = parseProgressFile(PATH, content);
    expect(result[0]?.level).toBe('warn');
  });

  it('handles lines without timestamp pattern gracefully', () => {
    const content = 'Just a plain line with no timestamp';
    const result = parseProgressFile(PATH, content);
    expect(result).toHaveLength(1);
    expect(result[0]?.message).toBe('Just a plain line with no timestamp');
  });

  it('skips blank lines', () => {
    const content = '[2026-01-01 10:00:00] [A] Line one\n\n[2026-01-01 10:01:00] [B] Line two\n';
    const result = parseProgressFile(PATH, content);
    expect(result).toHaveLength(2);
  });

  it('sets raw field to original line', () => {
    const line = '[2026-01-01 10:00:00] [AGENT] Hello';
    const result = parseProgressFile(PATH, line);
    expect(result[0]?.raw).toBe(line);
  });
});
