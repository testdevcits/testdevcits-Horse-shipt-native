import { View,   Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { AppText, Input } from '../../../../../../components';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../../../constants';

const CancelModal = ({
  isCancelModalVisible,
  cancelReason,
  setCancelReason,
  cancelReasonError,
  setCancelReasonError,
  setIsCancelModalVisible,
  handleCancelShipment,
}: any) => {
  return (
    <Modal visible={isCancelModalVisible} transparent animationType="fade">
      <View style={styles.promptOverlay}>
        <View style={styles.promptContent}>
          <AppText style={styles.promptTitle}>Cancel Shipment</AppText>
          <AppText style={styles.promptSub}>
            Please state the reason for cancelling this shipment quote:
          </AppText>
          <Input
            placeholder="Enter reason here..."
            multiline
            value={cancelReason}
            onChangeText={text => {
              setCancelReason(text);
              if (cancelReasonError) setCancelReasonError('');
            }}
            containerStyle={{ marginBottom: SPACING.md }}
            error={cancelReasonError}
          />
          <View style={styles.promptFooter}>
            <TouchableOpacity
              style={styles.promptBtnSecondary}
              onPress={() => setIsCancelModalVisible(false)}
            >
              <AppText style={styles.promptBtnTextSecondary}>
                Keep Booking
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.promptBtnPrimary}
              onPress={handleCancelShipment}
            >
              <AppText style={styles.promptBtnTextPrimary}>
                Confirm Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(CancelModal);
const styles = StyleSheet.create({
  promptOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  promptContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  promptTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  promptSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  reasonInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    height: 80,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  promptFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  promptBtnSecondary: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
  },
  promptBtnTextSecondary: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
  promptBtnPrimary: {
    flex: 1.5,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.error,
  },
  promptBtnTextPrimary: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});
