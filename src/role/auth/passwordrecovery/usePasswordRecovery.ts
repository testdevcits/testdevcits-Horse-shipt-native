import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

import authService from '../../../api/services/authService';
import Toast from 'react-native-toast-message';

const usePasswordRecovery = ({ navigation }: any) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardOpen(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleSendLink = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Assuming role comes from a global constant or prop, e.g., 'customer'
      const res = await authService.forgotPassword(email, 'customer');

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Email Sent',
          text2: 'Please check your inbox for reset instructions.',
        });
        // Navigate to a success screen or back to Login
        navigation.navigate('VerifyOtp');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
      // Toast.show({
      //     type: 'error',
      //     text1: 'Error',
      //     text2: 'Unable to send recovery email.'
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isKeyboardOpen,
    email,
    setEmail,
    error,
    isNotRobot,
    setIsNotRobot,
    isLoading,
    handleSendLink,
    setError
  };
};

export default usePasswordRecovery;
