import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import { AppText, MyShipmentsSkeleton } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import styles from '../all_Shipments/styles.postload';
import ReviewCustomerModal from '../components/ReviewCustomerModal';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import ShipperShipmentCardItem from './ShipperShipmentCardItem';

export type StatusFilterType =
  | 'all'
  | 'in_transit'
  | 'completed'
  | 'upcoming'
  | 'cancelled';

interface MyShipmentsScreenProps {
  data: any[];
  loading: boolean;
  onOpenContract: (item: any) => void;
  onTrackShipment: (item: any) => void;
  onReviewCustomer?: (item: any) => void;
  onRefresh?: () => void;
}

export const getItemTripStatus = (
  item: any,
): 'in_transit' | 'completed' | 'upcoming' | 'cancelled' => {
  const tripStatusRaw = (
    item?.tripStatus ||
    item?.shipment?.tripStatus ||
    ''
  ).toLowerCase();
  const statusRaw = (
    item?.status ||
    item?.shipment?.status ||
    ''
  ).toLowerCase();
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
    ({ item }: { item: any }) => (
      <ShipperShipmentCardItem
        item={item}
        onOpenContract={onOpenContract}
        onTrackShipment={onTrackShipment}
        onReviewPress={handleReviewPress}
      />
    ),
    [onOpenContract, onTrackShipment, handleReviewPress],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return <MyShipmentsSkeleton />;
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
        <AppIcon name="Package" size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>
          No {labelMap[selectedStatus]} Found
        </AppText>
        <AppText style={styles.emptySub}>
          There are currently no shipments under the "{labelMap[selectedStatus]}
          " category.
        </AppText>
      </View>
    );
  }, [loading, selectedStatus]);

  const filterTabs: Array<{
    key: StatusFilterType;
    label: string;
    count: number;
  }> = [
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
                style={[
                  styles.subFilterPill,
                  isActive && styles.subFilterPillActive,
                ]}
                onPress={() => setSelectedStatus(tab.key)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.subFilterText,
                    isActive && styles.subFilterTextActive,
                  ]}
                >
                  {tab.label}
                </AppText>
                <View
                  style={[
                    styles.subFilterBadge,
                    isActive && styles.subFilterBadgeActive,
                  ]}
                >
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
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
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
