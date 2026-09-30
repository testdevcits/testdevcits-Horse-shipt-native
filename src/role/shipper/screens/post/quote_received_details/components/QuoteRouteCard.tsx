import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS, ICON_SIZE } from '../../../../../../constants';
import styles from '../styles.QuoteReceivedDetails';

interface QuoteRouteCardProps {
  pickupLocation: string;
  pickupDate: any;
  deliveryLocation: string;
  deliveryDate: any;
  formatDate: (date: any) => string;
  formatTime: (date: any) => string;
}

export const QuoteRouteCard: React.FC<QuoteRouteCardProps> = memo(({
  pickupLocation,
  pickupDate,
  deliveryLocation,
  deliveryDate,
  formatDate,
  formatTime,
}) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <View>
          <AppText style={styles.sectionTitle}>Shipment Route</AppText>
          <AppText style={styles.sectionSubtitle}>
            Pickup and delivery details
          </AppText>
        </View>
        <View style={styles.routeIcon}>
          <AppIcon name="Route" size={ICON_SIZE.sm} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.routeCard}>
        {/* Pickup */}
        <View style={styles.locationRow}>
          <View style={styles.timelineContainer}>
            <View
              style={[
                styles.locationDot,
                { backgroundColor: COLORS.greenPrimary },
              ]}
            />
            <View style={styles.timelineLine} />
          </View>

          <View style={styles.locationContent}>
            <View style={styles.locationHeader}>
              <AppText style={styles.locationType}>PICKUP</AppText>
              <View style={styles.datePill}>
                <AppIcon
                  name="Calendar"
                  size={ICON_SIZE.xs}
                  color={COLORS.greenPrimary}
                />
                <AppText style={styles.datePillText}>
                  {formatDate(pickupDate)}
                </AppText>
              </View>
            </View>
            <AppText style={styles.locationText}>{pickupLocation}</AppText>
            {pickupDate && (
              <View style={styles.timeRow}>
                <AppIcon
                  name="Clock"
                  size={ICON_SIZE.xs}
                  color={COLORS.textLight}
                />
                <AppText style={styles.timeText}>
                  {formatTime(pickupDate) || 'Scheduled pickup'}
                </AppText>
              </View>
            )}
          </View>
        </View>

        {/* Delivery */}
        <View style={styles.locationRow}>
          <View style={styles.timelineContainer}>
            <View
              style={[
                styles.locationDot,
                { backgroundColor: COLORS.redPrimary },
              ]}
            />
          </View>

          <View style={styles.locationContent}>
            <View style={styles.locationHeader}>
              <AppText style={styles.locationType}>DELIVERY</AppText>
              <View
                style={[
                  styles.datePill,
                  { backgroundColor: COLORS.redLightBg },
                ]}
              >
                <AppIcon
                  name="Calendar"
                  size={ICON_SIZE.xs}
                  color={COLORS.redPrimary}
                />
                <AppText
                  style={[styles.datePillText, { color: COLORS.redPrimary }]}
                >
                  {formatDate(deliveryDate)}
                </AppText>
              </View>
            </View>
            <AppText style={styles.locationText}>{deliveryLocation}</AppText>
            {deliveryDate && (
              <View style={styles.timeRow}>
                <AppIcon
                  name="Clock"
                  size={ICON_SIZE.xs}
                  color={COLORS.textLight}
                />
                <AppText style={styles.timeText}>
                  {formatTime(deliveryDate) || 'Scheduled delivery'}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
});

export default QuoteRouteCard;
