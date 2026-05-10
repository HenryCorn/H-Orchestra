import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../engine.js';

describe('renderTemplate', () => {
  it('substitutes a single variable', () => {
    const result = renderTemplate('Hello {{NAME}}!', { NAME: 'World' });
    expect(result).toBe('Hello World!');
  });

  it('substitutes multiple variables', () => {
    const tmpl = '{{GREETING}} {{NAME}}, version {{VERSION}}';
    const result = renderTemplate(tmpl, { GREETING: 'Hi', NAME: 'Alice', VERSION: '2.0' });
    expect(result).toBe('Hi Alice, version 2.0');
  });

  it('substitutes the same variable multiple times', () => {
    const result = renderTemplate('{{X}} and {{X}}', { X: 'foo' });
    expect(result).toBe('foo and foo');
  });

  it('converts boolean true to "true"', () => {
    const result = renderTemplate('enabled={{FLAG}}', { FLAG: true });
    expect(result).toBe('enabled=true');
  });

  it('converts boolean false to "false"', () => {
    const result = renderTemplate('enabled={{FLAG}}', { FLAG: false });
    expect(result).toBe('enabled=false');
  });

  it('throws on unresolved variable', () => {
    expect(() => renderTemplate('{{MISSING}}', {})).toThrow('Unresolved template variable: MISSING');
  });

  it('leaves non-matching patterns intact (lowercase)', () => {
    const result = renderTemplate('{{lower_case}} {{UPPER}}', { UPPER: 'ok' });
    expect(result).toBe('{{lower_case}} ok');
  });

  it('returns template unchanged if no placeholders', () => {
    const tmpl = 'No placeholders here';
    expect(renderTemplate(tmpl, {})).toBe(tmpl);
  });
});
