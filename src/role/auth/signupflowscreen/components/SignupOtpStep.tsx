import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';
import { COLORS, FONTS } from '../../../../constants';
import styles from '../styles.signupflow';

interface SignupOtpStepProps {
  email: string;
  otp: string;
  otpInputRef: React.RefObject<any>;
  resendTimer: number;
  isLoading: boolean;
  errorOtp?: string;
  renderStepper: (step: number) => React.ReactNode;
  onOtpChange: (t: string) => void;
  onOtpVerify: (val?: string) => void;
  onResendOtp: () => void;
}

const SignupOtpStep: React.FC<SignupOtpStepProps> = ({
  email,
  otp,
  otpInputRef,
  resendTimer,
  isLoading,
  errorOtp,
  renderStepper,
  onOtpChange,
  onOtpVerify,
  onResendOtp,
}) => {
  return (
    <View style={styles.formContainer}>
      <AppText style={styles.title}>Verify Email 2/3</AppText>
      {renderStepper(2)}
      <AppText style={[styles.subtitle, { textAlign: 'center' }]}>
        We sent a 6-digit code to{' '}
        <AppText
          style={{
            fontFamily: FONTS.bold,
            color: COLORS.textPrimary,
          }}
        >
          {email}
        </AppText>
      </AppText>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.otpWrapper}
        onPress={() => otpInputRef.current?.focus()}
      >
        <TextInput
          ref={otpInputRef}
          value={otp}
          onChangeText={onOtpChange}
          maxLength={6}
          keyboardType="number-pad"
          style={styles.hiddenOtpInput}
          autoFocus
        />
        <View style={styles.otpBoxContainer}>
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.otpBox,
                  otp.length === idx && styles.otpBoxFocused,
                  otp[idx] ? styles.otpBoxFilled : null,
                ]}
              >
                <AppText style={styles.otpText}>{otp[idx] || ''}</AppText>
              </View>
            ))}
        </View>
      </TouchableOpacity>

      {errorOtp ? (
        <AppText style={styles.errorText}>{errorOtp}</AppText>
      ) : null}

      <View style={styles.resendRow}>
        <AppText style={styles.resendText}>Didn't receive code?</AppText>
        <TouchableOpacity
          onPress={onResendOtp}
          disabled={resendTimer > 0}
        >
          <AppText
            style={[
              styles.resendLink,
              resendTimer > 0 && { color: COLORS.grey400 },
            ]}
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : 'Resend Code'}
          </AppText>
        </TouchableOpacity>
      </View>

      <AppButton
        title="Verify & Create Account"
        onPress={() => onOtpVerify()}
        isLoading={isLoading}
        disabled={otp.length !== 6}
        buttonStyle={styles.actionBtn}
      />
    </View>
  );
};

export default memo(SignupOtpStep);
