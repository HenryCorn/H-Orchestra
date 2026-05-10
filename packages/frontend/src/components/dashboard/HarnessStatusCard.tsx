import { useHarness } from '../../hooks/useHarness';
import { Card } from '../primitives/Card';
import { Badge } from '../primitives/Badge';

export function HarnessStatusCard() {
  const snapshot = useHarness();

  if (!snapshot) {
    return (
      <Card>
        <span className="text-metadata">No repository mounted</span>
      </Card>
    );
  }

  const { files } = snapshot;
  const checks = [
    { label: 'AGENTS.md', present: !!files.agentsMd },
    { label: 'CLAUDE.md', present: !!files.claudeMd },
    { label: 'feature_list.json', present: !!files.featureList },
    { label: 'claude-progress.txt', present: files.progress.length > 0 },
    { label: 'init.sh', present: files.initSh },
    { label: 'Skills', present: files.skills.length > 0 },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <span className="label">Mounted Repository</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-text)',
              wordBreak: 'break-all',
            }}
          >
            {snapshot.mountedPath}
          </span>
        </div>

        {!files.initSh && (
          <div
            style={{
              border: '1px solid var(--color-critical)',
              padding: 'var(--spacing-2) var(--spacing-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-critical)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            ⚠ CRITICAL: No init.sh detected — agent lacks deterministic baseline
          </div>
        )}

        <div>
          <span className="label">Harness Files</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
            {checks.map(({ label, present }) => (
              <Badge key={label} variant={present ? 'active' : 'default'}>
                {label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Skills Registered</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-text)',
            }}
          >
            {files.skills.length}
          </span>
        </div>
      </div>
    </Card>
  );
}
