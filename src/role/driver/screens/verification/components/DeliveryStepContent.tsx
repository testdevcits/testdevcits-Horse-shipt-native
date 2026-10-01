import React, { memo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.deliveryverification';
import imageIndex from '../../../../../assets/images/imageIndex';

interface DeliveryStepContentProps {
  step?: number;
  activeTab: number;
  otpSentSuccess: boolean;
  otp: string;
  setOtp: (otp: string) => void;
  onSendOtp: () => void;
}

const DeliveryStepContent: React.FC<DeliveryStepContentProps> = ({
  step: _step,
  activeTab,
  otpSentSuccess,
  otp,
  setOtp,
  onSendOtp,
}) => {
  if (activeTab === 1) {
    return (
      <View style={styles.centerSection}>
        <View style={styles.actionCard}>
          <View style={styles.middleIconBox}>
            <AppIcon name="Send" size={26} color={COLORS.primary} />
          </View>
          <AppText style={styles.mainActionHeading}>Send Delivery Code</AppText>
          <AppText style={styles.mainActionDescription}>
            Send a 6-digit verification code to the customer to confirm you have
            safely arrived at the delivery location.
          </AppText>

          {otpSentSuccess && (
            <View style={styles.successBanner}>
              <AppIcon name="Check" size={14} color="#065F46" />
              <AppText style={styles.successBannerText}>
                OTP Code already sent to customer
              </AppText>
            </View>
          )}
        </View>
      </View>
    );
  }

  if (activeTab === 2) {
    return (
      <View style={styles.centerSection}>
        <View style={styles.actionCard}>
          <View style={styles.middleIconBox}>
            <AppIcon name="Smartphone" size={26} color={COLORS.primary} />
          </View>
          <AppText style={styles.mainActionHeading}>Enter 6-Digit Code</AppText>
          <AppText style={styles.mainActionDescription}>
            Ask the recipient for the 6-digit verification code sent to their
            phone number.
          </AppText>

          {otpSentSuccess && (
            <View style={styles.successBanner}>
              <AppIcon name="Check" size={14} color="#065F46" />
              <AppText style={styles.successBannerText}>
                OTP dispatched to customer phone
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
            {otp?.length || 0}/6 digits entered
          </AppText>

          <TouchableOpacity activeOpacity={0.7} onPress={onSendOtp}>
            <AppText style={styles.resendTextLink}>
              Didn't receive? Resend OTP
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (activeTab === 3) {
    return (
      <View style={styles.centerSection}>
        <View style={styles.actionCard}>
          <Image
            source={imageIndex?.success}
            style={{ width: 130, height: 130, marginBottom: 12 }}
            resizeMode="contain"
          />
          <AppText style={styles.mainActionHeading}>Delivery Verified!</AppText>
          <AppText style={styles.mainActionDescription}>
            The customer PIN has been verified successfully. Click below to
            complete this shipment manifest.
          </AppText>
        </View>
      </View>
    );
  }

  return null;
};

export default memo(DeliveryStepContent);
