import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { MapPin, Calendar, ArrowRight, Truck, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

interface TripCardProps {
  item: any;
  onCompletePress?: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TripCard: React.FC<TripCardProps> = ({ item, onCompletePress, containerStyle }) => {
  const shipmentData = item?.shipment || {};
  const status = item?.tripStatus;
  const isTransit = status === 'inTransit' || status === 'started';

  return (
    <View style={[styles.card, containerStyle]}>
      {/* Route Header & Badging */}
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleRow}>
          <AppText style={styles.routeHeader}>DISPATCH MANIFEST</AppText>
          {shipmentData?.shipmentCode && (
            <AppText style={styles.shipmentCodeTag}>#{shipmentData?.shipmentCode}</AppText>
          )}
        </View>

        <View style={[
          styles.statusBadge,
          isTransit ? styles.statusBadgeActive : styles.statusBadgePending
        ]}>
          <View style={[styles.statusDot, isTransit ? styles.activeDot : styles.pendingDot]} />
          <AppText style={[
            styles.statusBadgeText,
            isTransit ? styles.statusActiveText : styles.statusPendingText
          ]}>
            {isTransit ? 'In Transit' : status || 'Pending'}
          </AppText>
        </View>
      </View>

      {/* Route Details Flow */}
      <View style={styles.routeRow}>
        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotGreen} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.pickupLocation || 'Unknown Pickup'}
          </AppText>
        </View>

        <ArrowRight size={14} color={COLORS.primary} style={styles.arrowIcon} />

        <View style={styles.locationWrapper}>
          <View style={styles.nodeDotRed} />
          <AppText style={styles.locationText} numberOfLines={2}>
            {shipmentData?.deliveryLocation || 'Unknown Dropoff'}
          </AppText>
        </View>
      </View>

      {/* Shipment Specs Grid */}
      <View style={styles.footerRow}>
        <View style={styles.infoBadge}>
          <Truck size={14} color={COLORS.primary} />
          <AppText style={styles.infoText}>
            {shipmentData?.numberOfHorses || 1} {shipmentData?.numberOfHorses === 1 ? 'Horse' : 'Horses'}
          </AppText>
        </View>

        <View style={styles.infoBadge}>
          <ShieldCheck size={14} color={COLORS.greenActive} />
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
          <AppText style={styles.actionButtonText}>Complete Delivery (OTP)</AppText>
          <ChevronRight size={16} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(TripCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeHeader: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  shipmentCodeTag: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: { backgroundColor: '#16A34A' },
  pendingDot: { backgroundColor: '#D97706' },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  statusActiveText: {
    color: '#15803D',
  },
  statusPendingText: {
    color: '#B45309',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.grey50,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.md,
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
    backgroundColor: '#10B981',
  },
  nodeDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  locationText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: SPACING.xs,
  },
  footerRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.md,
  },
  actionButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
  },
});