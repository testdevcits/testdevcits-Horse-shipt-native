import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import { formatDate } from '../../../../../../utils/helpers';
import styles from './styles.OverViewTab';

interface ShipmentStatusTimelineProps {
  pickupLocation?: string;
  pickupDateRange?: { start?: string; end?: string };
  deliveryLocation?: string;
  deliveryDateRange?: { start?: string; end?: string };
}

const formatDateRange = (start?: string, end?: string) => {
  if (!start && !end) return 'N/A';
  const s = start ? formatDate(start, 'MMM DD, YYYY') : '';
  const e = end ? formatDate(end, 'MMM DD, YYYY') : '';
  if (s && e) return `${s} - ${e}`;
  return s || e;
};

const ShipmentStatusTimeline: React.FC<ShipmentStatusTimelineProps> = ({
  pickupLocation,
  pickupDateRange,
  deliveryLocation,
  deliveryDateRange,
}) => {
  return (
    <View style={styles.timelineContainer}>
      {/* Pickup Block */}
      <View style={styles.timelineItem}>
        <View style={[styles.timelineDot, { backgroundColor: COLORS.error }]}>
          <AppIcon name={'MapPin'} size={12} color={COLORS.white} />
        </View>
        <View style={styles.timelineContent}>
          <AppText style={styles.timelineLabel}>PICKUP LOCATION</AppText>
          <AppText style={styles.timelineAddress} numberOfLines={2}>
            {pickupLocation || 'N/A'}
          </AppText>
          <View style={styles.dateChip}>
            <AppIcon name={'Calendar'} size={12} color={COLORS.goldDarkText} />
            <AppText style={styles.dateChipText}>
              {formatDateRange(pickupDateRange?.start, pickupDateRange?.end)}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.timelineLine} />

      {/* Delivery Block */}
      <View style={styles.timelineItem}>
        <View style={[styles.timelineDot, { backgroundColor: COLORS.success }]}>
          <AppIcon name={'MapPin'} size={12} color={COLORS.white} />
        </View>
        <View style={styles.timelineContent}>
          <AppText style={styles.timelineLabel}>DELIVERY LOCATION</AppText>
          <AppText style={styles.timelineAddress} numberOfLines={3}>
            {deliveryLocation || 'N/A'}
          </AppText>
          <View style={styles.dateChip}>
            <AppIcon name={'Calendar'} size={12} color={COLORS.goldDarkText} />
            <AppText style={styles.dateChipText}>
              {formatDateRange(deliveryDateRange?.start, deliveryDateRange?.end)}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(ShipmentStatusTimeline);
