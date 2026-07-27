import { useState, useEffect, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';

export const useShipperDetails = (shipperId: string) => {
  const [shipper, setShipper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchDetails = useCallback(
    async (isRefresh = false) => {
      if (!shipperId) return;

      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(null); // Clear previous errors before fetching

        const res = await customerService.getShipperProfile(shipperId);

        if (res.success) {
          setShipper(res.data);
        } else {
          // Handle cases where API returns success: false
          setError(res.message || 'Failed to load shipper profile');
        }
      } catch (e: any) {
        console.error('Error fetching shipper details:', e);
        // Extract error message from API response or generic error
        setError(
          e?.response?.data?.message ||
            e.message ||
            'An unexpected error occurred',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [shipperId],
  );

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    shipper,
    loading,
    refreshing,
    error, // Return error state
    refresh: () => fetchDetails(true),
  };
};

export default useShipperDetails;
