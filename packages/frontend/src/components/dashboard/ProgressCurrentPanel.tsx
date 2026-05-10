import { useHarnessStore } from '../../stores/harness.store';
import { Card } from '../primitives/Card';

export function ProgressCurrentPanel() {
  const progressCurrent = useHarnessStore((s) => s.progressCurrent);

  const isEmpty = !progressCurrent || progressCurrent.trim().length === 0;

  return (
    <Card>
      <span className="label">CURRENT SESSION</span>

      {isEmpty ? (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text-disabled)',
            marginTop: 'var(--spacing-2)',
            display: 'block',
          }}
        >
          No active session — progress/current.md is empty
        </span>
      ) : (
        <pre
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-metadata)',
            color: 'var(--color-text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginTop: 'var(--spacing-3)',
            maxHeight: 280,
            overflowY: 'auto',
            lineHeight: 1.6,
          }}
        >
          {progressCurrent}
        </pre>
      )}
    </Card>
  );
}
