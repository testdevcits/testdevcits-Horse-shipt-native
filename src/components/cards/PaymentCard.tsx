import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE, ICON_SIZE } from '../../constants';
import AppText from '../common/AppText';

interface PaymentCardProps {
  item: any;
  onPress?: (item: any) => void;
}

const PaymentCard = memo(({ item, onPress }: PaymentCardProps) => {
  const brand = (item?.cardBrand || item?.brand || item?.paymentMethod || 'CARD').toUpperCase();
  const last4 = item?.last4 ? `•••• ${item.last4}` : '';
  const title = last4 ? `${brand} ${last4}` : brand;
  const dateStr = item?.paymentDateTime || (item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : '');

  const amountStr =
    typeof item?.amount === 'number'
      ? `$${item.amount.toFixed(2)}`
      : item?.amount
        ? `$${item.amount}`
        : '$0.00';

  const pickup = item?.pickupLocation || item?.shipment?.pickupLocation || '';
  const delivery = item?.deliveryLocation || item?.shipment?.deliveryLocation || '';
  const isSecure = (item?.status || 'succeeded').toLowerCase() === 'succeeded' || item?.isSecure !== false;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress && onPress(item)}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.iconBg}>
            {/* Reduced icon size from sm to xs */}
            <CreditCard size={ICON_SIZE.xs} color={COLORS.primary} />
          </View>
          <View style={styles.titleCol}>
            {/* Reduced from md to sm */}
            <AppText style={styles.brandText}>{title}</AppText>
            {/* Reduced from sm-1 to xs */}
            {dateStr ? <AppText style={styles.dateText}>{dateStr}</AppText> : null}
          </View>
        </View>
        {/* Reduced from lg to md */}
        <AppText style={styles.amount}>{amountStr}</AppText>
      </View>

      <View style={styles.divider} />

      {/* Route Row */}
      {pickup || delivery ? (
        <View style={styles.routeContainer}>
          {/* Reduced from sm to xs */}
          <AppText style={styles.location} numberOfLines={2}>
            {pickup}
          </AppText>
          <ArrowRight size={12} color={COLORS.grey400} style={styles.arrow} />
          <AppText style={styles.location} numberOfLines={2}>
            {delivery}
          </AppText>
        </View>
      ) : null}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <ShieldCheck size={12} color={COLORS.success} />
          <AppText style={styles.statusText}>
            {isSecure ? 'Secure' : 'Completed'}
          </AppText>
        </View>
        <ChevronRight size={ICON_SIZE.xs} color={COLORS.grey300} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface || COLORS.white,
    borderRadius: RADIUS.md, // Smaller radius for smaller text
    padding: SPACING.sm + 2, // Slightly tighter padding (approx 10px)
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  iconBg: {
    width: 30, // Reduced from 36
    height: 30, // Reduced from 36
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.goldLightBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  brandText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm, // Down from md
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: FONT_SIZE.xs, // Down from sm-1
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md, // Down from lg
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm, // Reduced spacing
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  location: {
    flex: 1,
    fontSize: FONT_SIZE.xs, // Down from sm
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  arrow: {
    marginHorizontal: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.grey50,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  statusText: {
    fontSize: FONT_SIZE.xs - 1, // Scaled down further for the badge
    fontFamily: FONTS.bold,
    color: COLORS.success,
    textTransform: 'uppercase',
  },
});

export default PaymentCard;