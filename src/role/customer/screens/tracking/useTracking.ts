// screens/tracking/useTracking.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getLiveTracking,
  TrackingResponse,
} from '../../../../api/services/trackingService';

export const useTracking = (shipmentId: string) => {
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (!shipmentId) return;
      if (isManualRefresh) setRefreshing(true);
      try {
        setError(null);
        setStatusCode(null);
        const res = await getLiveTracking(shipmentId);
        if (res) {
          setData(res);
        }
      } catch (err: any) {
        console.error('Live Tracking API Error:', err);
        setError(err);
        const status =
          err?.status ||
          err?.response?.status ||
          (typeof err === 'object' && String(err?.message || '').includes('500')
            ? 500
            : 500);
        setStatusCode(status);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [shipmentId],
  );

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds for real-time driver movement updates
    pollInterval.current = setInterval(() => {
      fetchData(false);
    }, 10000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    refreshing,
    error,
    statusCode,
    isServerError: statusCode === 500,
    refetch: () => fetchData(true),
  };
};

