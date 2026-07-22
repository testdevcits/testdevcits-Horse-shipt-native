import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants';
import { AppText, Button } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';
import authService from '../../../api/services/authService';
import Toast from 'react-native-toast-message';
import styles from './styles.verifyotp';

const VerifyResetOtp = ({ navigation, route }: any) => {
  const { email, role = 'customer' } = route.params || {};

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState('');

  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      show.remove();
      hide.remove();
      clearInterval(interval);
    };
  }, []);

  const handleVerifyOtp = async (incomingOtp?: string) => {
    // Use the incoming string directly because state updates are asynchronous
    const finalOtp = incomingOtp || otp;

    if (finalOtp.length !== 6) return;

    try {
      setIsLoading(true);
      setError('');

      const res = await authService.verifyResetOtp({
        email: email.toLowerCase().trim(),
        role: role,
        otp: finalOtp,
      });

      if (res.success) {
        Toast.show({ type: 'success', text1: 'OTP Verified' });
        navigation.navigate('ResetPassword', { email, role, otp: finalOtp });
      }
    } catch (err: any) {
      console.log("OTP Verification Error:", err?.response);
      setError(err?.response?.data?.message || 'Invalid or expired OTP');
      // REMOVED: setOtp(''); <- This was causing your 6th box to disappear
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await authService.forgotPassword(email, role);
      setResendTimer(60);
      setOtp(''); // Clear old OTP on fresh resend
      setError('');
      Toast.show({ type: 'info', text1: 'New OTP Sent' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Resend Failed' });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={imageIndex.HorseBg}
        style={[styles.headerImage, { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.18 : SCREEN_HEIGHT * 0.45 }]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
      </ImageBackground>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.contentCard}>
          <View style={styles.logoOuterRing}>
            <View style={styles.logoInnerRing}>
              <Image source={imageIndex.LogoIcon} style={styles.logoIcon} resizeMode="contain" />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.textHeader}>
              <AppText style={styles.title}>Verification</AppText>
              <AppText style={styles.subtitle}>
                Enter the 6-digit recovery code sent to your email.
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              style={styles.otpWrapper}
              onPress={() => otpInputRef.current?.focus()}
            >
              <TextInput
                ref={otpInputRef}
                value={otp}
                onChangeText={(t) => {
                  setOtp(t);
                  setError(''); // Clear error while user is typing
                  if (t.length === 6) {
                    handleVerifyOtp(t);
                    Keyboard.dismiss(); // Clean UX: hide keyboard on complete
                  }
                }}
                maxLength={6}
                keyboardType="number-pad"
                style={styles.hiddenInput}
                autoFocus={true}
              />
              <View style={styles.boxesRow}>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.otpBox,
                      otp.length === idx && styles.activeBox,
                      otp.length > idx && styles.filledBox,
                      !!error && styles.errorBox
                    ]}
                  >
                    <AppText style={styles.otpText}>{otp[idx] || ''}</AppText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            {!!error && <AppText style={styles.errorText}>{error}</AppText>}

            <View style={styles.resendRow}>
              <AppText style={styles.resendLabel}>Didn't receive code?</AppText>
              <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
                <AppText style={[styles.resendLink, resendTimer > 0 && { color: COLORS.grey400 }]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </AppText>
              </TouchableOpacity>
            </View>

            <Button
              title="Verify Code"
              onPress={() => handleVerifyOtp()}
              isLoading={isLoading}
              disabled={otp.length !== 6}
              buttonStyle={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyResetOtp;