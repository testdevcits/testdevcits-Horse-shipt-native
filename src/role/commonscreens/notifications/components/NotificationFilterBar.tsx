import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../components';
import { NotificationFilter } from '../useNotifications';
import styles from '../styles.notification';

interface NotificationFilterBarProps {
  unreadCount: number;
  activeFilter: NotificationFilter;
  allCount: number;
  readCount: number;
  onSelectFilter: (filter: NotificationFilter) => void;
}

const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  unreadCount,
  activeFilter,
  allCount,
  readCount,
  onSelectFilter,
}) => {
  return (
    <View style={styles.filterBarContainer}>
      {/* Count Summary */}
      <View style={styles.summaryRow}>
        <AppText style={styles.summaryText}>
          {unreadCount > 0 ? (
            <>
              You have{' '}
              <AppText style={styles.summaryHighlight}>
                {unreadCount} unread
              </AppText>{' '}
              notification{unreadCount > 1 ? 's' : ''}
            </>
          ) : (
            'You are all caught up!'
          )}
        </AppText>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        {(['all', 'unread', 'read'] as const).map(
          (filter: NotificationFilter) => {
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
                onPress={() => onSelectFilter(filter)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </AppText>

                <View
                  style={[
                    styles.countBadge,
                    isActive && styles.countBadgeActive,
                  ]}
                >
                  <AppText
                    style={[
                      styles.countText,
                      isActive && styles.countTextActive,
                    ]}
                  >
                    {count}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          },
        )}
      </View>
    </View>
  );
};

export default memo(NotificationFilterBar);
