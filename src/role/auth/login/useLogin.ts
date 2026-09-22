import { useState, useEffect } from 'react'; // 1. Added useEffect
import {
  Keyboard, // 2. Added Keyboard
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { useAppDispatch } from '../../../hooks/redux';
import { loginUser, googleLoginUser } from '../../../redux/slices/authSlice';
import { signInWithGoogle } from '../../../services/googleAuthService';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
      let userRole = selectedRole || (await AsyncStorage.getItem('@user_role'));
      if (!userRole || userRole.trim() === '' || userRole === 'null') {
        userRole = 'customer';
      }
      await AsyncStorage.setItem('@user_role', userRole);

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
      showErrorToast('Authentication Failed', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      let userRole = selectedRole || (await AsyncStorage.getItem('@user_role'));
      if (!userRole || userRole.trim() === '' || userRole === 'null') {
        userRole = 'customer';
      }
      await AsyncStorage.setItem('@user_role', userRole);

      const googleUser = await signInWithGoogle();

      if (!googleUser.idToken) {
        throw new Error('Could not obtain Google ID Token.');
      }

      await dispatch(
        googleLoginUser({
          idToken: googleUser.idToken,
          role: userRole as any,
          intent: 'login',
          email: googleUser.user.email,
          name: googleUser.user.name,
          photo: googleUser.user.photo,
        }),
      ).unwrap();

      showSuccessToast('Welcome!', `Signed in as ${googleUser.user.name}`);
    } catch (err: any) {
      if (err?.message !== 'Google Sign-In was cancelled.') {
        showErrorToast(
          'Google Sign-In Error',
          err?.message || 'Failed to sign in with Google.',
        );
      }
    } finally {
      setIsGoogleLoading(false);
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
    isGoogleLoading,
    rememberMe,
    setRememberMe,
    selectedRole,
    isRoleModalVisible,
    setIsRoleModalVisible,
    errors,
    handleSignIn,
    handleGoogleSignIn,
    setErrors,
    setSelectedRole,
  };
};

export default useLogin;

