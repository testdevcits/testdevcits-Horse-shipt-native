import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Bell, Truck, MessageSquare, FileText } from 'lucide-react-native';
import { formatDate } from '../../../../utils/helpers';
import { COLORS } from '../../../../constants';
import { AppText } from '../../../../components';
import AppIcon from '../../../../components/app_icon/AppIcon';
import styles from '../styles.notification';

const getNotificationIcon = (title: string = '', message: string = '') => {
  const content = (title + ' ' + message).toLowerCase();
  if (
    content.includes('quote') ||
    content.includes('offer') ||
    content.includes('bid')
  ) {
    return {
      Icon: FileText,
      color: COLORS.emeraldPrimary,
      bg: COLORS.emeraldLightBg,
      border: COLORS.emeraldBorder,
    };
  }
  if (
    content.includes('chat') ||
    content.includes('message') ||
    content.includes('question')
  ) {
    return {
      Icon: MessageSquare,
      color: COLORS.bluePrimary,
      bg: COLORS.blueLightBg,
      border: COLORS.blueBorder,
    };
  }
  if (
    content.includes('shipment') ||
    content.includes('deliver') ||
    content.includes('pickup') ||
    content.includes('transit')
  ) {
    return {
      Icon: Truck,
      color: COLORS.brandBrown,
      bg: COLORS.goldLightBg,
      border: COLORS.goldBorder,
    };
  }
  return {
    Icon: Bell,
    color: COLORS.brandBrown,
    bg: COLORS.goldLightBg,
    border: COLORS.goldBorder,
  };
};

interface NotificationItemCardProps {
  item: any;
  isSelected: boolean;
  isSelectionMode: boolean;
  onToggleSelect: (id: string) => void;
  onMarkSingleRead: (id: string) => void;
  onInitiateDeleteSingle: (id: string) => void;
  navigation: any;
}

const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  isSelected,
  isSelectionMode,
  onToggleSelect,
  onMarkSingleRead,
  onInitiateDeleteSingle,
  navigation,
}) => {
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
          onToggleSelect(item?._id);
        } else if (isUnread) {
          onMarkSingleRead(item?._id);
        }
      }}
      onLongPress={() => onToggleSelect(item?._id)}
      activeOpacity={0.85}
    >
      {/* Left Accent Strip for Unread */}
      {isUnread && <View style={styles.unreadAccentBar} />}

      {/* Checkbox / Selection Circle */}
      <TouchableOpacity
        style={[styles.checkbox, isSelected && styles.checkboxSelected]}
        onPress={() => onToggleSelect(item?._id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isSelected ? (
          <AppIcon
            name={'CheckCircle2'}
            size={20}
            color={COLORS.brandBrown}
            fill={COLORS.warmCreamDark}
          />
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

      {/* Action icons */}
      <View>
        <TouchableOpacity
          style={styles.deleteIconButton}
          onPress={() => onInitiateDeleteSingle(item?._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name={'Trash2'} size={16} color={COLORS.grey400} />
        </TouchableOpacity>
        {item?.event === 'horse_shipt:chat_message_created' &&
        item?.data?.shipmentId ? (
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() =>
              navigation.navigate('ChatDetails', {
                shipmentId: item?.data?.shipmentId,
              })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name={'ArrowRight'} size={16} color={COLORS.grey400} />
          </TouchableOpacity>
        ) : item?.event === 'horse_shipt:quote_vehicle_assigned' ? (
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => {
              navigation.navigate('MyShipmentDetails', {
                item: { _id: item?.data?.shipmentId },
                quoteId: item?.quoteId,
              });
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name={'ArrowRight'} size={16} color={COLORS.grey400} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default memo(NotificationItemCard);
