import { useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';
import type { Scan } from '../types';

interface UseScanPollerResult {
  scan: Scan | null;
  isPolling: boolean;
  error: string | null;
}

/** Polls GET /api/v1/scans/:scanId every intervalMs until status is completed/failed or maxAttempts is reached. */
export function useScanPoller(
  scanId: string | null,
  intervalMs = 3000,
  maxAttempts = 20,
): UseScanPollerResult {
  const [scan, setScan] = useState<Scan | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!scanId) {
      setScan(null);
      setIsPolling(false);
      setError(null);
      attemptsRef.current = 0;
      return;
    }

    setIsPolling(true);
    setError(null);
    attemptsRef.current = 0;

    const stop = () => {
      setIsPolling(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const poll = async () => {
      attemptsRef.current += 1;
      try {
        const res = await apiClient.get<Scan | { data: Scan }>(`/api/v1/scans/${scanId}`);
        const data = (res.data as { data?: Scan }).data ?? (res.data as Scan);
        setScan(data);
        if (data.status === 'completed' || data.status === 'failed') {
          stop();
        } else if (attemptsRef.current >= maxAttempts) {
          stop();
        }
      } catch (err) {
        setError((err as Error).message ?? 'Polling failed');
        stop();
      }
    };

    poll();
    timerRef.current = setInterval(poll, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [scanId, intervalMs, maxAttempts]);

  return { scan, isPolling, error };
}
