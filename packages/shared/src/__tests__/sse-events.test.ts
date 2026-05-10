import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { SSE_EVENTS } from '../constants/sse-events.js';
import type { SSEEventName } from '../constants/sse-events.js';
import type { SSEEvent } from '../types/events.js';

describe('SSE_EVENTS constants', () => {
  it('exports exactly five event name constants', () => {
    const values = Object.values(SSE_EVENTS);
    assert.strictEqual(values.length, 5);
  });

  it('HARNESS_CHANGED maps to "harness:changed"', () => {
    assert.strictEqual(SSE_EVENTS.HARNESS_CHANGED, 'harness:changed');
  });

  it('FEATURE_UPDATED maps to "feature:updated"', () => {
    assert.strictEqual(SSE_EVENTS.FEATURE_UPDATED, 'feature:updated');
  });

  it('AGENT_DISPATCHED maps to "agent:dispatched"', () => {
    assert.strictEqual(SSE_EVENTS.AGENT_DISPATCHED, 'agent:dispatched');
  });

  it('HEARTBEAT maps to "heartbeat"', () => {
    assert.strictEqual(SSE_EVENTS.HEARTBEAT, 'heartbeat');
  });

  it('SNAPSHOT maps to "snapshot"', () => {
    assert.strictEqual(SSE_EVENTS.SNAPSHOT, 'snapshot');
  });
});

describe('SSEEvent variants paired with SSE_EVENTS constants', () => {
  it('harness:changed event type equals SSE_EVENTS.HARNESS_CHANGED', () => {
    const event: SSEEvent = {
      type: SSE_EVENTS.HARNESS_CHANGED,
      path: '/repo/feature_list.json',
      timestamp: '2026-05-10T12:00:00Z',
    };
    assert.strictEqual(event.type, SSE_EVENTS.HARNESS_CHANGED);
    assert.strictEqual(event.type, 'harness:changed');
  });

  it('feature:updated event type equals SSE_EVENTS.FEATURE_UPDATED', () => {
    const event: SSEEvent = {
      type: SSE_EVENTS.FEATURE_UPDATED,
      featureId: 'infra-02',
      status: 'in_progress',
    };
    assert.strictEqual(event.type, SSE_EVENTS.FEATURE_UPDATED);
    assert.strictEqual(event.type, 'feature:updated');
  });

  it('agent:dispatched event type equals SSE_EVENTS.AGENT_DISPATCHED', () => {
    const event: SSEEvent = {
      type: SSE_EVENTS.AGENT_DISPATCHED,
      featureId: 'infra-02',
      role: 'implementer',
      timestamp: '2026-05-10T12:00:00Z',
    };
    assert.strictEqual(event.type, SSE_EVENTS.AGENT_DISPATCHED);
    assert.strictEqual(event.type, 'agent:dispatched');
  });

  it('heartbeat event type equals SSE_EVENTS.HEARTBEAT', () => {
    const event: SSEEvent = {
      type: SSE_EVENTS.HEARTBEAT,
      timestamp: '2026-05-10T12:00:00Z',
    };
    assert.strictEqual(event.type, SSE_EVENTS.HEARTBEAT);
    assert.strictEqual(event.type, 'heartbeat');
  });

  it('snapshot event type equals SSE_EVENTS.SNAPSHOT', () => {
    const event: SSEEvent = {
      type: SSE_EVENTS.SNAPSHOT,
      data: {
        featureList: null,
        agents: [],
        skills: [],
        progressCurrent: null,
        progressHistory: [],
        implReports: {},
        reviewReports: {},
        parseErrors: [],
      },
    };
    assert.strictEqual(event.type, SSE_EVENTS.SNAPSHOT);
    assert.strictEqual(event.type, 'snapshot');
  });

  it('all SSE_EVENTS values appear as valid SSEEventName', () => {
    // Runtime check: every constant value can be assigned to SSEEventName.
    // The compile-time exhaustiveness checks in events.ts enforce the inverse.
    const names: SSEEventName[] = Object.values(SSE_EVENTS);
    assert.strictEqual(names.length, 5);
    assert.ok(names.includes('harness:changed'));
    assert.ok(names.includes('feature:updated'));
    assert.ok(names.includes('agent:dispatched'));
    assert.ok(names.includes('heartbeat'));
    assert.ok(names.includes('snapshot'));
  });
});
