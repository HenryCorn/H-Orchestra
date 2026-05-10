import { useProgress } from '../../hooks/useHarness';
import { Card } from '../primitives/Card';

export function AgentActivityFeed() {
  const progress = useProgress();

  const recent = [...progress].reverse().slice(0, 30);

  return (
    <Card style={{ maxHeight: 360, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <span className="label" style={{ marginBottom: 'var(--spacing-3)' }}>Agent Activity</span>
      {recent.length === 0 ? (
        <span className="text-metadata">No activity recorded</span>
      ) : (
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {recent.map((entry, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto 1fr',
                gap: 'var(--spacing-3)',
                alignItems: 'start',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-metadata)',
                color: entry.level === 'error' ? 'var(--color-critical)' : 'var(--color-text-secondary)',
                borderBottom: '1px solid var(--color-surface-raised)',
                paddingBottom: 'var(--spacing-2)',
              }}
            >
              <span style={{ color: 'var(--color-text-disabled)', flexShrink: 0 }}>
                {entry.timestamp.slice(11, 19)}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                [{entry.agentName}]
              </span>
              <span style={{ wordBreak: 'break-word' }}>{entry.message}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
