import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Package,
  Truck,
  MessageSquare,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { formatDate } from '../../../utils/helpers';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE, ICON_SIZE } from '../../../constants';
import useNotifications, { NotificationFilter } from './useNotifications';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ErrorView,
  ConfirmationModal,
} from '../../../components';

// Helper to determine notification icon based on content
const getNotificationIcon = (title: string = '', message: string = '') => {
  const content = (title + ' ' + message).toLowerCase();
  if (content.includes('quote') || content.includes('offer') || content.includes('bid')) {
    return { Icon: FileText, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
  }
  if (content.includes('chat') || content.includes('message') || content.includes('question')) {
    return { Icon: MessageSquare, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
  }
  if (
    content.includes('shipment') ||
    content.includes('deliver') ||
    content.includes('pickup') ||
    content.includes('transit')
  ) {
    return { Icon: Truck, color: COLORS.brandBrown, bg: '#FAF6EE', border: '#EEDCBD' };
  }
  return { Icon: Bell, color: COLORS.brandBrown, bg: '#FAF6EE', border: '#EEDCBD' };
};

const Notifications = () => {
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
    const isUnread = !item?.read;
    const formattedTime = formatDate(
      item?.createdAt || item?.createdAtDate || new Date(),
      'MMM DD, YYYY • h:mm A',
    );

    const iconData = getNotificationIcon(item?.title, item?.message);
    const IconComp = iconData.Icon;

    return (
      <TouchableOpacity
        style={[
          styles.notifCard,
          isUnread ? styles.notifCardUnread : styles.notifCardRead,
          isSelected && styles.notifCardSelected,
        ]}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelect(item?._id);
          } else if (isUnread) {
            handleMarkSingleRead(item?._id);
          }
        }}
        onLongPress={() => toggleSelect(item?._id)}
        activeOpacity={0.85}
      >
        {/* Left Accent Strip for Unread */}
        {isUnread && <View style={styles.unreadAccentBar} />}

        {/* Checkbox / Selection Circle */}
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          onPress={() => toggleSelect(item?._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isSelected ? (
            <CheckCircle2 size={20} color={COLORS.brandBrown} fill="#FAF6EE" />
          ) : (
            <View style={styles.checkboxUncheckedCircle} />
          )}
        </TouchableOpacity>

        {/* Icon Badge */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconData.bg, borderColor: iconData.border },
          ]}
        >
          <IconComp size={20} color={iconData.color} />
        </View>

        {/* Text Content */}
        <View style={styles.notifTextCol}>
          <View style={styles.titleRow}>
            <AppText
              style={[styles.notifTitle, isUnread && styles.notifTitleUnread]}
              numberOfLines={1}
            >
              {item?.title || 'Notification'}
            </AppText>

            {/* Unread Pill Badge */}
            {isUnread && <View style={styles.unreadDot} />}
          </View>

          <AppText style={styles.notifMsg} numberOfLines={2}>
            {item?.message}
          </AppText>

          <AppText style={styles.notifTime}>{formattedTime}</AppText>
        </View>

        {/* Single Item Delete Action */}
        <TouchableOpacity
          style={styles.deleteIconButton}
          onPress={() => handleInitiateDeleteSingle(item?._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={16} color={COLORS.grey400} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing && allNotifications.length === 0) {
    return <AppLoader visible={true} />;
  }

  if (error && allNotifications.length === 0) {
    return <ErrorView message={error} onRetry={() => fetchNotifications()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
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
              <CheckCheck size={18} color={COLORS.brandBrown} style={{ marginRight: 4 }} />
              <AppText style={styles.headerMarkReadText}>Mark all read</AppText>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <AppLoader visible={actionLoading} />

      {/* TOP SUMMARY & SEGMENTED FILTER TABS */}
      <View style={styles.filterBarContainer}>
        {/* Count Summary */}
        <View style={styles.summaryRow}>
          <AppText style={styles.summaryText}>
            {unreadCount > 0 ? (
              <>
                You have <AppText style={styles.summaryHighlight}>{unreadCount} unread</AppText>{' '}
                notification{unreadCount > 1 ? 's' : ''}
              </>
            ) : (
              'You are all caught up!'
            )}
          </AppText>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsWrapper}>
          {(['all', 'unread', 'read'] as const).map((filter: NotificationFilter) => {
            const isActive = activeFilter === filter;
            const count =
              filter === 'all'
                ? allCount
                : filter === 'unread'
                  ? unreadCount
                  : readCount;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </AppText>

                <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                  <AppText style={[styles.countText, isActive && styles.countTextActive]}>
                    {count}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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

      {/* FLOATING BATCH ACTION BAR (Shown when items are selected) */}
      {isSelectionMode && (
        <View style={styles.floatingActionBar}>
          <View style={styles.actionInfoCol}>
            <AppText style={styles.selectedCountText}>
              {selectedIds.length} Selected
            </AppText>
            <TouchableOpacity onPress={selectAll} style={styles.selectAllToggle}>
              <AppText style={styles.selectAllToggleText}>
                {selectedIds.length === notifications.length ? 'Deselect All' : 'Select All'}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.batchActionsGroup}>
            <TouchableOpacity
              style={styles.batchMarkReadBtn}
              onPress={handleMarkSelectedRead}
              activeOpacity={0.8}
            >
              <Check size={16} color="#059669" style={{ marginRight: 4 }} />
              <AppText style={styles.batchMarkReadText}>Mark Read</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.batchDeleteBtn}
              onPress={handleInitiateDeleteSelected}
              activeOpacity={0.8}
            >
              <Trash2 size={16} color={COLORS.error} style={{ marginRight: 4 }} />
              <AppText style={styles.batchDeleteText}>Delete</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.batchCloseBtn}
              onPress={clearSelection}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={COLORS.grey700} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // HEADER RIGHT ACTION
  headerMarkReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerMarkReadText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.brandBrown,
  },

  // TOP FILTER & SUMMARY BAR
  filterBarContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  summaryRow: {
    marginBottom: SPACING.sm,
  },
  summaryText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
  },
  summaryHighlight: {
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },

  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  tabPillActive: {
    backgroundColor: COLORS.brandBrown,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  tabLabelActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.grey700,
  },
  countTextActive: {
    color: COLORS.white,
  },

  // LIST CONTAINER
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },

  // NOTIFICATION CARDS
  notifCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  notifCardUnread: {
    backgroundColor: '#FFFBF5',
    borderColor: '#EEDCBD',
  },
  notifCardRead: {
    backgroundColor: COLORS.white,
    borderColor: '#E2E8F0',
  },
  notifCardSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: COLORS.brandBrown,
    borderWidth: 1.5,
  },

  unreadAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.brandBrown,
  },

  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {},
  checkboxUncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: COLORS.white,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notifTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
    flex: 1,
  },
  notifTitleUnread: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandBrown,
  },
  notifMsg: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.grey400,
    marginTop: 6,
  },

  deleteIconButton: {
    padding: 6,
    borderRadius: RADIUS.xs,
  },

  // FLOATING BATCH ACTION BAR
  floatingActionBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  actionInfoCol: {
    flexDirection: 'column',
  },
  selectedCountText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  selectAllToggle: {
    marginTop: 2,
  },
  selectAllToggleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: '#94A3B8',
    textDecorationLine: 'underline',
  },

  batchActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batchMarkReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#059669',
  },
  batchMarkReadText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#34D399',
  },
  batchDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  batchDeleteText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: '#FCA5A5',
  },
  batchCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});

export default Notifications;