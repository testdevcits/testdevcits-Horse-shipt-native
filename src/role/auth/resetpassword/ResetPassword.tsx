import React, { useState, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Lock, Eye, EyeOff, ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { COLORS, SCREEN_HEIGHT } from '../../../constants';
import { AppText, Button, Input } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';
import authService from '../../../api/services/authService';
import styles from './reset.styles';
import Toast from 'react-native-toast-message';

const ResetPassword = ({ navigation, route }: any) => {
  // Data passed from VerifyResetOtp screen
  const { email, role, otp } = route.params || {};

  // UI & Form State
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });

  // 1. Keyboard Logic for 85% view
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
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
        newPassword: form.newPassword
      });

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Updated',
          text2: 'You can now log in with your new password.'
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Dynamic Background Image (Shrinks to 15% when keyboard open) */}
      <ImageBackground
        source={imageIndex.HorseBg}
        style={[styles.headerImage, { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.45 }]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="white" size={30} />
        </TouchableOpacity>
      </ImageBackground>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentCard}>
          {/* Logo Seal Overlap */}
          <View style={styles.logoOuterRing}>
            <View style={styles.logoInnerRing}>
              <Image source={imageIndex.LogoIcon} style={styles.logoIcon} resizeMode="contain" />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.textHeader}>
              <AppText style={styles.title}>New Password</AppText>
              <AppText style={styles.subtitle}>
                Set a strong password to protect your HorseShipt account and shipment data?.
              </AppText>
            </View>

            <View style={styles.form}>
              <Input
                label="New Password"
                placeholder="••••••••"
                secureTextEntry={!showPass}
                value={form.newPassword}
                onChangeText={(t) => handleInputChange('newPassword', t)}
                leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                  </TouchableOpacity>
                }
                error={errors.newPassword}
              />

              <Input
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry={!showPass}
                value={form.confirmPassword}
                onChangeText={(t) => handleInputChange('confirmPassword', t)}
                leftIcon={<ShieldCheck size={20} color={COLORS.textSecondary} />}
                error={errors.confirmPassword}
              />

              <Button
                title="Reset Password"
                isLoading={isLoading}
                onPress={handleSubmit}
                buttonStyle={styles.submitBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;