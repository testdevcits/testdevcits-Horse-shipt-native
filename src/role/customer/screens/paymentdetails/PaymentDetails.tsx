import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { COLORS } from '../../../../constants';
import { AppText } from '../../../../components';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-toast-message';
import AppIcon from '../../../../components/AppIcon';
import styles from './styles.paymentdetails';

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
      const cleanTxId = (payment?.transactionId || 'receipt').replace(
        /[^a-zA-Z0-9_-]/g,
        '_',
      );
      const filename = `Receipt_${cleanTxId}.pdf`;
      const path = `${
        Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir
      }/${filename}`;

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <AppIcon name={'ChevronLeft'} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Receipt Details</AppText>
        <TouchableOpacity onPress={handleDownloadReceipt}>
          <AppIcon name={'Download'} size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Success Hero */}
        <View style={styles.heroCard}>
          <View style={styles.successCircle}>
            <AppIcon
              name={'CheckCircle2'}
              size={32}
              color={COLORS.white}
              fill={COLORS.success}
            />
          </View>
          <AppText style={styles.heroStatus}>Payment Succeeded</AppText>
          <AppText style={styles.heroAmount}>
            ${payment?.amount.toFixed(2)}
          </AppText>
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
              <AppIcon name={'Copy'} size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipper Details */}
        <AppText style={styles.sectionTitle}>Shipper Information</AppText>
        <View style={styles.infoCard}>
          <View style={styles.shipperRow}>
            <View style={styles.avatar}>
              <AppIcon name={'User'} size={24} color={COLORS.grey400} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.shipperName}>
                {payment?.shipper?.name}
              </AppText>
              <AppText style={styles.shipperEmail}>
                {payment?.shipper?.email}
              </AppText>
            </View>
            {/* <TouchableOpacity style={styles.phoneBtn}>
              <AppIcon name={'Phone'} size={18} color={COLORS.white} />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Shipment Route */}
        <AppText style={styles.sectionTitle}>Shipment Route</AppText>
        <View style={styles.infoCard}>
          <View style={styles.routeRow}>
            <AppIcon name={'MapPin'} size={18} color={COLORS.primary} />
            <AppText style={styles.routeText}>
              {payment?.pickupLocation}
            </AppText>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <AppIcon name={'MapPin'} size={18} color={COLORS.error} />
            <AppText style={styles.routeText}>
              {payment?.deliveryLocation}
            </AppText>
          </View>
        </View>

        {/* External Link */}
        <TouchableOpacity style={styles.receiptBtn} onPress={handleOpenReceipt}>
          <AppText style={styles.receiptBtnText}>
            View Official Stripe Receipt
          </AppText>
          <AppIcon name={'ExternalLink'} size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PaymentDetails;
