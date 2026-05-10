import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useUIStore } from '../../stores/ui.store';
import { TaskRow } from './TaskRow';
import { TaskForm } from './TaskForm';
import { PillButton } from '../primitives/PillButton';
import { SegmentedProgress } from '../primitives/SegmentedProgress';
import type { FeatureTask } from '@h-orchestra/shared';

export function TasksView() {
  const { tasks, createTask, updateTask, deleteTask, reorderTasks } = useTasks();
  const taskFormOpen = useUIStore((s) => s.taskFormOpen);
  const setTaskFormOpen = useUIStore((s) => s.setTaskFormOpen);
  const [filter, setFilter] = useState<FeatureTask['status'] | 'all'>('all');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
  const sorted = [...filtered].sort((a, b) => a.priority - b.priority);

  function handleDragStart(_e: DragEvent, id: string) {
    dragId.current = id;
  }

  function handleDragOver(_e: DragEvent, id: string) {
    if (dragId.current !== id) setDragOverId(id);
  }

  function handleDrop(_e: DragEvent, targetId: string) {
    const srcId = dragId.current;
    if (!srcId || srcId === targetId) { setDragOverId(null); return; }

    const ids = sorted.map((t) => t.id);
    const fromIdx = ids.indexOf(srcId);
    const toIdx = ids.indexOf(targetId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, srcId);

    dragId.current = null;
    setDragOverId(null);
    void reorderTasks(ids);
  }

  function handleDragEnd() {
    dragId.current = null;
    setDragOverId(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-heading">TASK LIST</h1>
        <PillButton variant="active" onClick={() => setTaskFormOpen(true)}>
          + ADD TASK
        </PillButton>
      </div>

      <SegmentedProgress value={completed} max={total} segments={Math.min(total, 40) || 20} showLabel />

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'in_progress', 'completed', 'blocked'] as const).map((s) => (
          <PillButton
            key={s}
            variant={filter === s ? 'active' : 'default'}
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </PillButton>
        ))}
      </div>

      <div
        style={{
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        {sorted.length === 0 ? (
          <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>
            <span className="text-metadata">No tasks</span>
          </div>
        ) : (
          sorted.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onDelete={(id) => void deleteTask(id)}
              onStatusChange={(id, status) => void updateTask(id, { status })}
              draggable={filter === 'all'}
              isDragOver={dragOverId === task.id}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>

      {taskFormOpen && (
        <TaskForm
          onSubmit={createTask}
          onClose={() => setTaskFormOpen(false)}
        />
      )}
    </div>
  );
}
