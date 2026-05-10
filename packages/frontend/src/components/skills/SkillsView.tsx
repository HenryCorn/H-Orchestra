import { useState } from 'react';
import { useSkills } from '../../hooks/useSkills';
import { SkillCard } from './SkillCard';
import { Card } from '../primitives/Card';
import type { SkillDefinition } from '@h-orchestra/shared';

export function SkillsView() {
  const skills = useSkills();
  const [selected, setSelected] = useState<SkillDefinition | null>(null);
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? skills.filter((s) => {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.trigger.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : skills;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-heading">SKILLS</h1>
        <input
          className="input"
          placeholder="SEARCH..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      {skills.length === 0 ? (
        <Card>
          <span className="text-metadata">No .claude/skills/ directory found in mounted repository</span>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <span className="text-metadata">No skills match "{query}"</span>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr 1fr 1fr', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', gridColumn: selected ? '1' : '1 / -1' }}>
            {filtered.map((skill) => (
              <SkillCard
                key={skill.path}
                skill={skill}
                selected={selected?.path === skill.path}
                onClick={() => setSelected(selected?.path === skill.path ? null : skill)}
              />
            ))}
          </div>

          {selected && (
            <Card raised>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <span className="label">Skill</span>
                  <span className="text-heading">{selected.name}</span>
                </div>
                {selected.trigger && (
                  <div>
                    <span className="label">Trigger Phrase</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>
                      "{selected.trigger}"
                    </span>
                  </div>
                )}
                <div>
                  <span className="label">Author</span>
                  <span className="text-metadata" style={{ color: 'var(--color-text)' }}>{selected.author || '—'}</span>
                </div>
                <div>
                  <span className="label">Path</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    {selected.path}
                  </span>
                </div>
                <div>
                  <span className="label">Content</span>
                  <pre
                    className="code-block"
                    style={{ marginTop: 'var(--spacing-2)', maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {selected.rawContent}
                  </pre>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
