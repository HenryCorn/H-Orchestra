import type {
  HarnessSnapshot,
  FeatureTask,
  SkillDefinition,
  TaskCreateRequest,
  TaskMutationRequest,
  TaskReorderRequest,
  TracingListResponse,
  TraceRecord,
  AgentTemplate,
  ScaffoldRequest,
  ScaffoldResult,
  GitLogResponse,
} from '@h-orchestra/shared';

const API_BASE = '/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${init?.method ?? 'GET'} ${path} → ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  harness: {
    snapshot: () => apiFetch<HarnessSnapshot>('/harness'),
  },

  tasks: {
    create: (body: TaskCreateRequest) =>
      apiFetch<FeatureTask>('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<TaskMutationRequest>) =>
      apiFetch<FeatureTask>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' }),
    reorder: (body: TaskReorderRequest) =>
      apiFetch<FeatureTask[]>('/tasks/reorder', { method: 'PUT', body: JSON.stringify(body) }),
  },

  skills: {
    list: () => apiFetch<SkillDefinition[]>('/skills'),
  },

  tracing: {
    list: () => apiFetch<TracingListResponse>('/tracing/traces'),
    get: (id: string) => apiFetch<TraceRecord>(`/tracing/traces/${id}`),
  },

  templates: {
    list: () => apiFetch<AgentTemplate[]>('/templates'),
    importZip: (file: File) =>
      fetch('/api/templates/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/zip' },
        body: file,
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<AgentTemplate>;
      }),
  },

  scaffold: {
    run: (body: ScaffoldRequest) =>
      apiFetch<ScaffoldResult>('/scaffold', { method: 'POST', body: JSON.stringify(body) }),
  },

  gitlog: {
    list: (limit = 20) => apiFetch<GitLogResponse>(`/gitlog?limit=${limit}`),
  },
};
