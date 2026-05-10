/**
 * @h-orchestra/shared
 *
 * Cross-package types and constants.
 */
export const VERSION = '0.0.0';

export type { FeatureStatus, Feature, FeatureList } from './types/feature.js';
export type { AgentDefinition } from './types/agent.js';
export type { SkillDefinition } from './types/skill.js';
export type {
  ProgressEntry,
  ProgressCurrent,
  ImplReport,
  ReviewVerdict,
  ReviewReport,
} from './types/progress.js';
export type { ParseError, HarnessState } from './types/harness.js';
export type { SSEEventType, SSEEvent } from './types/events.js';
export { SSE_EVENTS } from './constants/sse-events.js';
export type { SSEEventName } from './constants/sse-events.js';
export { normalizeMountPath, resolveHarnessFile } from './util/paths.js';
export { Ok, Err, isOk, isErr } from './util/result.js';
export type { Result } from './util/result.js';
export { ParserErrorCode, RouteErrorCode } from './errors.js';
export type { ParserError, RouteError, AppError } from './errors.js';
