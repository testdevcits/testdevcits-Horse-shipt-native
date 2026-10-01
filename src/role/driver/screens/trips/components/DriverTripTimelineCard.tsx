import React from 'react';
import { View } from 'react-native';
import AppText from '../../../../../components/common/AppText';
import styles from '../styles.shipmentdetails';

interface Props {
  pickupLoc: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLoc: string;
  deliveryLat?: number;
  deliveryLng?: number;
  tripStatus: string;
  paymentStatus: string | null;
  vehicleType: string;
}

export const DriverTripTimelineCard: React.FC<Props> = React.memo(
  ({
    pickupLoc,
    pickupLat,
    pickupLng,
    deliveryLoc,
    deliveryLat,
    deliveryLng,
    tripStatus,
    paymentStatus,
    vehicleType,
  }) => {
    return (
      <View style={styles.card}>
        <View style={styles.locationTimelineRow}>
          <View style={styles.timelineGraphic}>
            <View style={styles.dotOrigin} />
            <View style={styles.timelineLine} />
            <View style={styles.dotDestination} />
          </View>

          <View style={styles.locationDetailsCol}>
            {/* Origin */}
            <View style={styles.locationBlock}>
              <AppText style={styles.locationTag}>Origin</AppText>
              <View style={styles.locationHeaderRow}>
                <AppText style={styles.locationTitle} numberOfLines={2}>
                  {pickupLoc}
                </AppText>
              </View>
              {pickupLat != null && pickupLng != null && (
                <AppText style={styles.locationSubtext}>
                  ({pickupLat.toFixed(3)}, {pickupLng.toFixed(3)})
                </AppText>
              )}
            </View>

            {/* Destination */}
            <View style={styles.locationBlock}>
              <AppText style={styles.locationTagDelivered}>
                {tripStatus === 'completed' || tripStatus === 'delivered'
                  ? 'Delivered'
                  : 'Destination'}
              </AppText>
              <View style={styles.locationHeaderRow}>
                <AppText style={styles.locationTitle} numberOfLines={2}>
                  {deliveryLoc}
                </AppText>
              </View>
              {deliveryLat != null && deliveryLng != null && (
                <AppText style={styles.locationSubtext}>
                  ({deliveryLat.toFixed(3)}, {deliveryLng.toFixed(3)})
                </AppText>
              )}
            </View>
          </View>
        </View>

        {/* Trip Summary Row */}
        <View style={styles.tripSummaryRow}>
          <View style={styles.summaryCol}>
            <AppText style={styles.summaryLabel}>Trip State</AppText>
            <AppText style={styles.summaryValue}>
              {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
            </AppText>
          </View>
          {paymentStatus && (
            <View style={styles.summaryCol}>
              <AppText style={styles.summaryLabel}>Payment</AppText>
              <AppText style={[styles.summaryValue, { color: '#92400E' }]}>
                {paymentStatus}
              </AppText>
            </View>
          )}
          <View style={styles.summaryCol}>
            <AppText style={styles.summaryLabel}>Method</AppText>
            <AppText style={styles.summaryValue}>{vehicleType}</AppText>
          </View>
        </View>
      </View>
    );
  },
);
