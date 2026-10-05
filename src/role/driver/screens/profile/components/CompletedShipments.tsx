import { View, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles.profile';
import { AppText, TripCard } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { DriverShipmentItem } from '../../../../../types/driver';

export interface CompletedShipmentsProps {
  completedShipments?: DriverShipmentItem[];
  completedCount?: number;
}

const CompletedShipments: React.FC<CompletedShipmentsProps> = ({
  completedShipments = [],
  completedCount = 0,
}) => {
  console.log(
    'CompletedShipments Component Rendered with completedCount:',
    completedCount,
    'and completedShipments:',
    completedShipments,
  );

  const navigation = useNavigation<any>();

  return (
    <View style={styles.detailsCard}>
      <View style={styles.detailsHeader}>
        <View style={styles.row}>
          <AppText style={styles.detailsHeaderTitle}>
            Completed Shipments
          </AppText>
          <View style={styles.completedBadgeCount}>
            <AppText style={styles.badgeCountText}>{completedCount}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.shipmentsBody}>
        {completedCount === 0 || !completedShipments?.length ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <AppIcon name={'Box'} size={24} color={COLORS.primary} />
            </View>
            <AppText style={styles.emptyText}>
              No completed shipments yet
            </AppText>
          </View>
        ) : (
          completedShipments
            .slice(0, 1)
            .map((item: DriverShipmentItem, index: number) => {
              const shipmentId =
                item?._id || (item as any)?.id || `shipment-${index}`;
              return (
                <TripCard
                  key={shipmentId}
                  item={item}
                  onCardPress={(selectedItem) =>
                    navigation.navigate('ShipmentDetails', {
                      shipment: selectedItem,
                    })
                  }
                />
              );
            })
        )}
      </View>

      {completedShipments.length > 1 && (
        <TouchableOpacity
          style={styles.viewAllButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Trips')}
        >
          <AppText style={styles.viewAllButtonText}>
            View All Completed Shipments
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(CompletedShipments);
