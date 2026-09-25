import { useState, useEffect } from 'react'; // 1. Added useEffect
import {
  Keyboard, // 2. Added Keyboard
  Platform,
  LayoutAnimation,
  UIManager,
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

  // 4. Keyboard Listeners Logic with Smooth Animation
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsKeyboardOpen(false);
    });

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
    let userRole = selectedRole || (await AsyncStorage.getItem('@user_role'));
    if (!userRole || userRole.trim() === '' || userRole === 'null') {
      showErrorToast(
        'Role Required',
        'Please select your account role (Customer, Shipper, or Driver) to proceed.',
      );
      return;
    }
    if (!validateForm()) return;
    setIsLoading(true);
    try {
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
    let userRole = selectedRole || (await AsyncStorage.getItem('@user_role'));
    if (!userRole || userRole.trim() === '' || userRole === 'null') {
      showErrorToast(
        'Role Required',
        'Please select your account role before signing in with Google.',
      );
      return;
    }

    if (userRole === 'driver') {
      showErrorToast(
        'Not Allowed',
        'Google Sign-In is not available for Driver accounts. Please sign in with Email & Password.',
      );
      return;
    }

    setIsGoogleLoading(true);
    try {
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
      const errorMsg =
        typeof err === 'string'
          ? err
          : err?.message ||
            err?.errors?.[0] ||
            'Failed to sign in with Google.';

      if (errorMsg !== 'Google Sign-In was cancelled.') {
        showErrorToast('Google Sign-In Error', errorMsg);
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
