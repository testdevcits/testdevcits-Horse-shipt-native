import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import {
  Keyboard, // 2. Added Keyboard
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { useAppDispatch } from '../../../hooks/redux';
import { loginUser } from '../../../redux/slices/authSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

const useLogin = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  // State Management
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 3. Keyboard state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('@user_role').then(role => {
        if (role && role !== 'null') {
          setSelectedRole(role);
        } else {
          setSelectedRole('');
        }
      });
    }
  }, [isFocused]);

  // 4. Keyboard Listeners Logic
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardOpen(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardOpen(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let userRole = await AsyncStorage.getItem('@user_role');
      if (!userRole || userRole.trim() === '' || userRole === 'null') {
        userRole = 'customer';
        await AsyncStorage.setItem('@user_role', 'customer');
      }

      await dispatch(
        loginUser({
          credentials: {
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: userRole as any,
          },
          role: userRole as any,
        }),
      ).unwrap();
    } catch (err: any) {
      const errorMsg =
        typeof err === 'string'
          ? err
          : err?.message || err?.errors?.[0] || 'Invalid credentials';
      // Alert.alert('Authentication Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    navigation,
    isKeyboardOpen,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    rememberMe,
    setRememberMe,
    selectedRole,
    isRoleModalVisible,
    setIsRoleModalVisible,
    errors,
    handleSignIn,
    setErrors,
    setSelectedRole,
  };
};

export default useLogin;
