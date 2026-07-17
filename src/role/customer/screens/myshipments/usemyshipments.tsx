import { useState, useEffect, useMemo, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';
 
export type ShipmentTab = 'Upcoming' | 'Draft' | 'In Progress' | 'Completed' | 'Cancelled';

const useMyShipments = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ShipmentTab>('In Progress');

  const fetchShipments = useCallback(async () => {
    try {
      // Assuming this service fetches all customer shipments
      const response = await customerService.getMyShipments();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  // Logic to filter shipments based on backend status flags
  const filteredData = useMemo(() => {
    return shipments.filter((item) => {
      switch (activeTab) {
        case 'In Progress': return item.isInProgress;
        case 'Completed': return item.isCompleted;
        case 'Draft': return !item.publish;
        case 'Upcoming': return item.status === 'assigned' && !item.isInProgress;
        case 'Cancelled': return item.status === 'cancelled';
        default: return true;
      }
    });
  }, [shipments, activeTab]);

  // Counts for the badges in the tabs
  const counts = useMemo(() => ({
    Upcoming: shipments.filter(i => i.status === 'assigned' && !i.isInProgress).length,
    Draft: shipments.filter(i => !i.publish).length,
    InProgress: shipments.filter(i => i.isInProgress).length,
    Completed: shipments.filter(i => i.isCompleted).length,
    Cancelled: shipments.filter(i => i.status === 'cancelled').length,
  }), [shipments]);

  return { filteredData, loading, refreshing, activeTab, setActiveTab, counts, fetchShipments };
};

export default useMyShipments;