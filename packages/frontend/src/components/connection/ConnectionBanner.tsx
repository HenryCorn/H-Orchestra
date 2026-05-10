import type { SSEStatus } from '../../hooks/useSSE';

interface Props {
  status: SSEStatus;
}

export function ConnectionBanner({ status }: Props) {
  if (status === 'connected') return null;

  const label =
    status === 'connecting'
      ? 'CONNECTING'
      : status === 'reconnecting'
        ? 'RECONNECTING'
        : 'DISCONNECTED';

  const isCritical = status === 'disconnected';

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--font-size-metadata)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: 'var(--spacing-2) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border)',
        color: isCritical ? 'var(--color-critical)' : 'var(--color-text-secondary)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isCritical ? 'var(--color-critical)' : 'var(--color-text-secondary)',
          flexShrink: 0,
        }}
      />
      {label}
    </div>
  );
}
