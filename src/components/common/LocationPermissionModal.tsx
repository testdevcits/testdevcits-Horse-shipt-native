import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { MapPin, ShieldCheck, Navigation, X } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, SIZES } from '../../constants';
import AppText from './AppText';
import { openDeviceSettings } from '../../utils/permissionHelper';

interface LocationPermissionModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isVisible,
  onClose,
  title = 'Background Location Mandate',
  message = 'Horse Shipt mandates background location access ("Allow all the time") to automatically sync your trip progress with dispatchers even when the app is in the background or closed.',
}) => {
  const handleOpenSettings = () => {
    onClose();
    openDeviceSettings();
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <X size={20} color={COLORS.grey400} />
          </TouchableOpacity>

          {/* Icon Header */}
          <View style={styles.iconContainer}>
            <MapPin size={32} color={COLORS.brandBrown} strokeWidth={2.2} />
            <View style={styles.badgeIcon}>
              <ShieldCheck size={14} color={COLORS.white} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.description}>{message}</AppText>

            {/* Instruction Box */}
            <View style={styles.instructionBox}>
              <View style={styles.instructionRow}>
                <Navigation size={16} color={COLORS.brandBrown} style={{ marginTop: 2 }} />
                <AppText style={styles.instructionText}>
                  Set Location permission to <AppText style={styles.boldText}>"Allow all the time"</AppText> in device settings to start trip tracking.
                </AppText>
              </View>
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AppText style={styles.cancelText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleOpenSettings}
              activeOpacity={0.85}
            >
              <AppText style={styles.confirmText}>Open Settings</AppText>
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    width: SIZES.iconHeaderBg,
    height: SIZES.iconHeaderBg,
    borderRadius: RADIUS.round,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  badgeIcon: {
    position: 'absolute',
    bottom: -SPACING.xxs,
    right: -SPACING.xxs,
    backgroundColor: COLORS.brandBrown,
    borderRadius: RADIUS.sm2,
    padding: SPACING.xxs,
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grey600,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
  },
  instructionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: SIZES.borderWidthThin,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  instructionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.grey700,
    flex: 1,
    lineHeight: 18,
    fontFamily: FONTS.medium,
  },
  boldText: {
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.grey100,
  },
  confirmButton: {
    backgroundColor: COLORS.brandBrown,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  confirmText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default LocationPermissionModal;
