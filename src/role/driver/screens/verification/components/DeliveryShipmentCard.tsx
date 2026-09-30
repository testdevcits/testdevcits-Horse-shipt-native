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
  return (
    <View style={styles.shipmentCard}>
      <AppText style={styles.shipmentHeaderLabel}>SHIPMENT DETAILS</AppText>

      <View style={styles.shipmentTitleRow}>
        <AppText style={styles.shipmentTitle}>
          {shipment?.shipment?.horses?.[0]?.registeredName || 'Not Available'}
        </AppText>
        <View style={styles.passengerCountBadge}>
          <AppText style={styles.badgeText}>
            {shipment?.shipment?.numberOfHorses}{' '}
            {shipment?.shipment?.numberOfHorses > 1 ? 'Horses' : 'Horse'}
          </AppText>
        </View>
      </View>

      {/* Pickup */}
      <View style={styles.stopBox}>
        <AppText style={styles.stopHeaderLabel}>PICKUP</AppText>
        <AppText style={styles.stopName}>
          {shipment?.shipment?.pickupLocation}
        </AppText>
      </View>

      {/* Delivery */}
      <View style={styles.stopBox}>
        <AppText style={styles.stopHeaderLabel}>DELIVERY</AppText>
        <AppText style={styles.stopName}>
          {shipment?.shipment?.deliveryLocation}
        </AppText>
      </View>

      {/* Metadata Fields */}
      <View style={styles.metaRow}>
        <AppIcon
          name="User"
          size={16}
          color={COLORS.textLight}
          style={styles.metaIcon}
        />
        <View>
          <AppText style={styles.metaLabel}>CUSTOMER</AppText>
          <AppText style={styles.metaValue}>
            Customer name not available
          </AppText>
        </View>
      </View>

      <View
        style={[styles.metaRow, { borderBottomWidth: 0, paddingBottom: 0 }]}
      >
        <AppIcon
          name="Truck"
          size={16}
          color={COLORS.textLight}
          style={styles.metaIcon}
        />
        <View>
          <AppText style={styles.metaLabel}>VEHICLE</AppText>
          <AppText style={styles.metaValue}>
            {shipment?.vehicle?.vehicleNumber || 'Not Available'}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default memo(DeliveryShipmentCard);
