import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { TracingListResponse, TraceRecord } from '@h-orchestra/shared';

export function useTracingList() {
  const [data, setData] = useState<TracingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.tracing
      .list()
      .then(setData)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useTrace(id: string | null) {
  const [trace, setTrace] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) { setTrace(null); return; }
    setLoading(true);
    api.tracing.get(id)
      .then(setTrace)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return { trace, loading };
}
