// screens/tracking/useTracking.ts
import { useState, useEffect, useRef } from 'react';
import { getLiveTracking, TrackingResponse } from '../../../../api/services/trackingService';
 
export const useTracking = (shipmentId: string) => {
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      const res = await getLiveTracking(shipmentId);
      setData(res);
    } catch (err) {
      console.error("Tracking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 15 seconds
    pollInterval.current = setInterval(fetchData, 15000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [shipmentId]);

  return { data, loading, refetch: fetchData };
};