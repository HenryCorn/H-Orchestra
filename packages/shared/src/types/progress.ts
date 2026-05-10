export type ProgressEntry = {
  timestamp: string;
  featureId: string;
  agentRole: string;
  outcome: string;
  summary: string;
};

export type ProgressCurrent = {
  activeFeature: string | null;
  startedAt: string;
  lastAction: string;
  nextAction: string;
  subagentInFlight: string | null;
  blocker: string | null;
};

export type ImplReport = {
  featureId: string;
  title: string;
  whatBuilt: string;
  filesTouched: string[];
  howVerified: string[];
  openQuestions: string;
};

export type ReviewVerdict = 'APPROVED' | 'CHANGES_REQUESTED';

export type ReviewReport = {
  featureId: string;
  title: string;
  verdict: ReviewVerdict;
  acceptanceCriteria: Array<{ text: string; passing: boolean }>;
  requiredChanges: string;
};
