import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchCustomerShipments } from '../../../../redux/slices/customerShipmentSlice';

export const useShipments = () => {
  const dispatch = useAppDispatch();
  const { shipments, loading, refreshing, lastFetched } = useAppSelector(
    state => state.customerShipments,
  );

  const fetchShipments = useCallback(
    async (isRefresh = false) => {
      dispatch(fetchCustomerShipments(isRefresh));
    },
    [dispatch],
  );

  useEffect(() => {
    // Only fetch if not fetched yet (lastFetched is null)
    if (lastFetched === null) {
      fetchShipments(false);
    }
  }, [fetchShipments, lastFetched]);

  return {
    shipments,
    loading,
    refreshing,
    refresh: (isRefresh?: boolean) => fetchShipments(isRefresh ?? true),
  };
};
