import React, { lazy, Suspense, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';

import { BellOff } from 'lucide-react-native';
import { COLORS } from '../../../constants';
import useNotifications from './useNotifications';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ErrorView,
} from '../../../components';
import styles from './styles.notification';
import AppIcon from '../../../components/app_icon/AppIcon';
import { useNavigation } from '@react-navigation/native';
import NotificationItemCard from './components/NotificationItemCard';
import NotificationFilterBar from './components/NotificationFilterBar';
import NotificationBatchActionBar from './components/NotificationBatchActionBar';

const ConfirmationModal = lazy(
  () =>
    import('../../../components/common/ConfirmationModal/ConfirmationModal'),
);

const Notifications = () => {
  const navigation: any = useNavigation();
  const {
    allNotifications,
    notifications,
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
  } = useNotifications();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [targetIdToDelete, setTargetIdToDelete] = useState<string | null>(null);

  const isSelectionMode = selectedIds.length > 0;

  const handleInitiateDeleteSelected = () => {
    setTargetIdToDelete(null);
    setIsDeleteModalVisible(true);
  };

  const handleInitiateDeleteSingle = (id: string) => {
    setTargetIdToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    const ids = targetIdToDelete ? [targetIdToDelete] : selectedIds;
    setIsDeleteModalVisible(false);
    setTargetIdToDelete(null);
    await handleDeleteNotifications(ids);
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const isSelected = selectedIds.includes(item?._id);
    return (
      <NotificationItemCard
        item={item}
        isSelected={isSelected}
        isSelectionMode={isSelectionMode}
        onToggleSelect={toggleSelect}
        onMarkSingleRead={handleMarkSingleRead}
        onInitiateDeleteSingle={handleInitiateDeleteSingle}
        navigation={navigation}
      />
    );
  };

  if (loading && !refreshing && allNotifications.length === 0) {
    return <AppLoader visible={true} />;
  }

  if (error && allNotifications.length === 0) {
    return <ErrorView message={error} onRetry={() => fetchNotifications()} />;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <AppHeader
        showBack={true}
        title="Notifications"
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.headerMarkReadBtn}
              onPress={handleMarkAllRead}
              activeOpacity={0.8}
            >
              <AppIcon
                name={'CheckCheck'}
                size={18}
                color={COLORS.brandBrown}
                style={{ marginRight: 4 }}
              />
              <AppText style={styles.headerMarkReadText}>Mark all read</AppText>
            </TouchableOpacity>
          ) : undefined
        }
        showProfileImage={false}
        showNotificationIcon={false}
      />

      <AppLoader visible={actionLoading} />

      {/* TOP SUMMARY & SEGMENTED FILTER TABS */}
      <NotificationFilterBar
        unreadCount={unreadCount}
        activeFilter={activeFilter}
        allCount={allCount}
        readCount={readCount}
        onSelectFilter={setActiveFilter}
      />

      {/* NOTIFICATIONS LIST */}
      <FlatList
        data={notifications}
        keyExtractor={item => item?._id || String(Math.random())}
        renderItem={renderNotificationItem}
        contentContainerStyle={[
          styles.listContainer,
          isSelectionMode && { paddingBottom: 110 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNotifications(true)}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={BellOff}
              title="No Notifications"
              message={
                activeFilter === 'all'
                  ? "You're all caught up! No notifications to show right now."
                  : activeFilter === 'unread'
                  ? 'No unread notifications.'
                  : 'No read notifications found.'
              }
            />
          ) : null
        }
      />

      {/* FLOATING BATCH ACTION BAR */}
      {isSelectionMode && (
        <NotificationBatchActionBar
          selectedCount={selectedIds.length}
          totalNotifications={notifications.length}
          onSelectAll={selectAll}
          onMarkSelectedRead={handleMarkSelectedRead}
          onInitiateDeleteSelected={handleInitiateDeleteSelected}
          onClearSelection={clearSelection}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          type="danger"
          title="Delete Notifications?"
          description={
            targetIdToDelete
              ? 'Are you sure you want to delete this notification?'
              : `Are you sure you want to delete ${selectedIds.length} selected notification(s)? This action cannot be undone.`
          }
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={actionLoading}
          onClose={() => {
            if (!actionLoading) {
              setIsDeleteModalVisible(false);
              setTargetIdToDelete(null);
            }
          }}
          onConfirm={handleConfirmDelete}
        />
      </Suspense>
    </View>
  );
};

export default Notifications;
