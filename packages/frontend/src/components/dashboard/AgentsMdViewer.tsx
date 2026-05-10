import { useState } from 'react';
import { useHarnessStore } from '../../stores/harness.store';
import { Card } from '../primitives/Card';
import { PillButton } from '../primitives/PillButton';

export function AgentsMdViewer() {
  const snapshot = useHarnessStore((s) => s.snapshot);
  const [active, setActive] = useState<'agents' | 'claude'>('claude');

  const claudeMd = snapshot?.files.claudeMd;
  const agentsMd = snapshot?.files.agentsMd;
  const hasClaudeMd = claudeMd !== null && claudeMd !== undefined;
  const hasAgentsMd = agentsMd !== null && agentsMd !== undefined;

  if (!hasClaudeMd && !hasAgentsMd) return null;

  const source = active === 'claude' ? claudeMd : agentsMd;
  const content = source?.rawContent ?? '';

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
        <span className="label">SYSTEM PROMPT</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
          {hasClaudeMd && (
            <PillButton
              variant={active === 'claude' ? 'active' : 'default'}
              onClick={() => setActive('claude')}
              style={{ fontSize: '0.6rem', padding: '2px 8px' }}
            >
              CLAUDE.MD
            </PillButton>
          )}
          {hasAgentsMd && (
            <PillButton
              variant={active === 'agents' ? 'active' : 'default'}
              onClick={() => setActive('agents')}
              style={{ fontSize: '0.6rem', padding: '2px 8px' }}
            >
              AGENTS.MD
            </PillButton>
          )}
        </div>
      </div>

      {source?.sections && Object.keys(source.sections).length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {Object.entries(source.sections).slice(0, 5).map(([heading, body]) => (
            <div key={heading} style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-2)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-metadata)',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {heading}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-metadata)',
                  color: 'var(--color-text)',
                  marginTop: 'var(--spacing-1)',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {body.trim().slice(0, 300)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {content.slice(0, 800)}{content.length > 800 ? '\n...' : ''}
        </pre>
      )}
    </Card>
  );
}
