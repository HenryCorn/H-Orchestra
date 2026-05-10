import { readFile } from 'node:fs/promises';
import fg from 'fast-glob';
import { HARNESS_PATTERNS } from '@h-orchestra/shared';
import type { HarnessSnapshot, SSEEvent } from '@h-orchestra/shared';
import { parseFeatureList } from './feature-list.parser.js';
import { parseSkillsDirectory } from './skill.parser.js';
import { parseProgressFile } from './progress.parser.js';
import { parseAgentsMd } from './agents-md.parser.js';
import { parseAgentFile, parseAgentsDirectory } from './agent.parser.js';

export type SSEEventType = SSEEvent['type'];

export interface Parser<T = unknown> {
  glob: string;
  eventType: SSEEventType;
  parse: (filePath: string, content: string) => T;
}

export class ParserRegistry {
  private parsers: Parser[] = [];

  register<T>(parser: Parser<T>): void {
    this.parsers.push(parser as Parser);
  }

  findParser(filePath: string): Parser | undefined {
    return this.parsers.find((p) => filePath.includes(p.glob.replace('**/', '').replace('*/', '')));
  }
}

export function createDefaultRegistry(): ParserRegistry {
  const registry = new ParserRegistry();

  registry.register({
    glob: '**/feature_list.json',
    eventType: 'featurelist:updated',
    parse: parseFeatureList,
  });

  registry.register({
    glob: '**/claude-progress.txt',
    eventType: 'progress:updated',
    parse: (filePath, content) => {
      const entries = parseProgressFile(filePath, content);
      return { entries, lastEntry: entries[entries.length - 1] };
    },
  });

  registry.register({
    glob: '**/AGENTS.md',
    eventType: 'harness:snapshot',
    parse: parseAgentsMd,
  });

  registry.register({
    glob: '**/CLAUDE.md',
    eventType: 'harness:snapshot',
    parse: parseAgentsMd,
  });

  registry.register({
    glob: '**/CHECKPOINTS.md',
    eventType: 'checkpoints:updated',
    parse: parseAgentsMd,
  });

  registry.register({
    glob: '**/progress/current.md',
    eventType: 'progress-current:updated',
    parse: (_filePath, content) => ({ content }),
  });

  registry.register({
    glob: '**/progress/history.md',
    eventType: 'progress-history:updated',
    parse: (filePath, content) => ({ entries: parseProgressFile(filePath, content) }),
  });

  // .claude/agents/*.md — agent role definitions
  // findParser uses substring matching; 'agents/' matches any file under .claude/agents/
  registry.register({
    glob: '**/.claude/agents/',
    eventType: 'agents:updated',
    parse: parseAgentFile,
  });

  return registry;
}

export async function buildHarnessSnapshot(mountPath: string): Promise<HarnessSnapshot> {
  const ignore = ['**/node_modules/**', '**/.git/**'];

  const [
    agentsMdPaths,
    claudeMdPaths,
    featureListPaths,
    progressPaths,
    initShPaths,
    progressCurrentPaths,
    progressHistoryPaths,
    checkpointsPaths,
  ] = await Promise.all([
    fg(HARNESS_PATTERNS.agentsMd,      { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.claudeMd,      { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.featureList,   { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.progress,      { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.initSh,        { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.progressCurrent, { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.progressHistory, { cwd: mountPath, absolute: true, ignore }),
    fg(HARNESS_PATTERNS.checkpoints,   { cwd: mountPath, absolute: true, ignore }),
  ]);

  const [
    agentsMdContent,
    claudeMdContent,
    featureListContent,
    progressContent,
    progressCurrentContent,
    progressHistoryContent,
    checkpointsContent,
  ] = await Promise.all([
    agentsMdPaths[0]        ? readFile(agentsMdPaths[0], 'utf-8').catch(() => null)        : null,
    claudeMdPaths[0]        ? readFile(claudeMdPaths[0], 'utf-8').catch(() => null)        : null,
    featureListPaths[0]     ? readFile(featureListPaths[0], 'utf-8').catch(() => null)     : null,
    progressPaths[0]        ? readFile(progressPaths[0], 'utf-8').catch(() => null)        : null,
    progressCurrentPaths[0] ? readFile(progressCurrentPaths[0], 'utf-8').catch(() => null) : null,
    progressHistoryPaths[0] ? readFile(progressHistoryPaths[0], 'utf-8').catch(() => null) : null,
    checkpointsPaths[0]     ? readFile(checkpointsPaths[0], 'utf-8').catch(() => null)     : null,
  ]);

  const [skills, agents] = await Promise.all([
    parseSkillsDirectory(mountPath),
    parseAgentsDirectory(mountPath),
  ]);

  return {
    mountedPath: mountPath,
    discoveredAt: new Date().toISOString(),
    files: {
      agentsMd:
        agentsMdContent && agentsMdPaths[0]
          ? parseAgentsMd(agentsMdPaths[0], agentsMdContent)
          : null,
      claudeMd:
        claudeMdContent && claudeMdPaths[0]
          ? parseAgentsMd(claudeMdPaths[0], claudeMdContent)
          : null,
      featureList:
        featureListContent && featureListPaths[0]
          ? parseFeatureList(featureListPaths[0], featureListContent)
          : null,
      progress:
        progressContent && progressPaths[0]
          ? parseProgressFile(progressPaths[0], progressContent)
          : [],
      skills,
      initSh: initShPaths.length > 0,
      agents,
      progressCurrent: progressCurrentContent ?? null,
      progressHistory:
        progressHistoryContent && progressHistoryPaths[0]
          ? parseProgressFile(progressHistoryPaths[0], progressHistoryContent)
          : [],
      checkpoints:
        checkpointsContent && checkpointsPaths[0]
          ? parseAgentsMd(checkpointsPaths[0], checkpointsContent)
          : null,
    },
  };
}
