import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, FONT_SIZE, RADIUS } from '../../constants';
import AppText from '../common/AppText';
import imageIndex from '../../assets/images/imageIndex';

const ChatListCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* 1. Left Status Dot */}
      <View style={styles.indicatorContainer}>
        {item?.unread && <View style={styles.unreadDot} />}
      </View>

      {/* 2. Avatar */}
      <Image
        source={item?.avatar ? { uri: item?.avatar } : imageIndex.AccountIcon}
        style={styles.avatar}
      />

      {/* 3. Middle Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText style={styles.name} numberOfLines={1}>
            {item?.name}
          </AppText>
          <AppText style={styles.time}>
            {item?.lastMessageTime || ''}
          </AppText>
        </View>

        <AppText style={styles.shipmentId}>
          Shipment ID {item?.shipmentCode}
        </AppText>

        <AppText style={styles.snippet} numberOfLines={1}>
          {item?.lastMessage ||
            'No messages yet. Start the conversation!'}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  indicatorContainer: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.greenActive,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.grey100,
    marginHorizontal: SPACING.xs,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
  shipmentId: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  snippet: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
});

export default memo(ChatListCard);
