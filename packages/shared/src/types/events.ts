import type {
  HarnessSnapshot,
  FeatureList,
  ProgressEntry,
  SkillDefinition,
  AgentDefinition,
  AgentSystemPrompt,
} from './harness.js';

export type SSEEvent =
  | HarnessSnapshotEvent
  | FileChangedEvent
  | FeatureListUpdatedEvent
  | ProgressUpdatedEvent
  | SkillsUpdatedEvent
  | AgentsUpdatedEvent
  | ProgressCurrentUpdatedEvent
  | ProgressHistoryUpdatedEvent
  | CheckpointsUpdatedEvent
  | ConnectionEvent
  | ErrorEvent;

export interface HarnessSnapshotEvent {
  type: 'harness:snapshot';
  payload: HarnessSnapshot;
}

export interface FileChangedEvent {
  type: 'file:changed';
  payload: {
    path: string;
    eventType: 'add' | 'change' | 'unlink';
    timestamp: string;
  };
}

export interface FeatureListUpdatedEvent {
  type: 'featurelist:updated';
  payload: FeatureList;
}

export interface ProgressUpdatedEvent {
  type: 'progress:updated';
  payload: {
    entries: ProgressEntry[];
    lastEntry: ProgressEntry;
  };
}

export interface SkillsUpdatedEvent {
  type: 'skills:updated';
  payload: SkillDefinition[];
}

export interface AgentsUpdatedEvent {
  type: 'agents:updated';
  payload: AgentDefinition[];
}

export interface ProgressCurrentUpdatedEvent {
  type: 'progress-current:updated';
  payload: { content: string };
}

export interface ProgressHistoryUpdatedEvent {
  type: 'progress-history:updated';
  payload: { entries: ProgressEntry[] };
}

export interface CheckpointsUpdatedEvent {
  type: 'checkpoints:updated';
  payload: AgentSystemPrompt;
}

export interface ConnectionEvent {
  type: 'connection:established' | 'connection:heartbeat';
  payload: { clientId: string; timestamp: string };
}

export interface ErrorEvent {
  type: 'error';
  payload: { code: string; message: string };
}

export type SSEEventType = SSEEvent['type'];

export function isHarnessSnapshotEvent(e: SSEEvent): e is HarnessSnapshotEvent {
  return e.type === 'harness:snapshot';
}

export function isFeatureListEvent(e: SSEEvent): e is FeatureListUpdatedEvent {
  return e.type === 'featurelist:updated';
}

export function isProgressEvent(e: SSEEvent): e is ProgressUpdatedEvent {
  return e.type === 'progress:updated';
}

export function isSkillsEvent(e: SSEEvent): e is SkillsUpdatedEvent {
  return e.type === 'skills:updated';
}

export function isAgentsEvent(e: SSEEvent): e is AgentsUpdatedEvent {
  return e.type === 'agents:updated';
}

export function isProgressCurrentEvent(e: SSEEvent): e is ProgressCurrentUpdatedEvent {
  return e.type === 'progress-current:updated';
}

export function isProgressHistoryEvent(e: SSEEvent): e is ProgressHistoryUpdatedEvent {
  return e.type === 'progress-history:updated';
}

export function isCheckpointsEvent(e: SSEEvent): e is CheckpointsUpdatedEvent {
  return e.type === 'checkpoints:updated';
}

export function isConnectionEvent(e: SSEEvent): e is ConnectionEvent {
  return e.type === 'connection:established' || e.type === 'connection:heartbeat';
}

export function isErrorEvent(e: SSEEvent): e is ErrorEvent {
  return e.type === 'error';
}
