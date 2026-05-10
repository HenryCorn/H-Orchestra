import type { DragEvent } from 'react';
import type { FeatureTask } from '@h-orchestra/shared';
import { Badge } from '../primitives/Badge';
import { PillButton } from '../primitives/PillButton';

interface Props {
  task: FeatureTask;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: FeatureTask['status']) => void;
  draggable?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: DragEvent, id: string) => void;
  onDragOver?: (e: DragEvent, id: string) => void;
  onDrop?: (e: DragEvent, id: string) => void;
  onDragEnd?: () => void;
}

const STATUS_VARIANTS: Record<FeatureTask['status'], 'default' | 'active' | 'failed' | 'complete' | 'in-progress'> = {
  pending: 'default',
  in_progress: 'in-progress',
  completed: 'complete',
  blocked: 'failed',
};

const NEXT_STATUS: Record<FeatureTask['status'], FeatureTask['status']> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
  blocked: 'pending',
};

export function TaskRow({
  task,
  onDelete,
  onStatusChange,
  draggable = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart ? (e) => onDragStart(e, task.id) : undefined}
      onDragOver={onDragOver ? (e) => { e.preventDefault(); onDragOver(e, task.id); } : undefined}
      onDrop={onDrop ? (e) => onDrop(e, task.id) : undefined}
      onDragEnd={onDragEnd}
      style={{
        display: 'grid',
        gridTemplateColumns: draggable ? '1.25rem 2rem 1fr auto auto' : '2rem 1fr auto auto',
        gap: 'var(--spacing-3)',
        alignItems: 'center',
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border)',
        borderTop: isDragOver ? '2px solid var(--color-text)' : undefined,
        background: task.status === 'in_progress' ? 'var(--color-surface-raised)' : 'transparent',
        cursor: draggable ? 'grab' : 'default',
        opacity: draggable ? 1 : 1,
      }}
    >
      {draggable && (
        <span
          style={{
            color: 'var(--color-text-disabled)',
            fontSize: '0.75rem',
            userSelect: 'none',
            cursor: 'grab',
          }}
        >
          ⠿
        </span>
      )}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-metadata)',
          color: 'var(--color-text-disabled)',
          textAlign: 'right',
        }}
      >
        {String(task.priority).padStart(2, '0')}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-body)',
            color: task.status === 'completed' ? 'var(--color-text-disabled)' : 'var(--color-text)',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.label}
        </span>
        <span className="text-metadata">{task.category}</span>
      </div>

      <Badge variant={STATUS_VARIANTS[task.status]}>{task.status.replace('_', ' ')}</Badge>

      <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
        <PillButton
          onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
          style={{ fontSize: '0.55rem', padding: '2px 6px' }}
        >
          →
        </PillButton>
        <PillButton
          variant="danger"
          onClick={() => onDelete(task.id)}
          style={{ fontSize: '0.55rem', padding: '2px 6px' }}
        >
          ✕
        </PillButton>
      </div>
    </div>
  );
}
