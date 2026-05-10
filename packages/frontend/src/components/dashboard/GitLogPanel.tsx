import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Card } from '../primitives/Card';
import type { GitCommit } from '@h-orchestra/shared';

export function GitLogPanel() {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [isGitRepo, setIsGitRepo] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gitlog
      .list(15)
      .then((r) => { setCommits(r.commits); setIsGitRepo(r.isGitRepo); })
      .catch(() => { setIsGitRepo(false); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <span className="label">GIT LOG</span>

      {loading && (
        <span className="text-metadata" style={{ marginTop: 'var(--spacing-2)' }}>
          Loading...
        </span>
      )}

      {!loading && !isGitRepo && (
        <span className="text-metadata" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
          Not a git repository
        </span>
      )}

      {!loading && isGitRepo && commits.length === 0 && (
        <span className="text-metadata" style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
          No commits found
        </span>
      )}

      {commits.map((c) => (
        <div
          key={c.hash}
          style={{
            display: 'grid',
            gridTemplateColumns: '4rem 1fr',
            gap: 'var(--spacing-2)',
            alignItems: 'baseline',
            paddingTop: 'var(--spacing-2)',
            borderTop: '1px solid var(--color-border)',
            marginTop: 'var(--spacing-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-text-disabled)',
            }}
          >
            {c.shortHash}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--font-size-metadata)',
                color: 'var(--color-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {c.message}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-metadata)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {c.author}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}
