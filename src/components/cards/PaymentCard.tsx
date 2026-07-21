import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const PaymentCard = memo(({ item, onPress }: { item: any; onPress: (item: any) => void }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => onPress(item)}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.iconBg}>
            <CreditCard size={18} color={COLORS.goldPrimary} />
          </View>
          <View>
            <AppText style={styles.brandText}>{item.cardBrand.toUpperCase()} •••• {item.last4}</AppText>
            <AppText style={styles.dateText}>{item.paymentDateTime}</AppText>
          </View>
        </View>
        <AppText style={styles.amount}>${item.amount.toFixed(2)}</AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.routeContainer}>
        <AppText style={styles.location} numberOfLines={1}>{item.pickupLocation}</AppText>
        <ArrowRight size={12} color={COLORS.grey400} style={styles.arrow} />
        <AppText style={styles.location} numberOfLines={1}>{item.deliveryLocation}</AppText>
      </View>

      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <ShieldCheck size={12} color={COLORS.success} />
          <AppText style={styles.statusText}>Secure Payment</AppText>
        </View>
        <ChevronRight size={16} color={COLORS.grey300} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.goldLightBg, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.textPrimary },
  dateText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.goldPrimary },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.md },
  routeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  location: { flex: 1, fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  arrow: { marginHorizontal: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.grey50, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.round },
  statusText: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.success, textTransform: 'uppercase' }
});

export default PaymentCard;