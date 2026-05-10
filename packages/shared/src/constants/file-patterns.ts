export const HARNESS_PATTERNS = {
  agentsMd: '**/AGENTS.md',
  claudeMd: '**/CLAUDE.md',
  featureList: '**/feature_list.json',
  progress: '**/claude-progress.txt',
  skills: '**/.claude/skills/*/SKILL.md',
  initSh: '**/init.sh',
  // Multi-agent harness pattern (Anthropic blog post)
  agentDefs: '**/.claude/agents/*.md',
  progressCurrent: '**/progress/current.md',
  progressHistory: '**/progress/history.md',
  checkpoints: '**/CHECKPOINTS.md',
} as const;

export type HarnessPatternKey = keyof typeof HARNESS_PATTERNS;

export const IGNORED_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/__pycache__/**',
  '**/*.pyc',
  '**/bin/obj/**',
  '**/obj/**',
];
