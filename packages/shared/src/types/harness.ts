export interface HarnessSnapshot {
  mountedPath: string;
  discoveredAt: string;
  files: HarnessFileMap;
}

export interface HarnessFileMap {
  agentsMd: AgentSystemPrompt | null;
  claudeMd: AgentSystemPrompt | null;
  featureList: FeatureList | null;
  progress: ProgressEntry[];
  skills: SkillDefinition[];
  initSh: boolean;
  // Multi-agent harness pattern (Anthropic blog post)
  agents: AgentDefinition[];
  progressCurrent: string | null;
  progressHistory: ProgressEntry[];
  checkpoints: AgentSystemPrompt | null;
}

export interface AgentSystemPrompt {
  path: string;
  rawContent: string;
  sections: Record<string, string>;
}

export interface AgentDefinition {
  path: string;
  name: string;
  role: string;
  rawContent: string;
  sections: Record<string, string>;
}

export interface FeatureList {
  path: string;
  tasks: FeatureTask[];
  lastModified: string;
}

export interface FeatureTask {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: number;
  category: string;
  metadata: Record<string, string | boolean | number>;
}

export interface SkillDefinition {
  path: string;
  name: string;
  description: string;
  trigger: string;
  version: string;
  author: string;
  tags: string[];
  rawContent: string;
}

export interface ProgressEntry {
  timestamp: string;
  agentName: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  raw: string;
}
