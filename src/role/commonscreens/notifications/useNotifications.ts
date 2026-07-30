// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchNotificationsThunk,
  markNotificationsReadThunk,
  deleteNotificationsThunk,
} from '../../../redux/slices/notificationSlice';

const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, actionLoading, error } = useAppSelector(state => state.notification);
  const [refreshing, setRefreshing] = useState(false);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    await dispatch(fetchNotificationsThunk());
    setRefreshing(false);
  }, [dispatch]);

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
      await dispatch(markNotificationsReadThunk(selectedIds)).unwrap();
      setSelectedIds([]);
    } catch (err) {
      Alert.alert("Error", "Failed to update notifications");
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await dispatch(markNotificationsReadThunk([id])).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
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
            await dispatch(deleteNotificationsThunk(selectedIds)).unwrap();
            setSelectedIds([]);
          } catch (err) {
            Alert.alert("Error", "Failed to delete notifications");
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
    handleMarkSingleRead,
    handleDelete,
    fetchNotifications,
    clearSelection: () => setSelectedIds([])
  };
};

export default useNotifications;