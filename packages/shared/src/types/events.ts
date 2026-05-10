import type { FeatureStatus } from './feature.js';
import type { HarnessState } from './harness.js';
import type { SSEEventName } from '../constants/sse-events.js';

export type SSEEventType =
  | 'harness:changed'
  | 'feature:updated'
  | 'agent:dispatched'
  | 'heartbeat'
  | 'snapshot';

export type SSEEvent =
  | { type: 'harness:changed'; path: string; timestamp: string }
  | { type: 'feature:updated'; featureId: string; status: FeatureStatus }
  | {
      type: 'agent:dispatched';
      featureId: string;
      role: 'implementer' | 'reviewer';
      timestamp: string;
    }
  | { type: 'heartbeat'; timestamp: string }
  | { type: 'snapshot'; data: HarnessState };

// Compile-time assertion: every SSEEventName has a variant, every variant has a constant.
// If either line produces `never`, the pairing is broken.
type _AssertAllEventsHaveConstant = SSEEvent['type'] extends SSEEventName ? true : never;
type _AssertAllConstantsHaveEvent = SSEEventName extends SSEEvent['type'] ? true : never;
