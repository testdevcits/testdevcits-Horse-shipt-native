import { useState, useEffect, useCallback, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchNotificationsThunk,
  markNotificationsReadThunk,
  deleteNotificationsThunk,
} from '../../../redux/slices/notificationSlice';

export type NotificationFilter = 'all' | 'unread' | 'read';

const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, actionLoading, error } = useAppSelector(
    state => state.notification,
  );
  const [refreshing, setRefreshing] = useState(false);

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchNotifications = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      await dispatch(fetchNotificationsThunk({ isRefresh }));
      setRefreshing(false);
    },
    [dispatch],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const allCount = notifications.length;
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );
  const readCount = useMemo(
    () => notifications.filter(n => n.read).length,
    [notifications],
  );

  const filteredData = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'read') return n.read;
      return true;
    });
  }, [notifications, activeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredData?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData?.map(n => n._id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const handleMarkSelectedRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      await dispatch(markNotificationsReadThunk(selectedIds)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Marked as Read',
        text2: `${selectedIds.length} notification(s) marked as read`,
      });
      setSelectedIds([]);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err || 'Failed to update notifications',
      });
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) return;
    try {
      await dispatch(markNotificationsReadThunk(unreadIds)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'All Read',
        text2: 'All notifications marked as read',
      });
      setSelectedIds([]);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err || 'Failed to mark all as read',
      });
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await dispatch(markNotificationsReadThunk([id])).unwrap();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleDeleteNotifications = async (targetIds?: string[]) => {
    const idsToDelete = targetIds && targetIds.length > 0 ? targetIds : selectedIds;
    if (idsToDelete.length === 0) return;
    try {
      await dispatch(deleteNotificationsThunk(idsToDelete)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: `${idsToDelete.length} notification(s) removed`,
      });
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err || 'Failed to delete notifications',
      });
    }
  };

  return {
    allNotifications: notifications,
    notifications: filteredData,
    loading,
    refreshing,
    actionLoading,
    error,
    activeFilter,
    setActiveFilter,
    selectedIds,
    allCount,
    unreadCount,
    readCount,
    toggleSelect,
    selectAll,
    clearSelection,
    handleMarkSelectedRead,
    handleMarkAllRead,
    handleMarkSingleRead,
    handleDeleteNotifications,
    fetchNotifications,
  };
};

export default useNotifications;