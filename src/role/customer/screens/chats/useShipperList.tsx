import { useState, useEffect, useCallback, useMemo } from 'react';
import customerService from '../../../../api/services/customerService';
 
const useShipperList = () => {
  const [shippers, setShippers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Online' | 'Offline'>('All');

  const fetchShippers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customerService.getChatShippers();
      if (res.success) setShippers(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchShippers(); }, [fetchShippers]);

  const filteredShippers = useMemo(() => {
    return shippers.filter(s => {
      // Search matches either shipper name or shipment code
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.shipmentCode.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter matches Online/Offline status
      const matchesStatus = 
        activeFilter === 'All' ? true : 
        activeFilter === 'Online' ? s.isOnline : !s.isOnline;

      return matchesSearch && matchesStatus;
    });
  }, [shippers, searchQuery, activeFilter]);

  return {
    shippers: filteredShippers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    refresh: fetchShippers
  };
};

export default useShipperList;