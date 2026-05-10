import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import type {
  Feature,
  FeatureList,
  FeatureStatus,
  AgentDefinition,
  SkillDefinition,
  ProgressEntry,
  ProgressCurrent,
  ImplReport,
  ReviewVerdict,
  ReviewReport,
  ParseError,
  HarnessState,
  SSEEvent,
  SSEEventType,
} from '../index.js';

describe('Feature types', () => {
  it('Feature has required fields with correct values', () => {
    const feature: Feature = {
      id: 'infra-01',
      name: 'shared-types',
      title: 'Shared types package baseline',
      description: 'Establish @h-orchestra/shared with core type definitions',
      acceptance: ['types exist', 'build succeeds'],
      status: 'pending',
    };

    assert.strictEqual(feature.id, 'infra-01');
    assert.strictEqual(feature.name, 'shared-types');
    assert.strictEqual(feature.title, 'Shared types package baseline');
    assert.strictEqual(feature.status, 'pending');
    assert.ok(Array.isArray(feature.acceptance));
    assert.strictEqual(feature.acceptance.length, 2);
  });

  it('FeatureStatus covers all four variants', () => {
    const statuses: FeatureStatus[] = ['pending', 'in_progress', 'done', 'blocked'];
    assert.strictEqual(statuses.length, 4);
    assert.ok(statuses.includes('pending'));
    assert.ok(statuses.includes('in_progress'));
    assert.ok(statuses.includes('done'));
    assert.ok(statuses.includes('blocked'));
  });

  it('FeatureList holds project metadata and features array', () => {
    const list: FeatureList = {
      project: 'h-orchestra',
      description: 'UI for managing agent harnesses',
      rules: ['no mocks', 'strict TypeScript'],
      features: [],
    };

    assert.strictEqual(list.project, 'h-orchestra');
    assert.ok(Array.isArray(list.rules));
    assert.ok(Array.isArray(list.features));
    assert.strictEqual(list.features.length, 0);
  });
});

describe('AgentDefinition type', () => {
  it('AgentDefinition has all required fields', () => {
    const agent: AgentDefinition = {
      id: 'implementer',
      name: 'implementer',
      description: 'Implements one feature and writes tests',
      tools: ['Read', 'Write', 'Edit', 'Bash'],
      body: '# Implementer\n...',
      sourcePath: '.claude/agents/implementer.md',
    };

    assert.strictEqual(agent.id, 'implementer');
    assert.ok(Array.isArray(agent.tools));
    assert.ok(agent.tools.includes('Read'));
    assert.strictEqual(agent.sourcePath, '.claude/agents/implementer.md');
  });
});

describe('SkillDefinition type', () => {
  it('SkillDefinition has all required fields', () => {
    const skill: SkillDefinition = {
      id: 'add-backend-parser',
      name: 'add-backend-parser',
      description: 'Add a new file/format parser to backend',
      body: '# Add Backend Parser\n...',
      sourcePath: '.claude/skills/add-backend-parser/SKILL.md',
    };

    assert.strictEqual(skill.id, 'add-backend-parser');
    assert.strictEqual(skill.name, 'add-backend-parser');
    assert.ok(skill.sourcePath.endsWith('SKILL.md'));
  });
});

describe('Progress types', () => {
  it('ProgressEntry has required timestamp and outcome fields', () => {
    const entry: ProgressEntry = {
      timestamp: '2026-05-10T12:00:00Z',
      featureId: 'infra-01',
      agentRole: 'implementer',
      outcome: 'IMPL READY',
      summary: 'Created shared type definitions',
    };

    assert.strictEqual(entry.featureId, 'infra-01');
    assert.strictEqual(entry.agentRole, 'implementer');
    assert.strictEqual(entry.outcome, 'IMPL READY');
  });

  it('ProgressCurrent allows null for optional fields', () => {
    const current: ProgressCurrent = {
      activeFeature: null,
      startedAt: '2026-05-10T00:00:00Z',
      lastAction: 'session started',
      nextAction: 'pick next feature',
      subagentInFlight: null,
      blocker: null,
    };

    assert.strictEqual(current.activeFeature, null);
    assert.strictEqual(current.subagentInFlight, null);
    assert.strictEqual(current.blocker, null);
  });

  it('ProgressCurrent allows string for active fields', () => {
    const current: ProgressCurrent = {
      activeFeature: 'infra-01',
      startedAt: '2026-05-10T10:00:00Z',
      lastAction: 'dispatched implementer',
      nextAction: 'await impl ready',
      subagentInFlight: 'implementer',
      blocker: null,
    };

    assert.strictEqual(current.activeFeature, 'infra-01');
    assert.strictEqual(current.subagentInFlight, 'implementer');
  });

  it('ImplReport holds files touched and verification steps', () => {
    const report: ImplReport = {
      featureId: 'infra-01',
      title: 'Shared types package baseline',
      whatBuilt: 'Type definitions for all shared types',
      filesTouched: ['packages/shared/src/types/feature.ts', 'packages/shared/src/index.ts'],
      howVerified: ['pnpm typecheck — exit 0', 'pnpm test — 20 tests, 0 failures'],
      openQuestions: 'none',
    };

    assert.strictEqual(report.featureId, 'infra-01');
    assert.ok(Array.isArray(report.filesTouched));
    assert.ok(Array.isArray(report.howVerified));
    assert.strictEqual(report.openQuestions, 'none');
  });

  it('ReviewReport captures verdict and per-criterion pass/fail', () => {
    const verdict: ReviewVerdict = 'APPROVED';
    const review: ReviewReport = {
      featureId: 'infra-01',
      title: 'Shared types package baseline',
      verdict,
      acceptanceCriteria: [
        { text: 'type files exist', passing: true },
        { text: 'build succeeds', passing: true },
      ],
      requiredChanges: '',
    };

    assert.strictEqual(review.verdict, 'APPROVED');
    assert.strictEqual(review.acceptanceCriteria.length, 2);
    const first = review.acceptanceCriteria[0];
    assert.ok(first !== undefined);
    assert.strictEqual(first.passing, true);
  });
});

