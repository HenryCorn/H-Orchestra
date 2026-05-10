import { useState } from 'react';
import { useTracingList, useTrace } from '../../hooks/useTracing';
import { Card } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import type { TraceRecord } from '@h-orchestra/shared';

export function TracingView() {
  const { data, loading, error } = useTracingList();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { trace } = useTrace(selectedId);

  if (loading) {
    return <span className="text-metadata">Loading traces...</span>;
  }

  if (error) {
    return (
      <Card>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-critical)' }}>
          {error.includes('No tracing provider') || data === null
            ? 'No tracing provider configured. Set LANGFUSE_SECRET_KEY or HELICONE_API_KEY environment variables.'
            : error}
        </span>
      </Card>
    );
  }

  const traces = data?.traces ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-heading">TRACING</h1>
        {data && (
          <span className="text-metadata">{data.provider.toUpperCase()} · {traces.length} traces</span>
        )}
      </div>

      {traces.length === 0 ? (
        <Card><span className="text-metadata">No traces found</span></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: trace ? '1fr 1fr' : '1fr', gap: 'var(--spacing-3)' }}>
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            {traces.map((t) => (
              <TraceRow
                key={t.id}
                trace={t}
                selected={selectedId === t.id}
                onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}
              />
            ))}
          </div>

          {trace && (
            <Card raised>
              <TraceDetail trace={trace} />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function TraceRow({ trace, selected, onClick }: { trace: TraceRecord; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 'var(--spacing-3)',
        alignItems: 'center',
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border)',
        background: selected ? 'var(--color-surface-raised)' : 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        borderLeft: selected ? '2px solid var(--color-text)' : '2px solid transparent',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {trace.name}
      </span>
      <Badge variant={trace.status === 'error' ? 'failed' : trace.status === 'success' ? 'complete' : 'in-progress'}>
        {trace.status}
      </Badge>
      <span className="text-metadata">{trace.durationMs ? `${trace.durationMs}ms` : '—'}</span>
    </button>
  );
}

function TraceDetail({ trace }: { trace: TraceRecord }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <span className="text-heading">{trace.name}</span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
        <div>
          <span className="label">Model</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>{trace.model ?? '—'}</span>
        </div>
        <div>
          <span className="label">Duration</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>{trace.durationMs ? `${trace.durationMs}ms` : '—'}</span>
        </div>
        <div>
          <span className="label">Input Tokens</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>{trace.inputTokens}</span>
        </div>
        <div>
          <span className="label">Output Tokens</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>{trace.outputTokens}</span>
        </div>
        {trace.totalCost !== null && (
          <div>
            <span className="label">Cost</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)' }}>${trace.totalCost.toFixed(6)}</span>
          </div>
        )}
      </div>
      {trace.spans.length > 0 && (
        <div>
          <span className="label">Spans ({trace.spans.length})</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-2)' }}>
            {trace.spans.map((span) => (
              <div
                key={span.id}
                style={{
                  padding: 'var(--spacing-2)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-metadata)',
                  color: 'var(--color-text-secondary)',
                  paddingLeft: span.parentId ? 'var(--spacing-8)' : 'var(--spacing-2)',
                }}
              >
                {span.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
