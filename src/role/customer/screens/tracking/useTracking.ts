// screens/tracking/useTracking.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { getLiveTracking, TrackingResponse } from '../../../../api/services/trackingService';

export const useTracking = (shipmentId: string) => {
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (!shipmentId) return;
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await getLiveTracking(shipmentId);
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("Live Tracking API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shipmentId]);

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

  return { data, loading, refreshing, refetch: () => fetchData(true) };
};