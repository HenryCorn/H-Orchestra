import { useEffect, useRef, useState } from 'react';
import { SSE_EVENT_TYPES } from '@h-orchestra/shared';
import type { SSEEvent } from '@h-orchestra/shared';
import { useHarnessStore } from '../stores/harness.store';
import { api } from '../api/client';

export type SSEStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export function useSSE(): { status: SSEStatus } {
  const [status, setStatus] = useState<SSEStatus>('connecting');
  const dispatch = useHarnessStore((s) => s.dispatch);
  const setSnapshot = useHarnessStore((s) => s.setSnapshot);
  const retryDelayRef = useRef(1000);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let es: EventSource;
    let unmounted = false;

    const connect = () => {
      if (unmounted) return;
      setStatus('connecting');
      es = new EventSource('/api/events');

      es.onopen = () => {
        if (unmounted) return;
        setStatus('connected');
        retryDelayRef.current = 1000;

        // Fetch full snapshot on (re)connect
        api.harness.snapshot().then(setSnapshot).catch(console.error);
      };

      es.onerror = () => {
        if (unmounted) return;
        setStatus('reconnecting');
        es.close();
        const delay = retryDelayRef.current;
        retryDelayRef.current = Math.min(delay * 2, 30_000);
        retryTimeoutRef.current = setTimeout(connect, delay);
      };

      for (const type of SSE_EVENT_TYPES) {
        es.addEventListener(type, (e: MessageEvent) => {
          if (unmounted) return;
          try {
            const event = JSON.parse(e.data as string) as SSEEvent;
            dispatch(event);
          } catch (err) {
            console.error('SSE parse error:', err);
          }
        });
      }
    };

    connect();

    return () => {
      unmounted = true;
      es?.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [dispatch, setSnapshot]);

  return { status };
}
