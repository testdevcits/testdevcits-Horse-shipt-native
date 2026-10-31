import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useDriverMe } from '../../../../hooks/useDriverMe';
import DriverHeader from '../../../../components/common/DriverHeader/DriverHeader';
import { COLORS, ICON_SIZE } from '../../../../constants';
import { AppText, TripCard, ShipmentsSkeleton } from '../../../../components';
import styles from './styles.alltrips';
import AppIcon from '../../../../components/app_icon/AppIcon';

type TabType = 'ALL' | 'PENDING' | 'ACTIVE' | 'DELIVERED';

const getNormalizedStatus = (s: any) => {
  const st = (
    s?.tripStatus ||
    s?.status ||
    s?.shipment?.tripStatus ||
    s?.shipment?.status ||
    ''
  )
    .toString()
    .toLowerCase()
    .replace(/_/g, '');
  return st;
};

const isPendingStatus = (s: any) => {
  const st = getNormalizedStatus(s);
  return (
    st === 'pending' ||
    st === 'notstarted' ||
    st === 'assigned' ||
    st === 'upcoming'
  );
};

const isActiveStatus = (s: any) => {
  const st = getNormalizedStatus(s);
  return (
    st === 'intransit' || st === 'started' || st === 'active' || st === 'intrip'
  );
};

const isDeliveredStatus = (s: any) => {
  const st = getNormalizedStatus(s);
  return st === 'completed' || st === 'delivered';
};

const AllTrips = ({ navigation }: { navigation?: any }) => {
  const { loading, allShipments, driver, activeShipment } = useDriverMe();
  const [selectedTab, setSelectedTab] = useState<TabType>('ALL');

  const shipments = useMemo(() => allShipments || [], [allShipments]);

  // Compute status counts dynamically
  const counts = useMemo(() => {
    return {
      ALL: shipments.length,
      PENDING: shipments.filter(isPendingStatus).length,
      ACTIVE: shipments.filter(isActiveStatus).length,
      DELIVERED: shipments.filter(isDeliveredStatus).length,
    };
  }, [shipments]);

  // Filter current shipments based on tab selection
  const filteredShipments = useMemo(() => {
    switch (selectedTab) {
      case 'PENDING':
        return shipments.filter(isPendingStatus);
      case 'ACTIVE':
        return shipments.filter(isActiveStatus);
      case 'DELIVERED':
        return shipments.filter(isDeliveredStatus);
      default:
        return shipments;
    }
  }, [selectedTab, shipments]);

  const handleCompleteDelivery = useCallback(
    (tripId: string) => {
      console.log('Complete delivery triggered for trip id: ', tripId);
      const targetShipment =
        shipments.find(
          (s: any) => (s?._id || s?.id || s?.shipment?._id) === tripId,
        ) || activeShipment;
      navigation?.navigate('DeliveryVerification', {
        shipment: targetShipment,
      });
    },
    [navigation, shipments, activeShipment],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item?._id || item?.id || item?.shipmentCode || index.toString(),
    [],
  );

  const handleCardPress = useCallback(
    (selectedItem: any) => {
      navigation?.navigate('ShipmentDetails', { shipment: selectedItem });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TripCard
        item={item}
        onCompletePress={handleCompleteDelivery}
        onCardPress={handleCardPress}
        containerStyle={styles.cardSpacing}
      />
    ),
    [handleCompleteDelivery, handleCardPress],
  );

  // Render method for active status filters (Horizontal Chip Layout)
  const renderFilterTab = (label: TabType, count: number) => {
    const isActive = selectedTab === label;

    // Formats "PENDING" to "Pending" for professional display
    const formattedLabel = label.charAt(0) + label.slice(1).toLowerCase();

    return (
      <TouchableOpacity
        key={label}
        style={[styles.chip, isActive && styles.chipActive]}
        activeOpacity={0.8}
        onPress={() => setSelectedTab(label)}
      >
        <AppText style={[styles.chipText, isActive && styles.chipTextActive]}>
          {formattedLabel}
        </AppText>
        <View style={[styles.badge, isActive && styles.badgeActive]}>
          <AppText
            style={[styles.badgeText, isActive && styles.badgeTextActive]}
          >
            {count}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Shared Global Header */}
      {!loading && (
        <DriverHeader
          name={driver?.name || 'Not Available'}
          statusText={driver?.driverStatus || 'Not Available'}
          profileImageUrl={driver?.profileImage?.url}
          isOnline={driver?.isActive !== false}
        />
      )}

      {loading ? (
        <ShipmentsSkeleton />
      ) : (
        <FlatList
          data={filteredShipments}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabScrollContent}
            >
              {renderFilterTab('ALL', counts.ALL)}
              {renderFilterTab('PENDING', counts.PENDING)}
              {renderFilterTab('ACTIVE', counts.ACTIVE)}
              {renderFilterTab('DELIVERED', counts.DELIVERED)}
            </ScrollView>
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppIcon
                name={'AlertCircle'}
                size={ICON_SIZE.xl}
                color={COLORS.textLight}
              />
              <AppText style={styles.emptyText}>
                No shipments found for this status.
              </AppText>
            </View>
          }
        />
      )}
    </View>
  );
};

export default AllTrips;
