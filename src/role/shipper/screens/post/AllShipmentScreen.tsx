import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Search, Package } from 'lucide-react-native';
import { AppText, Input } from '../../../../components';
import { COLORS } from '../../../../constants';
import AvailableShipmentCard from '../home/AvailableShipmentCard';
import styles from './styles.postload';

interface AllShipmentScreenProps {
  data: any[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCardPress: (item: any) => void;
}

export const AllShipmentScreen: React.FC<AllShipmentScreenProps> = ({
  data,
  loading,
  searchQuery,
  setSearchQuery,
  onCardPress,
}) => {
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;

    const q = searchQuery.toLowerCase();
    return data.filter(item => {
      const shipment = item?.shipment || item;
      const p = (
        item?.pickupLocation ||
        shipment.pickupLocation ||
        ''
      ).toLowerCase();
      const d = (
        item?.deliveryLocation ||
        shipment.deliveryLocation ||
        ''
      ).toLowerCase();
      const c = (
        item?.shipmentCode ||
        shipment.shipmentCode ||
        ''
      ).toLowerCase();
      return p.includes(q) || d.includes(q) || c.includes(q);
    });
  }, [data, searchQuery]);

  const renderCard = useCallback(
    ({ item }: { item: any }) => {
      const shipment = item?.shipment || item;
      return (
        <View style={{ marginHorizontal: 0 }}>
          <AvailableShipmentCard
            item={shipment}
            onPress={() => onCardPress(item)}
          />
        </View>
      );
    },
    [onCardPress],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A06333" />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Package size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No Shipments Found</AppText>
        <AppText style={styles.emptySub}>
          {searchQuery.trim()
            ? `No available shipments found matching "${searchQuery}".`
            : 'There are currently no available shipments.'}
        </AppText>
      </View>
    );
  }, [loading, searchQuery]);

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar - Exclusive to All Shipment Screen */}
      <View style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 4 }}>
        <Input
          placeholder="Search pickup, delivery, or code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={COLORS.textSecondary} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <FlatList
        data={loading ? [] : filteredData}
        keyExtractor={(item, index) => item?._id || item?.id || String(index)}
        renderItem={renderCard}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default AllShipmentScreen;
