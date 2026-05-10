import type { TracingAdapter } from './index.js';
import type { TracingListResponse, TraceRecord } from '@h-orchestra/shared';
import type { Config } from '../config.js';

export class LangfuseAdapter implements TracingAdapter {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(config: Config) {
    this.baseUrl = config.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com';
    const creds = `${config.LANGFUSE_PUBLIC_KEY ?? ''}:${config.LANGFUSE_SECRET_KEY ?? ''}`;
    this.authHeader = `Basic ${Buffer.from(creds).toString('base64')}`;
  }

  async listTraces(): Promise<TracingListResponse> {
    const res = await fetch(`${this.baseUrl}/api/public/traces?limit=50`, {
      headers: { Authorization: this.authHeader },
    });
    if (!res.ok) throw new Error(`Langfuse API error: ${res.status}`);
    const data = (await res.json()) as { data: unknown[] };
    return {
      traces: data.data.map((t) => this.mapTrace(t)),
      total: data.data.length,
      provider: 'langfuse',
    };
  }

  async getTrace(id: string): Promise<TraceRecord | null> {
    const res = await fetch(`${this.baseUrl}/api/public/traces/${id}`, {
      headers: { Authorization: this.authHeader },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Langfuse API error: ${res.status}`);
    return this.mapTrace(await res.json());
  }

  private mapTrace(raw: unknown): TraceRecord {
    const t = raw as Record<string, unknown>;
    return {
      id: String(t['id'] ?? ''),
      name: String(t['name'] ?? ''),
      startTime: String(t['timestamp'] ?? ''),
      endTime: null,
      durationMs: null,
      status: 'success',
      model: null,
      inputTokens: 0,
      outputTokens: 0,
      totalCost: typeof t['totalCost'] === 'number' ? t['totalCost'] : null,
      spans: [],
      metadata: (t['metadata'] as Record<string, unknown>) ?? {},
    };
  }
}
