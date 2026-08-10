import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import { AppText } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';

interface PublishedSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewShipment: () => void;
}

const PublishedSuccessModal = ({
  visible,
  onClose,
  onViewShipment,
}: PublishedSuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* LOGO SECTION */}
          <View style={styles.logoContainer}>
            <Image
              source={imageIndex.LogoIcon} // Replace with your actual path
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TEXT CONTENT */}
          <AppText style={styles.title}>
            Your shipment request has been published
          </AppText>

          <AppText style={styles.description}>
            To view detailed information about the shipment and quotes received,
            please visit “My Shipments” page.
          </AppText>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onViewShipment}
              activeOpacity={0.8}
            >
              <AppText style={styles.primaryBtnText}>
                View shipment published
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <AppText style={styles.secondaryBtnText}>Close</AppText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark dimmed background
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 26,
  },
  description: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
  secondaryBtn: {
    backgroundColor: '#F2F4F5', // Light grey background like image
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
});

export default PublishedSuccessModal;
