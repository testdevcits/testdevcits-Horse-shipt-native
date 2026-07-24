import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const ChatListCard = ({ item, onPress }: { item: any, onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* 1. Left Status Dot */}
      <View style={styles.indicatorContainer}>
        {item.unread && <View style={styles.unreadDot} />}
      </View>

      {/* 2. Avatar */}
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      {/* 3. Middle Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText style={styles.name} numberOfLines={1}>{item.name}</AppText>
          <AppText style={styles.time}>{item.lastMessageTime || '5min ago'}</AppText>
        </View>
        
        <AppText style={styles.shipmentId}>Shipment ID {item.shipmentCode}</AppText>
        
        <AppText style={styles.snippet} numberOfLines={1}>
          {item.lastMessage || 'Lorem ipsum dolor sit amet consectetur. Nulla...'}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  indicatorContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenActive, // Use your #10B981
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.grey100,
    marginHorizontal: SPACING.sm,
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
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
  shipmentId: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  snippet: {
    fontSize: 13,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
});

export default ChatListCard;