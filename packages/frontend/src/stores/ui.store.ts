import { create } from 'zustand';

export type ActiveView = 'dashboard' | 'tasks' | 'diagram' | 'agents' | 'tracing' | 'scaffold';

interface UIState {
  activeView: ActiveView;
  selectedTaskId: string | null;
  selectedSkillPath: string | null;
  selectedTraceId: string | null;
  taskFormOpen: boolean;
  setActiveView: (view: ActiveView) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedSkillPath: (path: string | null) => void;
  setSelectedTraceId: (id: string | null) => void;
  setTaskFormOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'dashboard',
  selectedTaskId: null,
  selectedSkillPath: null,
  selectedTraceId: null,
  taskFormOpen: false,
  setActiveView: (view) => set({ activeView: view }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setSelectedSkillPath: (path) => set({ selectedSkillPath: path }),
  setSelectedTraceId: (id) => set({ selectedTraceId: id }),
  setTaskFormOpen: (open) => set({ taskFormOpen: open }),
}));
