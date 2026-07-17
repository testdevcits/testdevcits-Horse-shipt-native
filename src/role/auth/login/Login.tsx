import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { COLORS, FONTS } from '../../../constants';
import AppText from '../../../components/common/AppText';
import { Input } from '../../../components';
import styles from './styles.login';
import authService from '../../../api/services/authService';
import AppButton from '../../../components/common/Button/AppButton';
import { useAppDispatch } from '../../../hooks/redux';
import { UserRole } from '../../../types/auth';
import { loginUser } from '../../../redux/slices/authSlice';

// Import the auth service

const Login = () => {
  const navigation = useNavigation<any>();

  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 2. Inside your Login Component
  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer'); // Get this from your UI toggle

  // Validation Errors
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Input Field handlers to clear errors on change
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  // Basic Validation Logic
  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: '', password: '' };

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Sign In submit action using real integrated authService
  // const handleSignIn = async () => {
  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   try {
  //     // Execute network call to Vericell backend
  //     const response = await authService.login({
  //       email: email.trim().toLowerCase(),
  //       password: password,
  //     });

  //     // Extract credentials from top-level or nested structures returned by your backend
  //     const authToken = response.token || response.data?.token;
  //     const driverData = response.driver || response.data?.driver;

  //     if (authToken) {
  //       // Save token & profile in local storage
  //       await AsyncStorage.setItem('userToken', authToken);
  //       if (driverData) {
  //         await AsyncStorage.setItem('driverProfile', JSON.stringify(driverData));
  //       }

  //       // Navigate to main application stack (Tabs) and clear authorization history
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: 'Tabs' }],
  //         })
  //       );
  //     } else {
  //       throw new Error('No authentication token returned by the server.');
  //     }
  //   } catch (error: any) {
  //     // Catch blocks will automatically read parsed messages from your axiosClient interceptors
  //     const errorMessage = error?.message || 'Invalid credentials or connection error.';
  //     Alert.alert('Authentication Error', errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSignIn = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  // We wrap the dispatch in a 'unwrap' to catch errors in the local catch block
  try {
    const resultAction = await dispatch(
      loginUser({
        credentials: {
          email: email.trim().toLowerCase(),
          password: password,
          role:selectedRole
        },
        role: selectedRole, // Important: Tell the thunk which role to log in as
      })
    ).unwrap();

    // SUCCESS: 
    // You don't need navigation.reset() here! 
    // AppNavigation.tsx will see the token in Redux and show the correct Home screen.
    console.log('Login successful:', resultAction.user.name);

  } catch (err: any) {
    // ERROR:
    // The 'unwrap' sends the error message here automatically
    Alert.alert('Authentication Error', err || 'Invalid credentials');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Block */}
          <View style={styles.headerContainer}>
            <View style={styles.badge}>
              <ShieldCheck size={16} color={COLORS.secondary} />
              <AppText style={styles.badgeText}>SECURE GATEWAY</AppText>
            </View>
            <AppText style={styles.welcomeText}>Welcome back</AppText>
            <AppText style={styles.descriptionText}>
              Sign in to manage routes, track deliveries, and update dispatch.
            </AppText>
          </View>

          {/* Form Block */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <Input
              label="Email Address"
              placeholder="driver@fleetrun.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              disabled={isLoading}
              leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
            />

            {/* Password Input */}
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={handlePasswordChange}
              isPassword={true}
              error={errors.password}
              disabled={isLoading}
              leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
              rightIcon={
                isPasswordVisible ? (
                  <EyeOff size={20} color={COLORS.textSecondary} />
                ) : (
                  <Eye size={20} color={COLORS.textSecondary} />
                )
              }
              onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            {/* Forgot Password Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.forgotPasswordContainer}
              onPress={() => Alert.alert('Reset Password', 'Contact dispatch or your fleet administrator to reset security credentials.')}
            >
              <AppText style={styles.forgotPasswordText}>Forgot Password?</AppText>
            </TouchableOpacity>

            {/* Submit Action Button */}
            <AppButton
              title="Sign In to Portal"
              isLoading={isLoading}
              onPress={handleSignIn}
              buttonStyle={styles.signInButton}
            />
          </View>

          {/* Dispatch Notice / Support Footer */}
          <View style={styles.footerContainer}>
            <AppText style={styles.footerTitle}>New to Horse Shipt?</AppText>
            <AppText style={styles.footerSubtitle}>
              Driver profiles are created by dispatch. Contact your operations office to activate your login.
            </AppText>
          </View>

          <View style={styles.signupfooterContainer}>
            <AppText style={styles.footerText}>Don't have an account? </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <AppText style={styles.footerLink}>Create an account</AppText>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;