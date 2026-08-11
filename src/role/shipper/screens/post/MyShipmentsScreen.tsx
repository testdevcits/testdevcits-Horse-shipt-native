import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import {
  Package,
  MapPin,
  Truck,
  Check,
  Clock,
  AlertCircle,
  FileText,
  Star,
  Navigation,
  CreditCard,
  ArrowRight,
} from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import styles from './styles.postload';
import ReviewCustomerModal from './ReviewCustomerModal';


export type StatusFilterType = 'all' | 'in_transit' | 'completed' | 'upcoming' | 'cancelled';

interface MyShipmentsScreenProps {
  data: any[];
  loading: boolean;
  onOpenContract: (item: any) => void;
  onTrackShipment: (item: any) => void;
  onReviewCustomer?: (item: any) => void;
  onRefresh?: () => void;
}

export const getItemTripStatus = (item: any): 'in_transit' | 'completed' | 'upcoming' | 'cancelled' => {
  const tripStatusRaw = (item?.tripStatus || item?.shipment?.tripStatus || '').toLowerCase();
  const statusRaw = (item?.status || item?.shipment?.status || '').toLowerCase();
  const isCancelled =
    item?.isCancelled === true ||
    statusRaw === 'cancelled' ||
    tripStatusRaw === 'cancelled' ||
    statusRaw === 'rejected';

  if (isCancelled) return 'cancelled';

  if (
    tripStatusRaw === 'intransit' ||
    tripStatusRaw === 'in_transit' ||
    tripStatusRaw === 'intrip' ||
    statusRaw === 'in_transit' ||
    statusRaw === 'in-transit' ||
    statusRaw === 'on_the_way'
  ) {
    return 'in_transit';
  }

  if (
    tripStatusRaw === 'completed' ||
    tripStatusRaw === 'delivered' ||
    statusRaw === 'completed' ||
    statusRaw === 'delivered'
  ) {
    return 'completed';
  }

  if (
    tripStatusRaw === 'upcoming' ||
    tripStatusRaw === 'assigned' ||
    statusRaw === 'assigned' ||
    statusRaw === 'accepted' ||
    statusRaw === 'pending'
  ) {
    return 'upcoming';
  }

  return 'upcoming';
};

