import React, { memo } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../constants';
import AppText from '../AppText';
import { openDeviceSettings } from '../../../utils/permissionHelper';
import AppIcon from '../../app_icon/AppIcon';
import styles from './LocationPermissionModal.styles';

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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <AppIcon name={'X'} size={20} color={COLORS.grey400} />
          </TouchableOpacity>

          {/* Icon Header */}
          <View style={styles.iconContainer}>
            <AppIcon
              name={'MapPin'}
              size={32}
              color={COLORS.brandBrown}
              strokeWidth={2.2}
            />
            <View style={styles.badgeIcon}>
              <AppIcon name={'ShieldCheck'} size={14} color={COLORS.white} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.description}>{message}</AppText>

            {/* Instruction Box */}
            <View style={styles.instructionBox}>
              <View style={styles.instructionRow}>
                <AppIcon
                  name={'Navigation'}
                  size={16}
                  color={COLORS.brandBrown}
                  style={{ marginTop: 2 }}
                />
                <AppText style={styles.instructionText}>
                  Set Location permission to{' '}
                  <AppText style={styles.boldText}>
                    "Allow all the time"
                  </AppText>{' '}
                  in device settings to start trip tracking.
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

export default memo(LocationPermissionModal);
