import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking, StyleSheet, Share, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ChevronLeft, Copy, ExternalLink,
  Download, Verified, MapPin,
  User, Phone
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import { AppText } from '../../../../components';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-toast-message';

const PaymentDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { payment } = route.params;

  const onCopy = () => Share.share({ message: payment?.transactionId });

  const handleDownloadReceipt = async () => {
    const url = payment?.receiptUrl;
    if (!url) {
      Toast.show({
        type: 'info',
        text1: 'No Receipt Available',
        text2: 'Receipt link is not available for this transaction.',
      });
      return;
    }

    try {
      Toast.show({
        type: 'info',
        text1: 'Downloading Receipt',
        text2: 'Starting file download...',
      });

      const { dirs } = ReactNativeBlobUtil.fs;
      const cleanTxId = (payment?.transactionId || 'receipt').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Receipt_${cleanTxId}.pdf`;
      const path = `${Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir}/${filename}`;

      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: filename,
          description: 'Receipt downloaded successfully',
          mime: 'application/pdf',
          mediaScannable: true,
        },
      }).fetch('GET', url);

      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.openDocument(res?.data);
      } else {
        Toast.show({
          type: 'success',
          text1: 'Download Complete',
          text2: 'Saved receipt to Downloads folder',
        });
      }
    } catch (error) {
      console.error('Download Receipt Error:', error);
      // Fallback: Open URL directly in browser if file download fails
      try {
        await Linking.openURL(url);
      } catch (linkErr) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to download or open receipt.',
        });
      }
    }
  };

  const handleOpenReceipt = async () => {
    if (!payment?.receiptUrl) {
      Toast.show({
        type: 'info',
        text1: 'No Receipt Available',
        text2: 'Receipt link is not available for this transaction.',
      });
      return;
    }

    try {
      const supported = await Linking.canOpenURL(payment.receiptUrl);
      if (supported) {
        await Linking.openURL(payment.receiptUrl);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Cannot open receipt URL.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open receipt link.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Receipt Details</AppText>
        <TouchableOpacity onPress={handleDownloadReceipt}>
          <Download size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Success Hero */}
        <View style={styles.heroCard}>
          <View style={styles.successCircle}>
            <Verified size={32} color={COLORS.white} fill={COLORS.success} />
          </View>
          <AppText style={styles.heroStatus}>Payment Succeeded</AppText>
          <AppText style={styles.heroAmount}>${payment?.amount.toFixed(2)}</AppText>
          <AppText style={styles.heroDate}>{payment?.paymentDateTime}</AppText>
        </View>

        {/* Transaction ID Section */}
        <View style={styles.infoCard}>
          <View style={styles.idRow}>
            <View>
              <AppText style={styles.label}>TRANSACTION ID</AppText>
              <AppText style={styles.idText}>{payment?.transactionId}</AppText>
            </View>
            <TouchableOpacity onPress={onCopy} style={styles.copyBtn}>
              <Copy size={16} color={COLORS.primary} />
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
              <AppText style={styles.shipperName}>{payment?.shipper?.name}</AppText>
              <AppText style={styles.shipperEmail}>{payment?.shipper?.email}</AppText>
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
            <MapPin size={18} color={COLORS.primary} />
            <AppText style={styles.routeText}>{payment?.pickupLocation}</AppText>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <MapPin size={18} color={COLORS.error} />
            <AppText style={styles.routeText}>{payment?.deliveryLocation}</AppText>
          </View>
        </View>

        {/* External Link */}
        <TouchableOpacity
          style={styles.receiptBtn}
          onPress={handleOpenReceipt}
        >
          <AppText style={styles.receiptBtnText}>View Official Stripe Receipt</AppText>
          <ExternalLink size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.lg, color: COLORS.textPrimary },
  content: { padding: SPACING.lg },
  heroCard: { alignItems: 'center', marginBottom: SPACING.lg },
  successCircle: { marginBottom: SPACING.sm },
  heroStatus: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.success, textTransform: 'uppercase', letterSpacing: 1 },
  heroAmount: { fontSize: FONT_SIZE.heading, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginVertical: 2 },
  heroDate: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  infoCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.divider },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 1 },
  idText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: COLORS.textPrimary, marginTop: 2 },
  copyBtn: { padding: 8, backgroundColor: COLORS.goldLightBg, borderRadius: RADIUS.sm },
  sectionTitle: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.xs, marginLeft: 4 },
  shipperRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.grey100, alignItems: 'center', justifyContent: 'center' },
  shipperName: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm, color: COLORS.textPrimary },
  shipperEmail: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  phoneBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  routeText: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  routeLine: { width: 2, height: 16, backgroundColor: COLORS.goldBorder, marginLeft: 8, marginVertical: 2 },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: SPACING.md, backgroundColor: COLORS.goldLightBg, borderRadius: RADIUS.md, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary },
  receiptBtnText: { fontFamily: FONTS.bold, color: COLORS.primary, fontSize: FONT_SIZE.sm }
});

export default PaymentDetails;