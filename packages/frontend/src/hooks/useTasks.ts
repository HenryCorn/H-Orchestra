import { useCallback } from 'react';
import { useHarnessStore } from '../stores/harness.store';
import { api } from '../api/client';
import type { TaskCreateRequest, TaskMutationRequest } from '@h-orchestra/shared';

export function useTasks() {
  const featureList = useHarnessStore((s) => s.featureList);
  const tasks = featureList?.tasks ?? [];

  const createTask = useCallback(async (req: TaskCreateRequest) => {
    await api.tasks.create(req);
    // SSE will update the store when feature_list.json changes
  }, []);

  const updateTask = useCallback(async (id: string, req: Partial<TaskMutationRequest>) => {
    await api.tasks.update(id, req);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api.tasks.delete(id);
  }, []);

  const reorderTasks = useCallback(async (ids: string[]) => {
    await api.tasks.reorder({ ids });
  }, []);

  return { tasks, createTask, updateTask, deleteTask, reorderTasks };
}
