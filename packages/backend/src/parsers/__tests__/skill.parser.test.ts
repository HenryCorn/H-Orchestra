import { describe, it, expect } from 'vitest';
import { parseSkillFile } from '../skill.parser.js';

const PATH = '/repo/.claude/skills/my-skill/SKILL.md';

const FULL_SKILL = `---
name: my-skill
description: Does something useful
trigger: do the thing
version: 1.2.3
author: Alice
tags:
  - backend
  - typescript
---

## Steps

1. Step one
2. Step two
`;

describe('parseSkillFile', () => {
  it('parses frontmatter fields', () => {
    const result = parseSkillFile(PATH, FULL_SKILL);
    expect(result.name).toBe('my-skill');
    expect(result.description).toBe('Does something useful');
    expect(result.trigger).toBe('do the thing');
    expect(result.version).toBe('1.2.3');
    expect(result.author).toBe('Alice');
    expect(result.tags).toEqual(['backend', 'typescript']);
  });

  it('sets rawContent to the body after frontmatter', () => {
    const result = parseSkillFile(PATH, FULL_SKILL);
    expect(result.rawContent).toContain('## Steps');
    expect(result.rawContent).toContain('Step one');
  });

  it('falls back gracefully when frontmatter is missing', () => {
    const result = parseSkillFile(PATH, 'Just plain content');
    expect(result.name).toBe('my-skill'); // derived from directory name
    expect(result.rawContent).toBe('Just plain content');
    expect(result.tags).toEqual([]);
  });

  it('sets path on the returned SkillDefinition', () => {
    const result = parseSkillFile(PATH, FULL_SKILL);
    expect(result.path).toBe(PATH);
  });
});
