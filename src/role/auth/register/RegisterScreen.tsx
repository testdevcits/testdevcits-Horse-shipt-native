import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { COLORS } from '../../../constants';
import { AppText } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import AppIcon from '../../../components/app_icon/AppIcon';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.Register';
import { useAppDispatch } from '../../../hooks/redux';
import { googleLoginUser } from '../../../redux/slices/authSlice';
import { signInWithGoogle } from '../../../services/googleAuthService';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('@user_role').then(role => {
        if (role && ['customer', 'shipper', 'driver'].includes(role)) {
          setSelectedRole(role);
        } else {
          setSelectedRole('');
        }
      });
    }
  }, [isFocused]);

  const handleSelectRole = async (role: string) => {
    setSelectedRole(role);
    await AsyncStorage.setItem('@user_role', role);
  };

  const handleCreateAccount = async () => {
    if (!selectedRole) {
      showErrorToast(
        'Role Required',
        'Please select your account role (Customer, Shipper, or Driver) to proceed.',
      );
      return;
    }
    await AsyncStorage.setItem('@user_role', selectedRole);
    navigation.navigate('SignupFlowScreen');
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRole) {
      showErrorToast(
        'Role Required',
        'Please select your account role before continuing with Google.',
      );
      return;
    }

    if (selectedRole === 'driver') {
      showErrorToast(
        'Not Allowed',
        'Google Sign-In is not available for Driver accounts. Please register with Email & Password.',
      );
      return;
    }

    setIsGoogleLoading(true);
    try {
      await AsyncStorage.setItem('@user_role', selectedRole);

      const googleUser = await signInWithGoogle();

      if (!googleUser.idToken) {
        throw new Error('Could not obtain Google ID Token.');
      }

      await dispatch(
        googleLoginUser({
          idToken: googleUser.idToken,
          role: selectedRole as any,
          intent: 'signup',
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

  return (
    <View style={styles.container}>
      {/* 1. Top Image Section */}
      <ImageBackground
        source={imageIndex?.HorseBg}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      {/* 2. Content Card (Overlapping) */}
      <View style={styles.contentCard}>
        <Image
          source={imageIndex?.Logo}
          style={styles.logoIcon}
          resizeMode="contain"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.textSection}>
            <AppText style={styles.title}>Create new account</AppText>
            <AppText style={styles.description}>
              Create your free HorseShipt account to shop smarter, track orders,
              and enjoy a seamless transportation experience.
            </AppText>
          </View>

          {/* Role Selection Buttons */}
          <View style={styles.roleSelectionBlock}>
            <AppText style={styles.roleSelectionLabel}>SELECT ROLE</AppText>
            <View style={styles.roleButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.roleTabBtn,
                  selectedRole === 'customer' && styles.roleTabBtnActive,
                ]}
                onPress={() => handleSelectRole('customer')}
                activeOpacity={0.75}
              >
                <AppIcon
                  name={'User'}
                  size={15}
                  color={
                    selectedRole === 'customer' ? COLORS.white : COLORS.primary
                  }
                />
                <AppText
                  style={[
                    styles.roleTabBtnText,
                    selectedRole === 'customer' && styles.roleTabBtnTextActive,
                  ]}
                >
                  Customer
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleTabBtn,
                  selectedRole === 'shipper' && styles.roleTabBtnActive,
                ]}
                onPress={() => handleSelectRole('shipper')}
                activeOpacity={0.75}
              >
                <AppIcon
                  name={'Building2'}
                  size={15}
                  color={
                    selectedRole === 'shipper' ? COLORS.white : COLORS.primary
                  }
                />
                <AppText
                  style={[
                    styles.roleTabBtnText,
                    selectedRole === 'shipper' && styles.roleTabBtnTextActive,
                  ]}
                >
                  Shipper
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleTabBtn,
                  selectedRole === 'driver' && styles.roleTabBtnActive,
                ]}
                onPress={() => handleSelectRole('driver')}
                activeOpacity={0.75}
              >
                <AppIcon
                  name={'Truck'}
                  size={15}
                  color={
                    selectedRole === 'driver' ? COLORS.white : COLORS.primary
                  }
                />
                <AppText
                  style={[
                    styles.roleTabBtnText,
                    selectedRole === 'driver' && styles.roleTabBtnTextActive,
                  ]}
                >
                  Driver
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Action Buttons */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Create an account"
              buttonStyle={styles.primaryBtn}
              onPress={handleCreateAccount}
            />

            {/* Google Signup - HIDDEN for Driver Role */}
            {selectedRole !== 'driver' && (
              <>
                <View style={styles.dividerRow}>
                  <AppText style={styles.dividerText}>Or</AppText>
                </View>

                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  activeOpacity={0.8}
                >
                  <Image
                    source={imageIndex?.Google}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    resizeMode="contain"
                  />
                  <AppText style={styles.darkBtnText}>
                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                  </AppText>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* 5. Footer Link */}
          <TouchableOpacity
            style={styles.loginRow}
            onPress={() => navigation.navigate('Login')}
          >
            <AppText style={styles.loginText}>
              Already have an account?{' '}
              <AppText style={styles.loginLink}>Login</AppText>
            </AppText>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

export default RegisterScreen;
