import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

import authService from '../../../api/services/authService';

import Toast from 'react-native-toast-message';

const useResetPassword = ({ email, role, otp, navigation }: any) => {
  // UI & Form State
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // 1. Keyboard Logic for 85% view
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

  const validate = () => {
    let isValid = true;
    let newErrors = { newPassword: '', confirmPassword: '' };

    if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // 2. API Handler
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const res = await authService.resetPassword({
        email,
        role,
        otp,
        newPassword: form.newPassword,
      });

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Updated',
          text2: 'You can now log in with your new password.',
        });
        // Success: Redirect to Login
        navigation.navigate('Login');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to reset password';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isKeyboardOpen,
    showPass,
    setShowPass,
    isLoading,
    form,
    setForm,
    setErrors,
    handleInputChange,
    handleSubmit,
    errors,
  };
};

export default useResetPassword;
