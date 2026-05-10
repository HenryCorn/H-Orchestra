import type { SkillDefinition } from '@h-orchestra/shared';
import { Badge } from '../primitives/Badge';

interface Props {
  skill: SkillDefinition;
  selected: boolean;
  onClick: () => void;
}

export function SkillCard({ skill, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-4)',
        background: selected ? 'var(--color-surface-raised)' : 'var(--color-surface)',
        border: `1px solid ${selected ? 'var(--color-text)' : 'var(--color-border)'}`,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'border-color 100ms linear',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {skill.name}
        </span>
        <span className="text-metadata" style={{ flexShrink: 0 }}>v{skill.version}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
        {skill.description}
      </p>
      {skill.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
          {skill.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}
    </button>
  );
}
