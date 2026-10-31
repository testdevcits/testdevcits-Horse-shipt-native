import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.Livetracking';

interface TrackingBottomSheetProps {
  isHeadingToPickup: boolean;
  etaFormatted: string;
  distanceKmText: string;
  statusDetails: {
    label: string;
    badgeBg: string;
    isPickupDone: boolean;
    isDelivered: boolean;
  };
  pickupLocation?: string;
  deliveryLocation?: string;
}

export const TrackingBottomSheet: React.FC<TrackingBottomSheetProps> = ({
  isHeadingToPickup,
  etaFormatted,
  distanceKmText,
  statusDetails,
  pickupLocation,
  deliveryLocation,
}) => {
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.sheetHandle} />

      {/* ETA & Distance Row */}
      <View style={styles.etaContainer}>
        <View>
          <AppText style={styles.etaLabel}>
            {isHeadingToPickup ? 'Estimated Pickup Time' : 'Estimated Arrival'}
          </AppText>
          <AppText style={styles.etaTime}>{etaFormatted}</AppText>
        </View>
        <View style={styles.distanceBadge}>
          <AppIcon name="Navigation" size={14} color={COLORS.white} />
          <AppText style={styles.distanceText}>{distanceKmText}</AppText>
        </View>
      </View>

      {/* Stepper Timeline */}
      <View style={styles.timeline}>
        {/* Pickup Step */}
        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelinePoint,
              statusDetails.isPickupDone && styles.timelinePointActive,
            ]}
          >
            <AppIcon
              name="CheckCircle2"
              size={16}
              color={
                statusDetails.isPickupDone ? COLORS.primary : COLORS.grey400
              }
            />
          </View>
          <View style={styles.timelineContent}>
            <AppText style={styles.locationTitle}>Pickup Point</AppText>
            <AppText numberOfLines={1} style={styles.locationSub}>
              {pickupLocation || 'Pickup Location'}
            </AppText>
          </View>
        </View>

        <View style={styles.timelineLine} />

        {/* Delivery Step */}
        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelinePoint,
              statusDetails.isDelivered && styles.timelinePointActive,
            ]}
          >
            {statusDetails.isDelivered ? (
              <AppIcon name="CheckCircle2" size={16} color={COLORS.primary} />
            ) : (
              <AppIcon name="Clock" size={16} color={COLORS.grey400} />
            )}
          </View>
          <View style={styles.timelineContent}>
            <AppText style={styles.locationTitle}>Delivery Destination</AppText>
            <AppText numberOfLines={1} style={styles.locationSub}>
              {deliveryLocation || 'Delivery Destination'}
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.grey300} />
        </View>
      </View>
    </View>
  );
};
