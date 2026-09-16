import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../constants';
import AppText from '../../common/AppText';
import AppIcon from '../../AppIcon';
import styles from './styles.PaymentCard';

interface PaymentCardProps {
  item: any;
  onPress?: (item: any) => void;
}

const PaymentCard = memo(({ item, onPress }: PaymentCardProps) => {
  const brand = (
    item?.cardBrand ||
    item?.brand ||
    item?.paymentMethod ||
    'Not Available'
  ).toUpperCase();
  const last4 = item?.last4 ? `•••• ${item?.last4}` : '';
  const title = last4 ? `${brand} ${last4}` : brand;
  const dateStr =
    item?.paymentDateTime ||
    (item?.createdAt
      ? new Date(item?.createdAt).toLocaleDateString('en-US')
      : '');

  const amountStr =
    typeof item?.amount === 'number'
      ? `$${item?.amount.toFixed(2)}`
      : item?.amount
      ? `$${item?.amount}`
      : '$0.00';

  const pickup = item?.pickupLocation || item?.shipment?.pickupLocation || '';
  const delivery =
    item?.deliveryLocation || item?.shipment?.deliveryLocation || '';
  const isSecure =
    (item?.status || 'succeeded').toLowerCase() === 'succeeded' ||
    item?.isSecure !== false;

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
            <AppIcon
              name={'CreditCard'}
              size={ICON_SIZE.xs}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.titleCol}>
            {/* Reduced from md to sm */}
            <AppText style={styles.brandText}>{title}</AppText>
            {/* Reduced from sm-1 to xs */}
            {dateStr ? (
              <AppText style={styles.dateText}>{dateStr}</AppText>
            ) : null}
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
          <AppIcon
            name={'ArrowRight'}
            size={12}
            color={COLORS.grey400}
            style={styles.arrow}
          />
          <AppText style={styles.location} numberOfLines={2}>
            {delivery}
          </AppText>
        </View>
      ) : null}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <AppIcon name={'ShieldCheck'} size={12} color={COLORS.success} />
          <AppText style={styles.statusText}>
            {isSecure ? 'Secure' : 'Completed'}
          </AppText>
        </View>
        <AppIcon
          name={'ChevronRight'}
          size={ICON_SIZE.xs}
          color={COLORS.grey300}
        />
      </View>
    </TouchableOpacity>
  );
});

export default PaymentCard;
