import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';

import { AppText } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.Register';
import { useAppDispatch } from '../../../hooks/redux';
import { googleLoginUser } from '../../../redux/slices/authSlice';
import { signInWithGoogle } from '../../../services/googleAuthService';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      let userRole = await AsyncStorage.getItem('@user_role');
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
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Top Image Section */}
      <ImageBackground
        source={imageIndex.HorseBg}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      {/* 2. Content Card (Overlapping) */}
      <View style={styles.contentCard}>
        <Image
          source={imageIndex.Logo}
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

          {/* 4. Action Buttons */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Create an account"
              buttonStyle={styles.primaryBtn}
              onPress={() => navigation.navigate('SignupFlowScreen')}
            />

            <View style={styles.dividerRow}>
              <AppText style={styles.dividerText}>Or</AppText>
            </View>

            {/* Social Logins */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              activeOpacity={0.8}
            >
              <Image
                source={imageIndex.Google}
                style={{ width: 20, height: 20, marginRight: 10 }}
                resizeMode="contain"
              />
              <AppText style={styles.darkBtnText}>
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </AppText>
            </TouchableOpacity>
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
