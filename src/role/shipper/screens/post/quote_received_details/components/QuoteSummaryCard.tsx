import React, { memo } from 'react';
import { View } from 'react-native';

import { COLORS, ICON_SIZE } from '../../../../../../constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import AppText from '../../../../../../components/common/AppText';
import styles from '../styles.QuoteReceivedDetails';

interface QuoteSummaryCardProps {
  numberOfHorses: number;
  shipmentStatus?: string;
  pickupDate?: string;
  deliveryDate?: string;
  getStatusLabel: (status?: string) => string;
  formatDate: (date?: string) => string;
}

export const QuoteSummaryCard: React.FC<QuoteSummaryCardProps> = memo(
  ({
    numberOfHorses,
    shipmentStatus,
    pickupDate,
    deliveryDate,
    getStatusLabel,
    formatDate,
  }) => {
    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryTitleRow}>
            <View style={styles.smallIconContainer}>
              <AppIcon
                name="Package"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
            </View>
            <AppText style={styles.summaryTitle}>Shipment Summary</AppText>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <AppText style={styles.summaryLabel}>HORSES</AppText>
            <AppText style={styles.summaryValue}>{numberOfHorses}</AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText style={styles.summaryLabel}>SHIPMENT</AppText>
            <AppText style={styles.summaryValueSmall} numberOfLines={1}>
              {shipmentStatus ? getStatusLabel(shipmentStatus) : 'Open'}
            </AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText style={styles.summaryLabel}>PICKUP</AppText>
            <AppText style={styles.summaryValueSmall}>
              {formatDate(pickupDate)}
            </AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText style={styles.summaryLabel}>DELIVERY</AppText>
            <AppText style={styles.summaryValueSmall}>
              {formatDate(deliveryDate)}
            </AppText>
          </View>
        </View>
      </View>
    );
  },
);
