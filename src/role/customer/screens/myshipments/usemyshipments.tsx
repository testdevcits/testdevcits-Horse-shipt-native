import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchCustomerShipments } from '../../../../redux/slices/customerShipmentSlice';

export type ShipmentTab =
  | 'Upcoming'
  | 'Draft'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

const useMyShipments = () => {
  const dispatch = useAppDispatch();
  const { shipments, loading, refreshing, lastFetched } = useAppSelector(
    state => state.customerShipments,
  );
  const [activeTab, setActiveTab] = useState<ShipmentTab>('In Progress');

  const fetchShipments = useCallback(
    async (isRefresh = false) => {
      dispatch(fetchCustomerShipments(isRefresh));
    },
    [dispatch],
  );

  useEffect(() => {
    if (lastFetched === null || shipments.length === 0) {
      fetchShipments(false);
    }
  }, [fetchShipments, lastFetched, shipments.length]);

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'Upcoming':
        return shipments.filter(
          item =>
            item?.status === 'open_for_offers' ||
            (item?.status === 'assigned' && !item?.isInProgress),
        );

      case 'Draft':
        return shipments.filter(item => !item?.publish);

      case 'In Progress':
        return shipments.filter(item => item?.isInProgress);

      case 'Completed':
        return shipments.filter(item => item?.isCompleted);

      case 'Cancelled':
        return shipments.filter(item => item?.status === 'cancelled');

      default:
        return shipments;
    }
  }, [shipments, activeTab]);

  const counts = useMemo(
    () => ({
      Upcoming: shipments.filter(
        item =>
          item?.status === 'open_for_offers' ||
          (item?.status === 'assigned' && !item?.isInProgress),
      ).length,

      Draft: shipments.filter(item => !item?.publish).length,

      InProgress: shipments.filter(item => item?.isInProgress).length,

      Completed: shipments.filter(item => item?.isCompleted).length,

      Cancelled: shipments.filter(item => item?.status === 'cancelled').length,
    }),
    [shipments],
  );

  return {
    filteredData,
    loading,
    refreshing,
    activeTab,
    setActiveTab,
    counts,
    fetchShipments,
  };
};

export default useMyShipments;