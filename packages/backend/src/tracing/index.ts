import type { TracingListResponse, TraceRecord } from '@h-orchestra/shared';
import type { Config } from '../config.js';
import { LangfuseAdapter } from './langfuse.adapter.js';
import { HeliconeAdapter } from './helicone.adapter.js';

export interface TracingAdapter {
  listTraces(): Promise<TracingListResponse>;
  getTrace(id: string): Promise<TraceRecord | null>;
}

export function createTracingAdapter(config: Config): TracingAdapter | null {
  if (config.LANGFUSE_SECRET_KEY && config.LANGFUSE_PUBLIC_KEY) {
    return new LangfuseAdapter(config);
  }
  if (config.HELICONE_API_KEY) {
    return new HeliconeAdapter(config);
  }
  return null;
}
