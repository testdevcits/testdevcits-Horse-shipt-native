import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import AppText from '../../common/AppText';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.ChatCard';

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
        source={item?.avatar ? { uri: item?.avatar } : imageIndex?.AccountIcon}
        style={styles.avatar}
      />

      {/* 3. Middle Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText style={styles.name} numberOfLines={1}>
            {item?.name}
          </AppText>
          <AppText style={styles.time}>{item?.lastMessageTime || ''}</AppText>
        </View>

        <AppText style={styles.shipmentId}>
          Shipment ID {item?.shipmentCode}
        </AppText>

        <AppText style={styles.snippet} numberOfLines={1}>
          {item?.lastMessage || 'No messages yet. Start the conversation!'}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChatListCard);
