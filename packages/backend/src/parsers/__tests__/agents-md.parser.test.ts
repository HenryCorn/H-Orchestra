import { describe, it, expect } from 'vitest';
import { parseAgentsMd } from '../agents-md.parser.js';

const PATH = '/repo/CLAUDE.md';

const SAMPLE = `# My Agent

Some intro text.

## Commands

pnpm dev starts the server.

## Rules

Never use var.
`;

describe('parseAgentsMd', () => {
  it('extracts sections by heading', () => {
    const result = parseAgentsMd(PATH, SAMPLE);
    expect(Object.keys(result.sections)).toContain('Commands');
    expect(Object.keys(result.sections)).toContain('Rules');
    expect(result.sections['Commands']).toContain('pnpm dev');
    expect(result.sections['Rules']).toContain('Never use var');
  });

  it('sets rawContent to full file content', () => {
    const result = parseAgentsMd(PATH, SAMPLE);
    expect(result.rawContent).toBe(SAMPLE);
  });

  it('sets path on the returned object', () => {
    const result = parseAgentsMd(PATH, SAMPLE);
    expect(result.path).toBe(PATH);
  });

  it('handles content with no headings', () => {
    const result = parseAgentsMd(PATH, 'Just plain text');
    expect(Object.keys(result.sections)).toHaveLength(0);
  });

  it('handles H1, H2, H3 headings', () => {
    const content = '# Top\n\nbody1\n\n## Sub\n\nbody2\n\n### Deep\n\nbody3';
    const result = parseAgentsMd(PATH, content);
    expect(Object.keys(result.sections)).toHaveLength(3);
    expect(result.sections['Top']).toContain('body1');
    expect(result.sections['Sub']).toContain('body2');
    expect(result.sections['Deep']).toContain('body3');
  });
});
