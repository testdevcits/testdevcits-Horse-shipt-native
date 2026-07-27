 

import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  StatusBar,
  Keyboard, // 2. Added Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import { COLORS, RADIUS, SCREEN_HEIGHT } from '../../../constants';
import AppText from '../../../components/common/AppText';
import { Input } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import { useAppDispatch } from '../../../hooks/redux';
import { loginUser } from '../../../redux/slices/authSlice';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  // State Management
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 3. Keyboard state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // 4. Keyboard Listeners Logic
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

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
      const userRole = await AsyncStorage.getItem("@user_role")
      await dispatch(loginUser({ credentials: { email: email.trim().toLowerCase(), password, role: userRole }, role: userRole })).unwrap();
    } catch (err: any) {
      Alert.alert('Authentication Error', err || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 5. Dynamic Header Image Height (Calculates 15% when keyboard open) */}
      <ImageBackground
        source={imageIndex.HorseBg}
        style={[
          styles.headerImage,
          { height: isKeyboardOpen ? SCREEN_HEIGHT * 0.20 : SCREEN_HEIGHT * 0.45 }
        ]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* 6. This View will now occupy 80-85% of the screen when keyboard is open */}
        <View style={styles.contentCard}>
          {/*           
          <View style={styles.logoOuterRing}>
            <View style={styles.logoInnerRing}>
              <Image source={imageIndex.LogoIcon} style={styles.logoIcon} resizeMode="contain" />
            </View>
          </View> */}

          <Image source={imageIndex.Logo} style={styles.logoIcon} resizeMode="contain" />


          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <AppText style={styles.welcomeTitle}>Welcome Back</AppText>
              <AppText style={styles.subtitle}>
                Sign in to manage your shipments, track your horses in real time, and access trusted transportation services.
              </AppText>
            </View>

            <Input
              label="Email Address"
              placeholder="antestmail@123.com"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors(p => ({ ...p, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Mail size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors(p => ({ ...p, password: '' })); }}
              isPassword={!isPasswordVisible}
              error={errors.password}
              leftIcon={<Lock size={20} color={COLORS.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                </TouchableOpacity>
              }
            />

            <View style={styles.utilRow}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && (
                      <Check
                        size={14}
                        color={COLORS.white}
                        strokeWidth={3.5} // Thicker stroke for a "premium" bold look
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <AppText style={styles.utilText}>Remember me</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <AppText style={styles.forgotText}>Forgot Password?</AppText>
              </TouchableOpacity>
            </View>

            <AppButton title="Sign In" isLoading={isLoading} onPress={handleSignIn} buttonStyle={styles.signInBtn} />

            <View style={styles.footer}>
              <AppText style={styles.footerText}>Don't have an account? </AppText>
              <TouchableOpacity onPress={() => navigation.navigate('SignupFlowScreen')}>
                <AppText style={styles.footerLink}>Create an account</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;