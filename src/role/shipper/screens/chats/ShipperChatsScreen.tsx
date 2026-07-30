import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Search,
  ChevronDown,
  MessageSquare,
  User,
} from 'lucide-react-native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';

const ShipperChatsScreen = ({ navigation }: any) => {
  const [chatCustomers, setChatCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

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
      shipmentId: item.shipmentId,
      name: item.name || 'Customer',
    });
  };

  // Filter customer chats by search query and unread filter
  const filteredCustomers = chatCustomers.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.name || '').toLowerCase();
      const code = (item.shipmentCode || '').toLowerCase();
      const pickup = (item.pickupLocation || '').toLowerCase();
      const delivery = (item.deliveryLocation || '').toLowerCase();
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

  return (
    <View style={styles.container}>
      <AppHeader title="Messages" showNotificationBell />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Messages Header Title */}
        <AppText style={styles.messagesHeaderTitle}>Messages</AppText>

        {/* Search Input Bar */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Dropdown Row */}
        <View style={styles.filterDropdownRow}>
          <TouchableOpacity
            style={styles.filterPillBtn}
            onPress={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            activeOpacity={0.8}
          >
            <AppText style={styles.filterPillText}>{selectedFilter}</AppText>
            <ChevronDown size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Dropdown Options Popup */}
          {isFilterDropdownOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedFilter('All');
                  setIsFilterDropdownOpen(false);
                }}
              >
                <AppText
                  style={[
                    styles.dropdownItemText,
                    selectedFilter === 'All' && styles.dropdownItemTextActive,
                  ]}
                >
                  All Messages
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedFilter('Unread');
                  setIsFilterDropdownOpen(false);
                }}
              >
                <AppText
                  style={[
                    styles.dropdownItemText,
                    selectedFilter === 'Unread' && styles.dropdownItemTextActive,
                  ]}
                >
                  Unread Messages
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Chat Customer Conversations List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageSquare size={44} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No Conversations</AppText>
            <AppText style={styles.emptySub}>
              Active shipment customer chats will appear here.
            </AppText>
          </View>
        ) : (
          filteredCustomers.map((item, index) => {
            const isLast = index === filteredCustomers.length - 1;
            const pickupShort = item.pickupLocation
              ? item.pickupLocation.split(',')[0]
              : 'Pickup Location';
            const deliveryShort = item.deliveryLocation
              ? item.deliveryLocation.split(',')[0]
              : 'Delivery Location';

            return (
              <TouchableOpacity
                key={item.shipmentId || index}
                style={[styles.chatCardItem, isLast && styles.chatCardItemLast]}
                onPress={() => handleOpenChat(item)}
                activeOpacity={0.7}
              >
                {/* Avatar with Online Dot */}
                <View style={styles.avatarWrapper}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <User size={22} color={COLORS.goldPrimary} />
                    </View>
                  )}
                  {/* Green Online Dot */}
                  <View style={styles.onlineDot} />
                </View>

                {/* Right Chat Column Info */}
                <View style={styles.chatContentCol}>
                  {/* Customer Name & Time Row */}
                  <View style={styles.topNameRow}>
                    <AppText style={styles.customerName}>{item.name || 'Customer'}</AppText>
                    <AppText style={styles.timeAgoText}>5min ago</AppText>
                  </View>

                  {/* Shipment Code Subtitle */}
                  <AppText style={styles.shipmentCodeSub}>
                    Shipment ID {item.shipmentCode || 'HS-SHIP-2026-CODE'}
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
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  messagesHeaderTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Search Input
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  // Filter Dropdown
  filterDropdownRow: {
    marginBottom: SPACING.md,
    position: 'relative',
    zIndex: 10,
  },
  filterPillBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.divider,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  dropdownItemTextActive: {
    color: '#A06333',
    fontFamily: FONTS.bold,
  },

  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Chat Cards List
  chatCardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: SPACING.md,
  },
  chatCardItemLast: {
    borderBottomWidth: 0,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBF5EB',
    borderWidth: 1,
    borderColor: '#EEDCBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // Chat Content
  chatContentCol: {
    flex: 1,
  },
  topNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  timeAgoText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  shipmentCodeSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  routePreviewRow: {
    marginTop: 2,
  },
  routePreviewText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default ShipperChatsScreen;
