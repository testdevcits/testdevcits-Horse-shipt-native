import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.deliveryverification';

interface DeliveryStepContentProps {
  step: number;
  otpSentSuccess: boolean;
  otp: string;
  setOtp: (otp: string) => void;
  onSendOtp: () => void;
}

const DeliveryStepContent: React.FC<DeliveryStepContentProps> = ({
  step,
  otpSentSuccess,
  otp,
  setOtp,
  onSendOtp,
}) => {
  if (step === 1) {
    return (
      <View style={styles.centerSection}>
        <View style={styles.middleIconBox}>
          <AppIcon name="Milestone" size={32} color={COLORS.primary} />
        </View>
        <AppText style={styles.mainActionHeading}>Ready to Deliver?</AppText>
        <AppText style={styles.mainActionDescription}>
          Send an OTP to the horse owner to confirm you've arrived at the
          delivery location.
        </AppText>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.centerSection}>
        <View style={styles.middleIconBox}>
          <AppIcon name="Smartphone" size={32} color={COLORS.primary} />
        </View>
        <AppText style={styles.mainActionHeading}>Enter OTP</AppText>
        <AppText style={styles.mainActionDescription}>
          Ask the horse owner for the 6-digit OTP sent to their phone.
        </AppText>

        {otpSentSuccess && (
          <View style={styles.successBanner}>
            <AppIcon name="Check" size={14} color={COLORS.greenSuccess} />
            <AppText style={styles.successBannerText}>
              OTP sent to customer successfully
            </AppText>
          </View>
        )}

        <View style={styles.otpGridContainer}>
          <OtpInput
            numberOfDigits={6}
            focusColor={COLORS.primary}
            onTextChange={text => setOtp(text)}
            onFilled={text => setOtp(text)}
            theme={{
              containerStyle: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              },
              pinCodeContainerStyle: styles.otpInputBox,
              pinCodeTextStyle: styles.otpPinCodeText,
              focusedPinCodeContainerStyle: styles.activeOtpInputBox,
            }}
          />
        </View>
        <AppText style={styles.otpLabelDigits}>
          {otp?.length}/6 digits
        </AppText>

        <TouchableOpacity activeOpacity={0.7} onPress={onSendOtp}>
          <AppText style={styles.resendTextLink}>
            Didn't receive? Resend OTP
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.centerSection}>
        <View
          style={[
            styles.middleIconBox,
            {
              backgroundColor: COLORS.greenLightBg,
              borderColor: COLORS.greenBorder,
            },
          ]}
        >
          <AppIcon
            name="CheckCircle2"
            size={32}
            color={COLORS.greenActive}
          />
        </View>
        <AppText style={styles.mainActionHeading}>
          Verified successfully
        </AppText>
        <AppText style={styles.mainActionDescription}>
          The delivery PIN has been validated. You are now cleared to mark this
          shipment route as complete.
        </AppText>
      </View>
    );
  }

  return null;
};

export default memo(DeliveryStepContent);