export const MyShipmentsScreen: React.FC<MyShipmentsScreenProps> = ({
  data,
  loading,
  onOpenContract,
  onTrackShipment,
  onReviewCustomer,
  onRefresh,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>('all');
  const [selectedReviewItem, setSelectedReviewItem] = useState<any>(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const handleReviewPress = useCallback(
    (item: any) => {
      if (onReviewCustomer) {
        onReviewCustomer(item);
      } else {
        setSelectedReviewItem(item);
        setIsReviewModalVisible(true);
      }
    },
    [onReviewCustomer],
  );

  const counts = useMemo(() => {
    const c = {
      all: data.length,
      in_transit: 0,
      completed: 0,
      upcoming: 0,
      cancelled: 0,
    };
    data.forEach(item => {
      const status = getItemTripStatus(item);
      if (status in c) {
        c[status]++;
      }
    });
    return c;
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedStatus === 'all') return data;
    return data.filter(item => getItemTripStatus(item) === selectedStatus);
  }, [data, selectedStatus]);

  const renderCard = useCallback(
    ({ item }: { item: any }) => {
      const shipment = item?.shipment || item;
      const code = item?.shipmentCode || shipment.shipmentCode || 'Not available';
      const pickupLoc =
        item?.pickupLocation ||
        shipment.pickupLocation ||
        'Pickup location unavailable';
      const deliveryLoc =
        item?.deliveryLocation ||
        shipment.deliveryLocation ||
        'Delivery location unavailable';
      const horsesCount = shipment.numberOfHorses || shipment.horses?.length || 0;

      const itemStatus = getItemTripStatus(item);
      const paymentStatusRaw = (item?.paymentStatus || 'pending').toLowerCase();
      const priceText = item?.totalPrice ? `$${item?.totalPrice}` : '$0';
      const paymentMethodText = item?.paymentMethod || 'card';
      const paymentDueText = item?.paymentDue
        ? `due on ${item?.paymentDue}`
        : 'due on delivery';

      const isPaid = paymentStatusRaw === 'paid';

      const getBadgeStyle = () => {
        switch (itemStatus) {
          case 'in_transit':
            return {
              bg: '#E0F2FE',
              border: '#7DD3FC',
              text: '#0284C7',
              label: 'IN TRANSIT',
              icon: <Truck size={12} color="#0284C7" />,
            };
          case 'completed':
            return {
              bg: COLORS.emeraldLightBg,
              border: COLORS.emeraldBorder,
              text: COLORS.emeraldPrimary,
              label: 'COMPLETED',
              icon: <Check size={12} color={COLORS.emeraldPrimary} />,
            };
          case 'cancelled':
            return {
              bg: COLORS.redLightBg,
              border: COLORS.redBorder,
              text: COLORS.redPrimary,
              label: 'CANCELLED',
              icon: <AlertCircle size={12} color={COLORS.redPrimary} />,
            };
          case 'upcoming':
          default:
            return {
              bg: COLORS.amberLightBg,
              border: COLORS.amberBorder,
              text: COLORS.amberWarning,
              label: 'UPCOMING',
              icon: <Clock size={12} color={COLORS.amberWarning} />,
            };
        }
      };

      const badge = getBadgeStyle();

      return (
        <View style={styles.myShipmentCard}>
          {/* Header Row: Code & Badges */}
          <View style={styles.myHeaderRow}>
            <View style={styles.codeBadge}>
              <Package size={12} color={COLORS.textSecondary} />
              <AppText style={styles.myCodeText}>#{code}</AppText>
            </View>


          </View>
          <View style={styles.myBadgesRow}>
            {/* Trip Status Badge */}
            <View
              style={[
                styles.myBadgePill,
                { backgroundColor: badge.bg, borderColor: badge.border },
              ]}
            >
              {badge.icon}
              <AppText style={[styles.myBadgePillText, { color: badge.text }]}>
                {badge.label}
              </AppText>
            </View>

            {/* Payment Badge */}
            <View
              style={[
                styles.myBadgePill,
                isPaid
                  ? { backgroundColor: COLORS.emeraldLightBg, borderColor: COLORS.emeraldBorder }
                  : { backgroundColor: COLORS.slate50, borderColor: COLORS.slate300 },
              ]}
            >
              <CreditCard size={11} color={isPaid ? COLORS.emeraldPrimary : COLORS.textSecondary} />
              <AppText
                style={[
                  styles.myBadgePillText,
                  isPaid ? { color: COLORS.emeraldPrimary } : { color: COLORS.textSecondary },
                ]}
              >
                {paymentStatusRaw.toUpperCase()}
              </AppText>
            </View>
          </View>
          {/* Route Graphic Row */}
          <View style={styles.routeGraphicContainer}>
            {/* Pickup Node */}
            <View style={styles.routeLocCol}>
              <View style={styles.locHeaderRow}>
                <View style={[styles.locDot, { backgroundColor: '#D97706' }]} />
                <AppText style={styles.routeLocLabel}>PICKUP</AppText>
              </View>
              <AppText style={styles.routeAddressText} numberOfLines={2}>
                {pickupLoc}
              </AppText>
            </View>

            {/* Track Line with Arrow */}
            <View style={styles.trackMiddle}>
              <View style={styles.trackLine} />
              <View style={styles.trackTruckBox}>
                <ArrowRight size={12} color="#D97706" />
              </View>
            </View>

            {/* Delivery Node */}
            <View style={styles.routeLocCol}>
              <View style={styles.locHeaderRow}>
                <View style={[styles.locDot, { backgroundColor: '#10B981' }]} />
                <AppText style={styles.routeLocLabel}>DELIVERY</AppText>
              </View>
              <AppText style={styles.routeAddressText} numberOfLines={2}>
                {deliveryLoc}
              </AppText>
            </View>
          </View>

          {/* Info Meta Grid */}
          <View style={styles.metaInfoContainer}>
            <View style={styles.metaItem}>
              <AppText style={styles.metaLabel}>Horses</AppText>
              <AppText style={styles.metaValue}>
                👤 {horsesCount} {horsesCount === 1 ? 'Horse' : 'Horses'}
              </AppText>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <AppText style={styles.metaLabel}>Total Price</AppText>
              <AppText style={styles.priceValue}>{priceText}</AppText>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <AppText style={styles.metaLabel}>Payment</AppText>
              <AppText style={styles.metaValue} numberOfLines={1}>
                {paymentMethodText} • {paymentDueText}
              </AppText>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.myActionsRow}>
            <TouchableOpacity
              style={styles.viewContractBtn}
              onPress={() => onOpenContract(item)}
              activeOpacity={0.8}
            >
              <FileText size={14} color="#A06333" />
              <AppText style={styles.viewContractBtnText}>View Contract</AppText>
            </TouchableOpacity>
            {itemStatus === 'completed' || item?.tripStatus === 'completed' ? (
              <TouchableOpacity
                style={styles.reviewCustomerBtn}
                onPress={() => handleReviewPress(item)}
                activeOpacity={0.8}
              >
                <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
                <AppText style={styles.reviewCustomerBtnText}>Review Customer</AppText>
              </TouchableOpacity>
            ) : (
              paymentStatusRaw !== "pending" &&
              <TouchableOpacity
                style={styles.trackShipmentBtn}
                onPress={() => onTrackShipment(item)}
                activeOpacity={0.8}
              >
                <Navigation size={14} color="#FFFFFF" />
                <AppText style={styles.trackShipmentBtnText}>Track Shipment</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
    [onOpenContract, onTrackShipment, handleReviewPress],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A06333" />
        </View>
      );
    }

    const labelMap: Record<StatusFilterType, string> = {
      all: 'My Shipments',
      in_transit: 'In Transit Shipments',
      completed: 'Completed Shipments',
      upcoming: 'Upcoming Shipments',
      cancelled: 'Cancelled Shipments',
    };

    return (
      <View style={styles.emptyContainer}>
        <Package size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No {labelMap[selectedStatus]} Found</AppText>
        <AppText style={styles.emptySub}>
          There are currently no shipments under the "{labelMap[selectedStatus]}" category.
        </AppText>
      </View>
    );
  }, [loading, selectedStatus]);

  const filterTabs: Array<{ key: StatusFilterType; label: string; count: number }> = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'in_transit', label: 'In Transit', count: counts.in_transit },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Sub Filter Status Bar */}
      <View style={styles.subFilterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subFilterContainer}
        >
          {filterTabs.map(tab => {
            const isActive = selectedStatus === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.subFilterPill, isActive && styles.subFilterPillActive]}
                onPress={() => setSelectedStatus(tab.key)}
                activeOpacity={0.8}
              >
                <AppText style={[styles.subFilterText, isActive && styles.subFilterTextActive]}>
                  {tab.label}
                </AppText>
                <View style={[styles.subFilterBadge, isActive && styles.subFilterBadgeActive]}>
                  <AppText
                    style={[
                      styles.subFilterBadgeText,
                      isActive && styles.subFilterBadgeTextActive,
                    ]}
                  >
                    {String(tab.count).padStart(2, '0')}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={loading ? [] : filteredData}
        keyExtractor={(item, index) => item?._id || item?.id || String(index)}
        renderItem={renderCard}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
      />

      <ReviewCustomerModal
        visible={isReviewModalVisible}
        onClose={() => {
          setIsReviewModalVisible(false);
          setSelectedReviewItem(null);
        }}
        item={selectedReviewItem}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </View>
  );
};

export default MyShipmentsScreen;