describe('HarnessState type', () => {
  it('HarnessState can be constructed with empty collections', () => {
    const state: HarnessState = {
      featureList: null,
      agents: [],
      skills: [],
      progressCurrent: null,
      progressHistory: [],
      implReports: {},
      reviewReports: {},
      parseErrors: [],
    };

    assert.strictEqual(state.featureList, null);
    assert.ok(Array.isArray(state.agents));
    assert.strictEqual(state.agents.length, 0);
    assert.ok(Array.isArray(state.skills));
    assert.ok(Array.isArray(state.progressHistory));
    assert.ok(Array.isArray(state.parseErrors));
    assert.deepStrictEqual(state.implReports, {});
    assert.deepStrictEqual(state.reviewReports, {});
  });

  it('HarnessState can hold populated featureList and agents', () => {
    const state: HarnessState = {
      featureList: {
        project: 'h-orchestra',
        description: 'Harness UI',
        rules: [],
        features: [
          {
            id: 'infra-01',
            name: 'shared-types',
            title: 'Shared types baseline',
            description: 'Core types',
            acceptance: [],
            status: 'done',
          },
        ],
      },
      agents: [
        {
          id: 'leader',
          name: 'leader',
          description: 'Orchestrates features',
          tools: ['Agent', 'Read', 'Bash'],
          body: '',
          sourcePath: '.claude/agents/leader.md',
        },
      ],
      skills: [],
      progressCurrent: null,
      progressHistory: [],
      implReports: {},
      reviewReports: {},
      parseErrors: [],
    };

    assert.ok(state.featureList !== null);
    assert.strictEqual(state.featureList.features.length, 1);
    assert.strictEqual(state.agents.length, 1);
    const agent = state.agents[0];
    assert.ok(agent !== undefined);
    assert.strictEqual(agent.id, 'leader');
  });

  it('ParseError line field is optional', () => {
    const withLine: ParseError = { file: 'feature_list.json', message: 'Invalid JSON', line: 42 };
    const withoutLine: ParseError = { file: 'AGENTS.md', message: 'Missing field' };

    assert.strictEqual(withLine.line, 42);
    assert.strictEqual(withoutLine.line, undefined);
  });
});

describe('SSEEvent discriminated union', () => {
  it('harness:changed event has path and timestamp', () => {
    const event: SSEEvent = {
      type: 'harness:changed',
      path: '/mounted-repo/feature_list.json',
      timestamp: '2026-05-10T12:00:00Z',
    };

    assert.strictEqual(event.type, 'harness:changed');
    if (event.type === 'harness:changed') {
      assert.strictEqual(event.path, '/mounted-repo/feature_list.json');
      assert.ok(event.timestamp.length > 0);
    }
  });

  it('feature:updated event has featureId and status', () => {
    const event: SSEEvent = {
      type: 'feature:updated',
      featureId: 'infra-01',
      status: 'done',
    };

    assert.strictEqual(event.type, 'feature:updated');
    if (event.type === 'feature:updated') {
      assert.strictEqual(event.featureId, 'infra-01');
      assert.strictEqual(event.status, 'done');
    }
  });

  it('agent:dispatched event has role discriminator', () => {
    const event: SSEEvent = {
      type: 'agent:dispatched',
      featureId: 'infra-01',
      role: 'implementer',
      timestamp: '2026-05-10T12:00:00Z',
    };

    assert.strictEqual(event.type, 'agent:dispatched');
    if (event.type === 'agent:dispatched') {
      assert.strictEqual(event.role, 'implementer');
    }
  });

  it('heartbeat event has timestamp', () => {
    const event: SSEEvent = {
      type: 'heartbeat',
      timestamp: '2026-05-10T12:00:00Z',
    };

    assert.strictEqual(event.type, 'heartbeat');
    if (event.type === 'heartbeat') {
      assert.ok(event.timestamp.length > 0);
    }
  });

  it('snapshot event wraps a HarnessState', () => {
    const state: HarnessState = {
      featureList: null,
      agents: [],
      skills: [],
      progressCurrent: null,
      progressHistory: [],
      implReports: {},
      reviewReports: {},
      parseErrors: [],
    };

    const event: SSEEvent = { type: 'snapshot', data: state };

    assert.strictEqual(event.type, 'snapshot');
    if (event.type === 'snapshot') {
      assert.strictEqual(event.data.featureList, null);
      assert.ok(Array.isArray(event.data.agents));
    }
  });

  it('SSEEventType covers all five event names', () => {
    const types: SSEEventType[] = [
      'harness:changed',
      'feature:updated',
      'agent:dispatched',
      'heartbeat',
      'snapshot',
    ];
    assert.strictEqual(types.length, 5);
  });
});
