import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking, StyleSheet, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { 
  ChevronLeft, Copy, ExternalLink, 
  Download, Verified, MapPin, 
  User, Mail, Phone 
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';
 
const PaymentDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { payment } = route.params;

  const onCopy = () => Share.share({ message: payment.transactionId });

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Receipt Details</AppText>
        <TouchableOpacity onPress={() => Linking.openURL(payment.receiptUrl)}>
          <Download size={20} color={COLORS.goldPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Success Hero */}
        <View style={styles.heroCard}>
          <View style={styles.successCircle}>
            <Verified size={32} color={COLORS.white} fill={COLORS.success} />
          </View>
          <AppText style={styles.heroStatus}>Payment Succeeded</AppText>
          <AppText style={styles.heroAmount}>${payment.amount.toFixed(2)}</AppText>
          <AppText style={styles.heroDate}>{payment.paymentDateTime}</AppText>
        </View>

        {/* Transaction ID Section */}
        <View style={styles.infoCard}>
          <View style={styles.idRow}>
            <View>
              <AppText style={styles.label}>TRANSACTION ID</AppText>
              <AppText style={styles.idText}>{payment.transactionId}</AppText>
            </View>
            <TouchableOpacity onPress={onCopy} style={styles.copyBtn}>
              <Copy size={16} color={COLORS.goldPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipper Details */}
        <AppText style={styles.sectionTitle}>Shipper Information</AppText>
        <View style={styles.infoCard}>
          <View style={styles.shipperRow}>
            <View style={styles.avatar}>
               <User size={24} color={COLORS.grey400} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.shipperName}>{payment.shipper.name}</AppText>
              <AppText style={styles.shipperEmail}>{payment.shipper.email}</AppText>
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
               <Phone size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipment Route */}
        <AppText style={styles.sectionTitle}>Shipment Route</AppText>
        <View style={styles.infoCard}>
          <View style={styles.routeRow}>
            <MapPin size={18} color={COLORS.goldPrimary} />
            <AppText style={styles.routeText}>{payment.pickupLocation}</AppText>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <MapPin size={18} color={COLORS.error} />
            <AppText style={styles.routeText}>{payment.deliveryLocation}</AppText>
          </View>
        </View>

        {/* External Link */}
        <TouchableOpacity 
          style={styles.receiptBtn} 
          onPress={() => Linking.openURL(payment.receiptUrl)}
        >
          <AppText style={styles.receiptBtnText}>View Official Stripe Receipt</AppText>
          <ExternalLink size={16} color={COLORS.goldPrimary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.white },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary },
  content: { padding: SPACING.lg },
  heroCard: { alignItems: 'center', marginBottom: SPACING.xl },
  successCircle: { marginBottom: SPACING.md },
  heroStatus: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.success, textTransform: 'uppercase', letterSpacing: 1 },
  heroAmount: { fontSize: 42, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginVertical: 4 },
  heroDate: { fontSize: 13, color: COLORS.textSecondary },
  infoCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.divider },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 1 },
  idText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textPrimary, marginTop: 4 },
  copyBtn: { padding: 8, backgroundColor: COLORS.goldLightBg, borderRadius: RADIUS.sm },
  sectionTitle: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginLeft: 4 },
  shipperRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.grey100, alignItems: 'center', justifyContent: 'center' },
  shipperName: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.textPrimary },
  shipperEmail: { fontSize: 12, color: COLORS.textSecondary },
  phoneBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.goldPrimary, alignItems: 'center', justifyContent: 'center' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  routeText: { flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  routeLine: { width: 2, height: 20, backgroundColor: COLORS.goldBorder, marginLeft: 8, marginVertical: 4 },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: SPACING.lg, backgroundColor: COLORS.goldLightBg, borderRadius: RADIUS.lg, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.goldPrimary },
  receiptBtnText: { fontFamily: FONTS.bold, color: COLORS.goldPrimary, fontSize: 14 }
});

export default PaymentDetails;