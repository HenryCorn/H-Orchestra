import type { TracingAdapter } from './index.js';
import type { TracingListResponse, TraceRecord } from '@h-orchestra/shared';
import type { Config } from '../config.js';

export class HeliconeAdapter implements TracingAdapter {
  private readonly apiKey: string;

  constructor(config: Config) {
    this.apiKey = config.HELICONE_API_KEY ?? '';
  }

  async listTraces(): Promise<TracingListResponse> {
    const res = await fetch('https://www.helicone.ai/api/request/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit: 50, offset: 0 }),
    });
    if (!res.ok) throw new Error(`Helicone API error: ${res.status}`);
    const data = (await res.json()) as { data: unknown[] };
    return {
      traces: data.data.map((r) => this.mapRequest(r)),
      total: data.data.length,
      provider: 'helicone',
    };
  }

  async getTrace(id: string): Promise<TraceRecord | null> {
    const res = await fetch(`https://www.helicone.ai/api/request/${id}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Helicone API error: ${res.status}`);
    return this.mapRequest(await res.json());
  }

  private mapRequest(raw: unknown): TraceRecord {
    const r = raw as Record<string, unknown>;
    const resp = r['response'] as Record<string, unknown> | undefined;
    const usage = resp?.['usage'] as Record<string, unknown> | undefined;
    return {
      id: String(r['id'] ?? ''),
      name: String((r['request'] as Record<string, unknown> | undefined)?.['model'] ?? 'request'),
      startTime: String(r['created_at'] ?? ''),
      endTime: null,
      durationMs:
        typeof r['delay_ms'] === 'number' ? r['delay_ms'] : null,
      status: resp ? 'success' : 'running',
      model: String((r['request'] as Record<string, unknown> | undefined)?.['model'] ?? ''),
      inputTokens: Number(usage?.['prompt_tokens'] ?? 0),
      outputTokens: Number(usage?.['completion_tokens'] ?? 0),
      totalCost: typeof r['cost_usd'] === 'number' ? r['cost_usd'] : null,
      spans: [],
      metadata: {},
    };
  }
}
