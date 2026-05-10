export const SSE_EVENTS = {
  HARNESS_CHANGED: 'harness:changed',
  FEATURE_UPDATED: 'feature:updated',
  AGENT_DISPATCHED: 'agent:dispatched',
  HEARTBEAT: 'heartbeat',
  SNAPSHOT: 'snapshot',
} as const;

export type SSEEventName = (typeof SSE_EVENTS)[keyof typeof SSE_EVENTS];
