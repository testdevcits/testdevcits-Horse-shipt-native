import {
  View,
  
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { memo } from 'react';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from '../../../../../../constants';
import { AppText } from '../../../../../../components';

const QuoteActionButtons = ({
  isAccepted,
  quote,
  isCancellationWindowActive,
  isCompleted,
  setIsCancelModalVisible,
  isPending,
  isAcceptedTerms,
  signature,
  cardDetails,
  loading,
  handleProcessFlow,
  isRejected,
  isCancelled,
}:any) => {
  return (
    <View style={styles.footerActionContainer}>
      {isAccepted && !quote?.isCancelled && (
        <View style={styles.acceptedContainer}>
          <View style={styles.successMessageCard}>
            <AppIcon
              name={'CheckCircle2'}
              size={ICON_SIZE.md}
              color={COLORS.greenPrimary}
            />
            <View style={{ flex: 1 }}>
              <AppText style={styles.successTitle}>
                Quote Accepted & Secured
              </AppText>
              <AppText style={styles.successSub}>
                Your shipment is confirmed.
              </AppText>
            </View>
          </View>
          {isCancellationWindowActive && isCompleted === false && (
            <TouchableOpacity
              style={styles.cancelBookingBtn}
              activeOpacity={0.8}
              onPress={() => setIsCancelModalVisible(true)}
            >
              <AppIcon
                name={'AlertCircle'}
                size={ICON_SIZE.sm}
                color={COLORS.error}
              />
              <AppText style={styles.cancelBookingText}>
                Cancel Shipment
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isPending && (
        <TouchableOpacity
          style={[
            styles.acceptBtn,
            (!isAcceptedTerms ||
              !signature ||
              !cardDetails?.complete ||
              loading) &&
              styles.disabledBtn,
          ]}
          disabled={
            !isAcceptedTerms || !signature || !cardDetails?.complete || loading
          }
          activeOpacity={0.85}
          onPress={handleProcessFlow}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.acceptBtnInner}>
              <AppIcon
                name={'ShieldCheck'}
                size={ICON_SIZE.sm}
                color={COLORS.white}
              />
              <AppText style={styles.acceptBtnText}>Pay & Accept Quote</AppText>
            </View>
          )}
        </TouchableOpacity>
      )}

      {(isRejected || isCancelled) && (
        <View style={styles.inactiveState}>
          <AppText style={styles.inactiveText}>
            This quote is no longer active.
          </AppText>
        </View>
      )}
    </View>
  );
};

export default memo(QuoteActionButtons);

const styles = StyleSheet.create({
  footerActionContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
  },
  acceptedContainer: { gap: SPACING.sm },
  successMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLightBg,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
  },
  successTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
  },
  successSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.emeraldDark,
    marginTop: 1,
  },
  cancelBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: SPACING.xs,
    backgroundColor: COLORS.redLightBg,
  },
  cancelBookingText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },

  inactiveState: {
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.divider,
    borderRadius: RADIUS.sm,
  },
  inactiveText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  disabledBtn: {
    opacity: 0.6,
    backgroundColor: COLORS.black,
    shadowOpacity: 0,
    elevation: 0,
  },
  acceptBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },
});
