import { useHarness } from '../../hooks/useHarness';
import type { SSEStatus } from '../../hooks/useSSE';

interface Props {
  sseStatus: SSEStatus;
}

export function TopBar({ sseStatus }: Props) {
  const snapshot = useHarness();

  const statusColor =
    sseStatus === 'connected'
      ? 'var(--color-text)'
      : sseStatus === 'reconnecting'
        ? 'var(--color-text-secondary)'
        : 'var(--color-critical)';

  return (
    <header
      style={{
        height: 48,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-4)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'var(--color-text)',
          }}
        >
          H-ORCHESTRA
        </span>
        {snapshot && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {snapshot.mountedPath.split('/').slice(-1)[0]}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: statusColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            color: statusColor,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {sseStatus}
        </span>
      </div>
    </header>
  );
}
