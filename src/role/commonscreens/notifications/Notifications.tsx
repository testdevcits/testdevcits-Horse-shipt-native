import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Bell,
  Check,
  Trash2,
  BellOff,
} from 'lucide-react-native';
import moment from 'moment';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../constants';
import useNotifications from './useNotifications';
import { AppHeader, AppLoader, AppText, EmptyState, ErrorView } from '../../../components';

const Notifications = () => {
  const {
    notifications,
    loading,
    refreshing,
    actionLoading,
    error,
    selectedIds,
    toggleSelect,
    selectAll,
    handleMarkRead,
    handleMarkSingleRead,
    handleDelete,
    fetchNotifications,
    clearSelection,
  } = useNotifications();

  const [filterState, setFilterState] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterState === 'unread') return !n.read;
    if (filterState === 'read') return n.read;
    return true;
  });

  const handleSelectAll = () => {
    selectAll();
  };

  const handleClearAll = () => {
    clearSelection();
  };

  const renderNotificationItem = ({ item }: any) => {
    const isSelected = selectedIds.includes(item._id);
    const isUnread = !item.read;

    const formattedTime = item.createdAt
      ? moment(item.createdAt).format('MMM DD, YYYY, h:mm A')
      : moment().format('MMM DD, YYYY, h:mm A');

    return (
      <TouchableOpacity
        style={[styles.notifCard, isSelected && styles.notifCardSelected]}
        onPress={() => {
          if (selectedIds.length > 0) {
            toggleSelect(item._id);
          } else if (isUnread) {
            handleMarkSingleRead(item._id);
          }
        }}
        activeOpacity={0.8}
      >
        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          onPress={() => toggleSelect(item._id)}
        >
          {isSelected && <Check size={12} color="#A06333" />}
        </TouchableOpacity>

        {/* Bell Icon Box */}
        <View style={styles.bellIconBox}>
          <Bell size={18} color="#A06333" />
        </View>

        {/* Info Column */}
        <View style={styles.notifTextCol}>
          <AppText style={styles.notifTitle}>{item.title || 'Notification'}</AppText>
          <AppText style={styles.notifMsg}>{item.message}</AppText>
          <AppText style={styles.notifTime}>{formattedTime}</AppText>
        </View>

        {/* Right Status Badge & Delete */}
        <View style={styles.notifRightCol}>
          <View
            style={[
              styles.statusBadge,
              isUnread ? styles.statusBadgeUnread : styles.statusBadgeRead,
            ]}
          >
            <AppText
              style={[
                styles.statusBadgeText,
                isUnread ? styles.statusBadgeTextUnread : styles.statusBadgeTextRead,
              ]}
            >
              {isUnread ? 'UNREAD' : 'READ'}
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => handleDelete()}
          >
            <Trash2 size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) return <AppLoader visible={true} />;
  if (error) return <ErrorView message={error} onRetry={() => fetchNotifications()} />;

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Notifications" />
      <AppLoader visible={actionLoading} />

      {/* TOP FILTERS & BATCH ACTIONS SCROLL ROW */}
      <View style={styles.topControlsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.controlsScroll}
        >
          {/* Filter Pills */}
          <View style={styles.filterPillsGroup}>
            {(['all', 'unread', 'read'] as const).map(f => {
              const isActive = filterState === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterPill,
                    isActive ? styles.filterPillActive : styles.filterPillInactive,
                  ]}
                  onPress={() => setFilterState(f)}
                >
                  <AppText
                    style={[
                      styles.filterPillText,
                      isActive ? styles.filterPillTextActive : styles.filterPillTextInactive,
                    ]}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Control Buttons */}
          <View style={styles.actionButtonsGroup}>
            <TouchableOpacity style={styles.actionOutlineBtn} onPress={handleSelectAll}>
              <AppText style={styles.actionOutlineText}>SELECT ALL</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionGreenBtn} onPress={handleMarkRead}>
              <Check size={14} color="#10B981" style={{ marginRight: 4 }} />
              <AppText style={styles.actionGreenText}>MARK SELECTED READ</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOutlineBtn} onPress={handleMarkRead}>
              <AppText style={styles.actionOutlineText}>MARK ALL READ</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRedBtn} onPress={handleDelete}>
              <Trash2 size={14} color="#EF4444" style={{ marginRight: 4 }} />
              <AppText style={styles.actionRedText}>DELETE SELECTED</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionDarkBtn} onPress={handleClearAll}>
              <AppText style={styles.actionDarkText}>CLEAR ALL</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* MAIN NOTIFICATIONS ACTIVITY LIST */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item._id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNotifications(true)}
            tintColor={COLORS.goldPrimary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={BellOff}
            title="No Notifications"
            message={
              filterState === 'all'
                ? "You're all caught up! No activity notifications found."
                : "No matching notifications found."
            }
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // TOP CONTROLS
  topControlsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: SPACING.sm,
  },
  controlsScroll: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  filterPillsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
  },
  filterPillActive: {
    backgroundColor: '#A06333',
  },
  filterPillInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
  },
  filterPillTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  filterPillTextInactive: {
    color: COLORS.textPrimary,
  },

  actionButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionOutlineBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  actionOutlineText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  actionGreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionGreenText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#10B981',
  },

  actionRedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionRedText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#EF4444',
  },

  actionDarkBtn: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionDarkText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // NOTIFICATION CARDS LIST
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  notifCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: SPACING.xs,
  },
  notifCardSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: COLORS.goldPrimary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxSelected: {
    borderColor: '#A06333',
    backgroundColor: '#FFFBEB',
  },
  bellIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.xs,
    backgroundColor: '#FBF5EB',
    borderWidth: 1,
    borderColor: '#EEDCBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTextCol: {
    flex: 1,
  },
  notifTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  notifMsg: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 6,
  },

  notifRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeUnread: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgeRead: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  statusBadgeTextUnread: {
    color: '#10B981',
  },
  statusBadgeTextRead: {
    color: COLORS.textSecondary,
  },
  deleteIconButton: {
    padding: 4,
  },
});

export default Notifications;