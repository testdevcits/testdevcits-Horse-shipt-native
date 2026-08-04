import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  MessageSquare,
  User,
} from 'lucide-react-native';
import {
  AppHeader,
  AppText,
  SearchBarCompt,
  AppSelect,
} from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.shipperchats';

const ShipperChatsScreen = ({ navigation }: any) => {
  const [chatCustomers, setChatCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread'>('All');

  const fetchChatCustomers = async () => {
    try {
      const res = await shipperService.getChatCustomers();
      if (res?.success || res?.data) {
        setChatCustomers(res.data || []);
      }
    } catch (error: any) {
      console.error('Fetch Chat Customers Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatCustomers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChatCustomers();
  };

  const handleOpenChat = (item: any) => {
    navigation.navigate('ChatDetails', {
      shipmentId: item?.shipmentId,
      name: item?.name || 'Customer',
    });
  };

  // Filter customer chats by search query and unread filter
  const filteredCustomers = chatCustomers.filter(item => {
    if (selectedFilter === 'Unread' && !item?.hasUnread) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item?.name || '').toLowerCase();
      const code = (item?.shipmentCode || '').toLowerCase();
      const pickup = (item?.pickupLocation || '').toLowerCase();
      const delivery = (item?.deliveryLocation || '').toLowerCase();
      if (
        !name.includes(q) &&
        !code.includes(q) &&
        !pickup.includes(q) &&
        !delivery.includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const ChatItemCard = ({
    item,
    index,
    isLast,
    handleOpenChat,
  }: {
    item: any;
    index: number;
    isLast: boolean;
    handleOpenChat: (item: any) => void;
  }) => {
    const [avatarError, setAvatarError] = useState(false);
    const pickupShort = item?.pickupLocation
      ? item?.pickupLocation.split(',')[0]
      : 'Pickup Location';
    const deliveryShort = item?.deliveryLocation
      ? item?.deliveryLocation.split(',')[0]
      : 'Delivery Location';

    return (
      <TouchableOpacity
        key={item?.shipmentId || item?._id || index}
        style={[styles.chatCardItem, isLast && styles.chatCardItemLast]}
        onPress={() => handleOpenChat(item)}
        activeOpacity={0.7}
      >
        {/* Avatar with Online Dot */}
        <View style={styles.avatarWrapper}>
          {item?.avatar && !avatarError ? (
            <Image
              source={{ uri: item?.avatar }}
              style={styles.avatarImg}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={22} color={COLORS.primary} />
            </View>
          )}
          {/* Green Online Dot */}
          <View style={styles.onlineDot} />
        </View>

        {/* Right Chat Column Info */}
        <View style={styles.chatContentCol}>
          {/* Customer Name & Time Row */}
          <View style={styles.topNameRow}>
            <AppText style={styles.customerName}>{item?.name || 'Customer'}</AppText>
            <AppText style={styles.timeAgoText}>5min ago</AppText>
          </View>

          {/* Shipment Code Subtitle */}
          <AppText style={styles.shipmentCodeSub}>
            Shipment ID {item?.shipmentCode || 'HS-SHIP-2026-CODE'}
          </AppText>

          {/* Location Route / Last Message Preview */}
          <View style={styles.routePreviewRow}>
            <AppText style={styles.routePreviewText} numberOfLines={1}>
              {pickupShort} ➜ {deliveryShort}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChatItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ChatItemCard
        key={item?.shipmentId || item?._id || index}
        item={item}
        index={index}
        isLast={index === filteredCustomers.length - 1}
        handleOpenChat={handleOpenChat}
      />
    );
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 12, gap: 10 }}>
      {/* Search Input Bar Component */}
      <SearchBarCompt
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search messages..."
      />

      {/* Filter Dropdown Select Component */}
      <AppSelect
        value={selectedFilter}
        options={['All', 'Active', 'InActive']}
        placeholder="Filter messages"
        onSelect={(item: string) => setSelectedFilter(item as any)}
      />
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MessageSquare size={44} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No Conversations</AppText>
        <AppText style={styles.emptySub}>
          Active shipment customer chats will appear here.
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Messages" />

      <FlatList
        data={loading ? [] : filteredCustomers}
        keyExtractor={(item, index) => item?.shipmentId || item?._id || index.toString()}
        renderItem={renderChatItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

export default ShipperChatsScreen;
