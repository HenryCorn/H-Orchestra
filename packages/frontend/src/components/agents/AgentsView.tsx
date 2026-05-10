import { useState } from 'react';
import { useHarnessStore } from '../../stores/harness.store';
import { Card } from '../primitives/Card';
import type { AgentDefinition } from '@h-orchestra/shared';

const ROLE_GLYPHS: Record<string, string> = {
  leader: '◈',
  implementer: '▦',
  reviewer: '◎',
};

function AgentCard({
  agent,
  selected,
  onClick,
}: {
  agent: AgentDefinition;
  selected: boolean;
  onClick: () => void;
}) {
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>
          {ROLE_GLYPHS[agent.role] ?? '⬡'}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {agent.name}
        </span>
      </div>
      {Object.keys(agent.sections).length > 0 && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {Object.keys(agent.sections).slice(0, 3).join(' · ')}
        </span>
      )}
    </button>
  );
}

export function AgentsView() {
  const agents = useHarnessStore((s) => s.agents);
  const snapshot = useHarnessStore((s) => s.snapshot);
  const [selected, setSelected] = useState<AgentDefinition | null>(null);

  const checkpoints = snapshot?.files.checkpoints ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 1000 }}>
      <h1 className="text-heading">AGENTS</h1>

      {agents.length === 0 ? (
        <Card>
          <span className="text-metadata" style={{ color: 'var(--color-text-secondary)' }}>
            No .claude/agents/ directory found in mounted repository
          </span>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr 1fr 1fr', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', gridColumn: selected ? '1' : '1 / -1' }}>
            {agents.map((agent) => (
              <AgentCard
                key={agent.path}
                agent={agent}
                selected={selected?.path === agent.path}
                onClick={() => setSelected(selected?.path === agent.path ? null : agent)}
              />
            ))}
          </div>

          {selected && (
            <Card raised>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <span className="label">Role</span>
                  <span className="text-heading">{selected.name.toUpperCase()}</span>
                </div>

                {Object.entries(selected.sections).map(([heading, body]) => (
                  <div key={heading}>
                    <span className="label">{heading}</span>
                    <pre
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--font-size-metadata)',
                        color: 'var(--color-text)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        marginTop: 'var(--spacing-1)',
                        maxHeight: 160,
                        overflowY: 'auto',
                      }}
                    >
                      {body}
                    </pre>
                  </div>
                ))}

                {Object.keys(selected.sections).length === 0 && (
                  <pre
                    className="code-block"
                    style={{ marginTop: 'var(--spacing-2)', maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {selected.rawContent}
                  </pre>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {checkpoints && (
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <h2 className="text-heading" style={{ marginBottom: 'var(--spacing-3)' }}>CHECKPOINTS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
            {Object.entries(checkpoints.sections).map(([heading, body]) => (
              <Card key={heading}>
                <span className="label">{heading}</span>
                <pre
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--font-size-metadata)',
                    color: 'var(--color-text-secondary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: 'var(--spacing-2)',
                  }}
                >
                  {body}
                </pre>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
