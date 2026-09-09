import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SCREEN_HEIGHT } from '../../../constants';
import { AppText, Button, Input } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './recovery.styles';

import AppIcon from '../../../components/AppIcon';
import usePasswordRecovery from './usePasswordRecovery';

const PasswordRecovery = ({ navigation }: any) => {
  const {
    isKeyboardOpen,
    email,
    setEmail,
    error,
    isNotRobot,
    setIsNotRobot,
    isLoading,
    handleSendLink,
    setError,
  } = usePasswordRecovery({ navigation });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={imageIndex.HorseBg}
        style={[
          styles.headerImage,
          {
            height: isKeyboardOpen
              ? SCREEN_HEIGHT * 0.15
              : SCREEN_HEIGHT * 0.45,
          },
        ]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity
          style={{ padding: 20, marginTop: 40 }}
          onPress={() => navigation.goBack()}
        >
          <AppIcon name={'ChevronLeft'} color="white" size={30} />
        </TouchableOpacity>
      </ImageBackground>

      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <View style={styles.contentCard}>
          <Image source={imageIndex.Logo} style={styles.logoIcon} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <AppText style={styles.title}>Password Recovery</AppText>
              <AppText style={styles.subtitle}>
                Forgot your password? Enter your email and we'll send you a
                secure reset link.
              </AppText>
            </View>

            <Input
              label="Email Address"
              placeholder="antestmail@123.com"
              value={email}
              onChangeText={t => {
                setEmail(t);
                setError('');
              }}
              error={error}
              leftIcon={
                <AppIcon name={'Mail'} size={20} color={COLORS.textSecondary} />
              }
            />

            <TouchableOpacity
              style={styles.captchaContainer}
              onPress={() => setIsNotRobot(!isNotRobot)}
              activeOpacity={0.7}
            >
              <View style={styles.captchaLeft}>
                <View
                  style={[styles.checkbox, isNotRobot && styles.checkboxActive]}
                >
                  {isNotRobot && <View style={styles.checkInner} />}
                </View>
                <AppText style={styles.captchaText}>I'm not a robot</AppText>
              </View>
              <Image
                source={{
                  uri: 'https://www.gstatic.com/recaptcha/api2/logo_48.png',
                }}
                style={styles.recaptchaLogo}
              />
            </TouchableOpacity>

            <Button
              title="Send Reset Link"
              isLoading={isLoading}
              onPress={handleSendLink}
              buttonStyle={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PasswordRecovery;
