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

import Toast from 'react-native-toast-message';
import RoleSelectionModal from './components/RoleSelectionModal';
import AppIcon from '../../../components/AppIcon';
import useLogin from './useLogin';

const Login = () => {
  const {
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

              {/* Selected Role Badge Label (Tap to open modal) */}
              <TouchableOpacity
                style={styles.roleBadgeContainer}
                onPress={() => setIsRoleModalVisible(true)}
                activeOpacity={0.7}
              >
                <AppText style={styles.roleBadgeLabel}>Signing in as: </AppText>
                <AppText style={styles.roleBadgeValue}>
                  {selectedRole ? selectedRole.toUpperCase() : 'CUSTOMER'}
                </AppText>
                <AppText style={styles.changeTextLink}> (Change)</AppText>
              </TouchableOpacity>

              <AppText style={styles.subtitle}>
                Sign in to manage your shipments, track your horses in real
                time, and access trusted transportation services.
              </AppText>
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
              >
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
                </TouchableOpacity>
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
        currentRole={selectedRole || 'customer'}
        onClose={() => setIsRoleModalVisible(false)}
        onSelectRole={newRole => {
          setSelectedRole(newRole);
          Toast.show({
            type: 'info',
            text1: 'Role Selected',
            text2: `Switched signing in mode to ${newRole.toUpperCase()}`,
          });
        }}
      />
    </View>
  );
};

export default Login;
