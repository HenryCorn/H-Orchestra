import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { HarnessSnapshot, SSEEvent, FeatureList, ProgressEntry, SkillDefinition, AgentDefinition } from '@h-orchestra/shared';

interface HarnessState {
  snapshot: HarnessSnapshot | null;
  featureList: FeatureList | null;
  progress: ProgressEntry[];
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  progressCurrent: string | null;
  loading: boolean;
  dispatch: (event: SSEEvent) => void;
  setSnapshot: (snapshot: HarnessSnapshot) => void;
}

export const useHarnessStore = create<HarnessState>()(
  immer((set) => ({
    snapshot: null,
    featureList: null,
    progress: [],
    skills: [],
    agents: [],
    progressCurrent: null,
    loading: true,

    setSnapshot: (snapshot) => set((state) => {
      state.snapshot = snapshot;
      state.featureList = snapshot.files.featureList;
      state.progress = snapshot.files.progress;
      state.skills = snapshot.files.skills;
      state.agents = snapshot.files.agents;
      state.progressCurrent = snapshot.files.progressCurrent;
      state.loading = false;
    }),

    dispatch: (event) => set((state) => {
      switch (event.type) {
        case 'harness:snapshot':
          state.snapshot = event.payload;
          state.featureList = event.payload.files.featureList;
          state.progress = event.payload.files.progress;
          state.skills = event.payload.files.skills;
          state.agents = event.payload.files.agents;
          state.progressCurrent = event.payload.files.progressCurrent;
          state.loading = false;
          break;
        case 'featurelist:updated':
          state.featureList = event.payload;
          if (state.snapshot) {
            state.snapshot.files.featureList = event.payload;
          }
          break;
        case 'progress:updated':
          state.progress = event.payload.entries;
          if (state.snapshot) {
            state.snapshot.files.progress = event.payload.entries;
          }
          break;
        case 'skills:updated':
          state.skills = event.payload;
          if (state.snapshot) {
            state.snapshot.files.skills = event.payload;
          }
          break;
        case 'agents:updated':
          state.agents = event.payload;
          if (state.snapshot) {
            state.snapshot.files.agents = event.payload;
          }
          break;
        case 'progress-current:updated':
          state.progressCurrent = event.payload.content;
          if (state.snapshot) {
            state.snapshot.files.progressCurrent = event.payload.content;
          }
          break;
        case 'progress-history:updated':
          if (state.snapshot) {
            state.snapshot.files.progressHistory = event.payload.entries;
          }
          break;
        case 'checkpoints:updated':
          if (state.snapshot) {
            state.snapshot.files.checkpoints = event.payload;
          }
          break;
      }
    }),
  }))
);
