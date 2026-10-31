import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../components';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../constants';
import styles from '../styles.notification';

interface NotificationBatchActionBarProps {
  selectedCount: number;
  totalNotifications: number;
  onSelectAll: () => void;
  onMarkSelectedRead: () => void;
  onInitiateDeleteSelected: () => void;
  onClearSelection: () => void;
}

const NotificationBatchActionBar: React.FC<NotificationBatchActionBarProps> = ({
  selectedCount,
  totalNotifications,
  onSelectAll,
  onMarkSelectedRead,
  onInitiateDeleteSelected,
  onClearSelection,
}) => {
  return (
    <View style={styles.floatingActionBar}>
      <View style={styles.actionInfoCol}>
        <AppText style={styles.selectedCountText}>
          {selectedCount} Selected
        </AppText>
        <TouchableOpacity onPress={onSelectAll} style={styles.selectAllToggle}>
          <AppText style={styles.selectAllToggleText}>
            {selectedCount === totalNotifications
              ? 'Deselect All'
              : 'Select All'}
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.batchActionsGroup}>
        <TouchableOpacity
          style={styles.batchMarkReadBtn}
          onPress={onMarkSelectedRead}
          activeOpacity={0.8}
        >
          <AppIcon
            name={'Check'}
            size={16}
            color={COLORS.emeraldPrimary}
            style={{ marginRight: 4 }}
          />
          <AppText style={styles.batchMarkReadText}>Mark Read</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.batchDeleteBtn}
          onPress={onInitiateDeleteSelected}
          activeOpacity={0.8}
        >
          <AppIcon
            name={'Trash2'}
            size={16}
            color={COLORS.error}
            style={{ marginRight: 4 }}
          />
          <AppText style={styles.batchDeleteText}>Delete</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.batchCloseBtn}
          onPress={onClearSelection}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppIcon name={'X'} size={18} color={COLORS.grey700} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(NotificationBatchActionBar);
