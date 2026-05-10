import { useState } from 'react';
import { PillButton } from '../primitives/PillButton';
import type { TaskCreateRequest } from '@h-orchestra/shared';

interface Props {
  onSubmit: (req: TaskCreateRequest) => Promise<void>;
  onClose: () => void;
}

export function TaskForm({ onSubmit, onClose }: Props) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ label: label.trim(), status: 'pending', priority: 3, category });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-6)',
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-heading">ADD TASK</h2>

        <div>
          <label className="label">Task Label</label>
          <input
            className="input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Describe what needs to be done"
            onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
            autoFocus
          />
        </div>

        <div>
          <label className="label">Category</label>
          <input
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. core, infrastructure, testing"
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
          <PillButton onClick={onClose}>CANCEL</PillButton>
          <PillButton variant="active" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? 'ADDING...' : 'ADD TASK'}
          </PillButton>
        </div>
      </div>
    </div>
  );
}
