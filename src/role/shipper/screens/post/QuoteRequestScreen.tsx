import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Package } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import AvailableShipmentCard from '../home/AvailableShipmentCard';
import styles from './styles.postload';

interface QuoteRequestScreenProps {
  data: any[];
  loading: boolean;
  onCardPress: (item: any) => void;
}

export const QuoteRequestScreen: React.FC<QuoteRequestScreenProps> = ({
  data,
  loading,
  onCardPress,
}) => {
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
        <AppText style={styles.emptyTitle}>No Quote Requests Found</AppText>
        <AppText style={styles.emptySub}>
          There are currently no customer quote invitations or requests available.
        </AppText>
      </View>
    );
  }, [loading]);

  return (
    <FlatList
      data={loading ? [] : data}
      keyExtractor={(item, index) => item?._id || item?.id || String(index)}
      renderItem={renderCard}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={{ paddingBottom: 20 }}
      scrollEnabled={false}
    />
  );
};

export default QuoteRequestScreen;
