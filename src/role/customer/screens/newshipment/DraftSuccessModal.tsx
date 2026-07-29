import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';

interface DraftSuccessModalProps {
  visible: boolean;
  onReview: () => void;
  onDashboard: () => void;
}

const DraftSuccessModal = ({
  visible,
  onReview,
  onDashboard,
}: DraftSuccessModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* LOGO SECTION */}
          <View style={styles.logoContainer}>
            <Image
              source={imageIndex.LogoIcon}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TEXT CONTENT */}
          <AppText style={styles.title}>Your Shipment is in Draft</AppText>

          <AppText style={styles.description}>
            You have successfully added a new shipment, but it is still in
            draft. Please review the details and publish it to make it active
            and visible to service providers.
          </AppText>

          {/* ACTION BUTTONS (Row Layout) */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={onReview}
              activeOpacity={0.8}
            >
              <AppText style={styles.reviewBtnText}>Review & Publish</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dashboardBtn}
              onPress={onDashboard}
              activeOpacity={0.8}
            >
              <AppText style={styles.dashboardBtnText}>Go to Dashboard</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    width: 70,
    height: 70,
    marginBottom: SPACING.lg,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.sm,
  },
  reviewBtn: {
    flex: 1,
    backgroundColor: COLORS.goldPrimary,
    height: 50,
    borderRadius: RADIUS.xs, // Square-ish corners like in the image
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  dashboardBtn: {
    flex: 1,
    backgroundColor: '#E9ECEF', // Light grey like image
    height: 50,
    borderRadius: RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardBtnText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});

export default DraftSuccessModal;
