import type { FeatureList } from './feature.js';
import type { AgentDefinition } from './agent.js';
import type { SkillDefinition } from './skill.js';
import type { ProgressCurrent, ProgressEntry, ImplReport, ReviewReport } from './progress.js';

export type ParseError = {
  file: string;
  message: string;
  line?: number;
};

export type HarnessState = {
  featureList: FeatureList | null;
  agents: AgentDefinition[];
  skills: SkillDefinition[];
  progressCurrent: ProgressCurrent | null;
  progressHistory: ProgressEntry[];
  implReports: Record<string, ImplReport>;
  reviewReports: Record<string, ReviewReport>;
  parseErrors: ParseError[];
};
