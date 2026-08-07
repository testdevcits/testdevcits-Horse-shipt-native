import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  const [activeTab, setActiveTab] = useState<ShipmentTab>('Upcoming');

  const fetchShipments = useCallback(
    async (isRefresh = false) => {
      dispatch(fetchCustomerShipments(isRefresh));
    },
    [dispatch],
  );

  useEffect(() => {
    if (lastFetched === null) {
      fetchShipments(false);
    }
  }, [fetchShipments, lastFetched]);

  useFocusEffect(
    useCallback(() => {
      fetchShipments(true);
    }, [fetchShipments]),
  );

  const filteredData = useMemo(() => {
    switch (activeTab) {
      case 'Upcoming':
        return shipments.filter(
          item =>
            item?.publish !== false &&
            (item?.status === 'open_for_offers' ||
              (item?.status === 'assigned' && !item?.isInProgress)),
        );

      case 'Draft':
        return shipments.filter(
          item =>
            item?.publish === false ||
            (item?.status || '').toLowerCase() === 'draft',
        );

      case 'In Progress':
        return shipments.filter(
          item =>
            item?.isInProgress ||
            (item?.status || '').toLowerCase() === 'in_progress' ||
            (item?.status || '').toLowerCase() === 'in_transit',
        );

      case 'Completed':
        return shipments.filter(
          item =>
            item?.isCompleted ||
            (item?.status || '').toLowerCase() === 'completed' ||
            (item?.status || '').toLowerCase() === 'delivered',
        );

      case 'Cancelled':
        return shipments.filter(
          item => (item?.status || '').toLowerCase() === 'cancelled',
        );

      default:
        return shipments;
    }
  }, [shipments, activeTab]);

  const counts = useMemo(
    () => ({
      Upcoming: shipments.filter(
        item =>
          item?.publish !== false &&
          (item?.status === 'open_for_offers' ||
            (item?.status === 'assigned' && !item?.isInProgress)),
      ).length,

      Draft: shipments.filter(
        item =>
          item?.publish === false ||
          (item?.status || '').toLowerCase() === 'draft',
      ).length,

      InProgress: shipments.filter(
        item =>
          item?.isInProgress ||
          (item?.status || '').toLowerCase() === 'in_progress' ||
          (item?.status || '').toLowerCase() === 'in_transit',
      ).length,

      Completed: shipments.filter(
        item =>
          item?.isCompleted ||
          (item?.status || '').toLowerCase() === 'completed' ||
          (item?.status || '').toLowerCase() === 'delivered',
      ).length,

      Cancelled: shipments.filter(
        item => (item?.status || '').toLowerCase() === 'cancelled',
      ).length,
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