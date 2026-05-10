export type TracingProvider = 'langfuse' | 'helicone' | 'none';

export interface TracingConfig {
  provider: TracingProvider;
  apiKey: string;
  publicKey?: string;
  baseUrl?: string;
  projectId?: string;
}

export interface TraceRecord {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  durationMs: number | null;
  status: 'running' | 'success' | 'error';
  model: string | null;
  inputTokens: number;
  outputTokens: number;
  totalCost: number | null;
  spans: SpanRecord[];
  metadata: Record<string, unknown>;
}

export interface SpanRecord {
  id: string;
  parentId: string | null;
  name: string;
  startTime: string;
  endTime: string | null;
  durationMs: number | null;
  attributes: Record<string, unknown>;
  status: 'running' | 'success' | 'error';
}

export interface TracingListResponse {
  traces: TraceRecord[];
  total: number;
  provider: TracingProvider;
}
