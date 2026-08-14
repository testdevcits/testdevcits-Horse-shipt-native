import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../../constants';
import { AppText, Button as ButtonCompt } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';

interface DeliveredSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onLeaveReview?: () => void;
}

const DeliveredSuccessModal = ({
  visible,
  onClose,
  onLeaveReview,
}: DeliveredSuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* SUCCESS GIF ANIMATION */}
          <View style={styles.gifContainer}>
            <Image
              source={imageIndex.success}
              style={styles.successGif}
              resizeMode="contain"
            />
          </View>

          {/* TEXT CONTENT */}
          <AppText style={styles.title}>Shipment Delivered!</AppText>

          <AppText style={styles.description}>
            This shipment has been successfully completed and delivered.
          </AppText>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            {onLeaveReview && (
              <ButtonCompt
                title="Leave a Review"
                onPress={() => {
                  onClose();
                  onLeaveReview();
                }}
              // buttonStyle={styles.primaryBtn}
              // textStyle={styles.primaryBtnText}
              />
            )}

            <ButtonCompt
              title="Close"
              onPress={onClose}
              buttonStyle={onLeaveReview ? styles.secondaryBtn : styles.primaryBtn}
              textStyle={onLeaveReview ? styles.secondaryBtnText : styles.primaryBtnText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  gifContainer: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successGif: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    lineHeight: 28,
  },
  description: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
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

  },
  secondaryBtn: {
    backgroundColor: '#F2F4F5',


    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,

  },
});

export default DeliveredSuccessModal;
