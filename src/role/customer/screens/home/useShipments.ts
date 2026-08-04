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
    // If not fetched yet or empty, trigger fetch
    if (lastFetched === null || shipments.length === 0) {
      fetchShipments(false);
    }
  }, [fetchShipments, lastFetched, shipments.length]);

  return {
    shipments,
    loading,
    refreshing,
    refresh: (isRefresh?: boolean) => fetchShipments(isRefresh ?? true),
  };
};
