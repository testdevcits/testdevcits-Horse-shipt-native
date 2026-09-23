import React from 'react'; // 1. Added useEffect
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';

import { COLORS, SCREEN_HEIGHT } from '../../../constants';
import AppText from '../../../components/common/AppText';
import { Input } from '../../../components';
import AppButton from '../../../components/common/Button/AppButton';

import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.login';

import RoleSelectionModal from './components/RoleSelectionModal';
import AppIcon from '../../../components/app_icon/AppIcon';
import useLogin from './useLogin';
import { showInfoToast } from '../../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const {
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
  } = useLogin();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Top Right Change Role Button */}
      <TouchableOpacity
        style={styles.changeRoleBtn}
        onPress={() => setIsRoleModalVisible(true)}
        activeOpacity={0.8}
      >
        <AppIcon name={'UserCog'} size={16} color={COLORS.primary} />
        <AppText style={styles.changeRoleText}>
          {selectedRole ? selectedRole.toUpperCase() : 'ROLE'}
        </AppText>
        <AppIcon name={'RefreshCw'} size={12} color={COLORS.primary} />
      </TouchableOpacity>

      {/* 5. Dynamic Header Image Height (Calculates 15% when keyboard open) */}
      <ImageBackground
        source={imageIndex.HorseBg}
        style={[
          styles.headerImage,
          {
            height: isKeyboardOpen ? SCREEN_HEIGHT * 0.2 : SCREEN_HEIGHT * 0.45,
          },
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
          <Image
            source={imageIndex.Logo}
            style={styles.logoIcon}
            resizeMode="contain"
          />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <AppText style={styles.welcomeTitle}>Welcome Back</AppText>
              <AppText style={styles.subtitle}>
                Sign in to manage your shipments, track your horses in real
                time, and access trusted transportation services.
              </AppText>
            </View>

            {/* Professional Role Selector Buttons */}
            <View style={styles.roleSelectionBlock}>
              <AppText style={styles.roleSelectionLabel}>SELECT ROLE</AppText>
              <View style={styles.roleButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.roleTabBtn,
                    selectedRole === 'customer' && styles.roleTabBtnActive,
                  ]}
                  onPress={async () => {
                    setSelectedRole('customer');
                    await AsyncStorage.setItem('@user_role', 'customer');
                  }}
                  activeOpacity={0.75}
                >
                  <AppIcon
                    name={'User'}
                    size={15}
                    color={
                      selectedRole === 'customer'
                        ? COLORS.white
                        : COLORS.primary
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
                  onPress={async () => {
                    setSelectedRole('shipper');
                    await AsyncStorage.setItem('@user_role', 'shipper');
                  }}
                  activeOpacity={0.75}
                >
                  <AppIcon
                    name={'Building2'}
                    size={15}
                    color={
                      selectedRole === 'shipper'
                        ? COLORS.white
                        : COLORS.primary
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
                  onPress={async () => {
                    setSelectedRole('driver');
                    await AsyncStorage.setItem('@user_role', 'driver');
                  }}
                  activeOpacity={0.75}
                >
                  <AppIcon
                    name={'Truck'}
                    size={15}
                    color={
                      selectedRole === 'driver'
                        ? COLORS.white
                        : COLORS.primary
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

            <Input
              label="Email Address"
              placeholder="antestmail@123.com"
              value={email}
              onChangeText={t => {
                setEmail(t);
                setErrors(p => ({ ...p, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={
                <AppIcon name={'Mail'} size={20} color={COLORS.textSecondary} />
              }
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={t => {
                setPassword(t);
                setErrors(p => ({ ...p, password: '' }));
              }}
              isPassword={true}
              error={errors.password}
              leftIcon={
                <AppIcon name={'Lock'} size={20} color={COLORS.textSecondary} />
              }
            />

            <View style={styles.utilRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && (
                    <AppIcon name={'Check'} size={14} color={COLORS.white} />
                  )}
                </View>
                <AppText style={styles.utilText}>Remember me</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <AppText style={styles.forgotText}>Forgot Password?</AppText>
              </TouchableOpacity>
            </View>

            <AppButton
              title="Sign In"
              isLoading={isLoading}
              onPress={handleSignIn}
              buttonStyle={styles.signInBtn}
            />

            {/* Google Sign In - HIDDEN for Driver Role */}
            {selectedRole !== 'driver' && (
              <>
                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <AppText style={styles.dividerText}>or continue with</AppText>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In Button */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  activeOpacity={0.8}
                >
                  <Image
                    source={imageIndex.Google}
                    style={styles.googleIcon}
                    resizeMode="contain"
                  />
                  <AppText style={styles.googleBtnText}>
                    {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                  </AppText>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.footer}>
              <AppText style={styles.footerText}>
                Don't have an account?{' '}
              </AppText>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignupFlowScreen')}
              >
                <AppText style={styles.footerLink}>Create an account</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        visible={isRoleModalVisible}
        currentRole={selectedRole || ''}
        onClose={() => setIsRoleModalVisible(false)}
        onSelectRole={async newRole => {
          setSelectedRole(newRole);
          await AsyncStorage.setItem('@user_role', newRole);

          showInfoToast(
            'Role Selected',
            `Switched signing in mode to ${newRole.toUpperCase()}`,
          );
        }}
      />
    </View>
  );
};

export default Login;
