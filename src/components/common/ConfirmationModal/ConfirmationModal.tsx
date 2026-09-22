import React, { memo } from 'react';
import { Modal,   View, TouchableOpacity } from 'react-native';
import {
  LucideIcon,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react-native';
import { COLORS, ICON_SIZE } from '../../../constants';
import AppText from '../AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './ConfirmationModal.styles';

export type ModalType = 'danger' | 'success' | 'info' | 'warning';

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  Icon?: LucideIcon; // Custom icon from Lucide
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  Icon,
  isLoading = false,
}) => {
  // Map colors and default icons based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          color: COLORS.error,
          bg: COLORS.redLightBg,
          DefaultIcon: AlertTriangle,
        };
      case 'success':
        return {
          color: COLORS.success,
          bg: COLORS.greenLightBg2,
          DefaultIcon: CheckCircle2,
        };
      case 'warning':
        return {
          color: COLORS.warning,
          bg: COLORS.goldCreamBg,
          DefaultIcon: AlertTriangle,
        };
      default:
        return {
          color: COLORS.primary,
          bg: COLORS.blueLightBg,
          DefaultIcon: Info,
        };
    }
  };

  const theme = getTypeStyles();
  const ModalIcon = Icon || theme.DefaultIcon;

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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AppIcon name={'X'} size={ICON_SIZE.md} color={COLORS.grey400} />
          </TouchableOpacity>

          {/* Icon Header */}
          <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
            <ModalIcon
              size={ICON_SIZE.xl}
              color={theme.color}
              strokeWidth={2.5}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.description}>{description}</AppText>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <AppText style={styles.cancelText}>{cancelText}</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor:
                    type === 'danger' ? COLORS.error : COLORS.primary,
                },
              ]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              <AppText style={styles.confirmText}>
                {isLoading ? 'Processing...' : confirmText}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ConfirmationModal);
