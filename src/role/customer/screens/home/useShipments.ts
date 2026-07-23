import { useState, useEffect, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';

export const useShipments = () => {
  const [shipments, setSetShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShipments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await customerService.getMyShipments();
      if (res.success) {
        // Optionally sort by newest first if the API doesn't
        setSetShipments(res.shipments);
      }
    } catch (e) {
      console.error('Error fetching shipments:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return {
    shipments,
    loading,
    refreshing,
    refresh: fetchShipments,
  };
};
