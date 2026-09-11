import {  TextInput, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import authService from '../../../api/services/authService';
import Toast from 'react-native-toast-message';

const useVerifyOtp = ({ email, role, navigation }: any) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState('');

  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardOpen(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardOpen(false),
    );

    const interval = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
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

      if (res?.success) {
        Toast.show({ type: 'success', text1: 'OTP Verified' });
        navigation.navigate('ResetPassword', { email, role, otp: finalOtp });
      }
    } catch (err: any) {
      console.log('OTP Verification Error:', err?.response);
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

  return {
    isLoading,
    isKeyboardOpen,
    error,
    otpInputRef,
    handleVerifyOtp,
    handleResend,
    otp,
    setOtp,
    setError,
    resendTimer,
  };
};

export default useVerifyOtp;
