import { useState, useEffect, useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetchNotificationsThunk,
  markNotificationsReadThunk,
  deleteNotificationsThunk,
} from '../../../redux/slices/notificationSlice';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';

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
      showSuccessToast(
        'Marked as Read',
        `${selectedIds.length} notification(s) marked as read`,
      );
      setSelectedIds([]);
    } catch (err: any) {
      showErrorToast('Error', `${err} || 'Failed to update notifications'`);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) return;
    try {
      await dispatch(markNotificationsReadThunk(unreadIds)).unwrap();

      showSuccessToast('All Read', 'All notifications marked as read');
      setSelectedIds([]);
    } catch (err: any) {
      showErrorToast('Error', `${err} || 'Failed to mark all as read'`);
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
    const idsToDelete =
      targetIds && targetIds.length > 0 ? targetIds : selectedIds;
    if (idsToDelete.length === 0) return;
    try {
      await dispatch(deleteNotificationsThunk(idsToDelete)).unwrap();

      showSuccessToast(
        'Deleted',
        `${idsToDelete.length} notification(s) removed`,
      );
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    } catch (err: any) {
      showErrorToast('Error', `${err} || 'Failed to delete notifications' `);
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
