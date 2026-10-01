import React, { memo } from 'react';
import { View } from 'react-native';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.deliveryverification';

interface DeliveryShipmentCardProps {
  shipment: any;
}

const DeliveryShipmentCard: React.FC<DeliveryShipmentCardProps> = ({
  shipment,
}) => {
  const horseName =
    shipment?.shipment?.horses?.[0]?.registeredName || 'Horse Manifest';
  const numberOfHorses = shipment?.shipment?.numberOfHorses || 1;
  const pickup = shipment?.shipment?.pickupLocation || 'Pickup location N/A';
  const delivery =
    shipment?.shipment?.deliveryLocation || 'Delivery location N/A';
  const vehicleNo = shipment?.vehicle?.vehicleNumber || 'Unassigned';

  return (
    <View style={styles.shipmentCard}>
      {/* Header Row */}
      <View style={styles.shipmentHeaderRow}>
        <AppText style={styles.shipmentHeaderLabel}>DELIVERY MANIFEST</AppText>
        <View style={styles.passengerCountBadge}>
          <AppText style={styles.badgeText}>
            {numberOfHorses} {numberOfHorses > 1 ? 'Horses' : 'Horse'}
          </AppText>
        </View>
      </View>

      {/* Horse Title */}
      <View style={styles.shipmentTitleRow}>
        <AppText style={styles.shipmentTitle}>{horseName}</AppText>
      </View>

      {/* Modern Route Container */}
      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <View style={styles.routeDotColumn}>
            <View style={styles.dotGreen} />
            <View style={styles.dotLine} />
            <View style={styles.dotGold} />
          </View>

          <View style={styles.routeTextColumn}>
            <View style={{ marginBottom: 12 }}>
              <AppText style={styles.stopHeaderLabel}>PICKUP</AppText>
              <AppText numberOfLines={1} style={styles.stopName}>
                {pickup}
              </AppText>
            </View>

            <View>
              <AppText style={styles.stopHeaderLabel}>DELIVERY</AppText>
              <AppText numberOfLines={1} style={styles.stopName}>
                {delivery}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Meta info grid */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <View style={styles.metaIconBox}>
            <AppIcon name="Truck" size={14} color={COLORS.primary} />
          </View>
          <View>
            <AppText style={styles.metaLabel}>VEHICLE</AppText>
            <AppText style={styles.metaValue}>{vehicleNo}</AppText>
          </View>
        </View>

        <View style={styles.metaItem}>
          <View style={styles.metaIconBox}>
            <AppIcon name="Shield" size={14} color={COLORS.primary} />
          </View>
          <View>
            <AppText style={styles.metaLabel}>VERIFICATION</AppText>
            <AppText style={styles.metaValue}>PIN Code</AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(DeliveryShipmentCard);
