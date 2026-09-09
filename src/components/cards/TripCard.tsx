import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../constants';
import AppText from '../common/AppText';
import AppIcon from '../AppIcon';

interface TripCardProps {
  item: any;
  onCompletePress?: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TripCard: React.FC<TripCardProps> = ({
  item,
  onCompletePress,
  containerStyle,
}) => {
  const shipmentData = item?.shipment || {};
  const status = item?.tripStatus;
  const isTransit = status === 'inTransit' || status === 'started';
  const isCompleted = status === 'completed' || status === 'delivered';

  return (
    <View style={[styles.card, containerStyle]}>
      {/* Route Header & Badging */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleRow}>
          <AppText style={styles.routeHeader}>DISPATCH MANIFEST</AppText>
          {shipmentData?.shipmentCode && (
            <AppText style={styles.shipmentCodeTag}>
              #{shipmentData?.shipmentCode}
            </AppText>
          )}
        </View>

        <View
          style={[
            styles.statusBadge,
            isTransit
              ? styles.statusBadgeActive
              : isCompleted
              ? styles.statusBadgeCompleted
              : styles.statusBadgePending,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isTransit
                ? styles.activeDot
                : isCompleted
                ? styles.completedDot
                : styles.pendingDot,
            ]}
          />
          <AppText
            style={[
              styles.statusBadgeText,
              isTransit
                ? styles.statusActiveText
                : isCompleted
                ? styles.statusCompletedText
                : styles.statusPendingText,
            ]}
          >
            {isTransit
              ? 'In Transit'
              : isCompleted
              ? 'Completed'
              : status || 'Pending'}
          </AppText>
        </View>
      </View>

      {/* Route Details Flow */}
      <View style={styles.routeRow}>
        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotGreen} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.pickupLocation || 'Not Available'}
          </AppText>
        </View>

        <AppIcon
          name="ArrowRight"
          size={16}
          color={COLORS.primary}
          style={styles.arrowIcon}
        />

        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotRed} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.deliveryLocation || 'Not Available'}
          </AppText>
        </View>
      </View>

      {/* Shipment Specs Grid */}
      <View style={styles.footerRow}>
        <View style={styles.infoBadge}>
          <AppIcon name="Truck" size={14} color={COLORS.primary} />
          <AppText style={styles.infoText}>
            {shipmentData?.numberOfHorses || 1}{' '}
            {shipmentData?.numberOfHorses === 1 ? 'Horse' : 'Horses'}
          </AppText>
        </View>

        <View style={styles.infoBadge}>
          <AppIcon name="ShieldCheck" size={14} color={COLORS.greenActive} />
          <AppText style={styles.infoText}>Verified Route</AppText>
        </View>
      </View>

      {/* Primary Contextual Action Button */}
      {isTransit && onCompletePress && (
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => onCompletePress(item?._id)}
        >
          <AppText style={styles.actionButtonText}>
            Complete Delivery (OTP)
          </AppText>
          <AppIcon name="ChevronRight" size={16} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(TripCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeHeader: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  shipmentCodeTag: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate400,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.greenBadgeBg,
    borderColor: COLORS.greenBadgeBorder,
  },
  statusBadgeCompleted: {
    backgroundColor: COLORS.goldCreamBg,
    borderColor: COLORS.goldBorder,
  },
  statusBadgePending: {
    backgroundColor: COLORS.amberLightBg,
    borderColor: COLORS.amberBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: { backgroundColor: COLORS.greenBadgeText },
  completedDot: { backgroundColor: COLORS.primary },
  pendingDot: { backgroundColor: COLORS.amberPrimary },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    letterSpacing: 0.4,
  },
  statusActiveText: {
    color: COLORS.greenBadgeText,
  },
  statusCompletedText: {
    color: COLORS.goldDarkText,
  },
  statusPendingText: {
    color: COLORS.amberWarning,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate50,
    borderColor: COLORS.grey200,
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: SPACING.sm2,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nodeDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenActive,
  },
  nodeDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  locationText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate900,
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: SPACING.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate600,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: SPACING.sm2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
  },
});
