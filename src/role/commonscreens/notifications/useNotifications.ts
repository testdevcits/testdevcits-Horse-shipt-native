// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import customerService from '../../../api/services/customerService';
import { NotificationActivity } from '../../../types/notification';
 

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const res = await customerService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Unable to load notifications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredData = useMemo(() => {
    return notifications.filter(n => activeFilter === 'all' || !n.read);
  }, [notifications, activeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(n => n._id));
    }
  };

  const handleMarkRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading(true);
      await customerService.markAsRead(selectedIds);
      setNotifications(prev => prev.map(n => 
        selectedIds.includes(n._id) ? { ...n, read: true } : n
      ));
      setSelectedIds([]);
    } catch (err) {
      Alert.alert("Error", "Failed to update notifications");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    Alert.alert("Delete", `Delete ${selectedIds.length} notifications?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            setActionLoading(true);
            await customerService.deleteNotifications(selectedIds);
            setNotifications(prev => prev.filter(n => !selectedIds.includes(n._id)));
            setSelectedIds([]);
          } catch (err) {
            Alert.alert("Error", "Failed to delete notifications");
          } finally {
            setActionLoading(false);
          }
        }
      }
    ]);
  };

  return {
    notifications: filteredData,
    loading,
    refreshing,
    actionLoading,
    error,
    activeFilter,
    setActiveFilter,
    selectedIds,
    toggleSelect,
    selectAll,
    handleMarkRead,
    handleDelete,
    fetchNotifications,
    clearSelection: () => setSelectedIds([])
  };
};

export default useNotifications;