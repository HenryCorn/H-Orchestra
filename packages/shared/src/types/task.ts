export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export type Priority = 1 | 2 | 3 | 4 | 5;

export interface TaskMutationRequest {
  id: string;
  label?: string;
  status?: TaskStatus;
  priority?: Priority;
  category?: string;
}

export interface TaskCreateRequest {
  label: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
}

export interface TaskReorderRequest {
  ids: string[];
}
