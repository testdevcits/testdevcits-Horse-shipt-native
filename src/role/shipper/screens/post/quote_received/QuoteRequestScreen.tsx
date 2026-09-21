import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { AppText, QuoteRequestSkeleton } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import AvailableShipmentCard from '../../home/components/AvailableShipmentCard';
import styles from '../all_Shipments/styles.postload';
import AppIcon from '../../../../../components/app_icon/AppIcon';

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
      return <QuoteRequestSkeleton />;
    }

    return (
      <View style={styles.emptyContainer}>
        <AppIcon name="Package" size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No Quote Requests Found</AppText>
        <AppText style={styles.emptySub}>
          There are currently no customer quote invitations or requests
          available.
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
      contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
      scrollEnabled={false}
    />
  );
};

export default QuoteRequestScreen;
