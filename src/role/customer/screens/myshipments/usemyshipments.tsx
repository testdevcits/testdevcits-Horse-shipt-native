import { useState, useEffect, useMemo, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';

export type ShipmentTab =
  | 'Upcoming'
  | 'Draft'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

const useMyShipments = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ShipmentTab>('In Progress');

  const fetchShipments = useCallback(async () => {
    try {
      const response = await customerService.getMyShipments();

      if (response.success) {
        setShipments(response.shipments ?? []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

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