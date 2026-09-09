import React from 'react';
import {
  StyleSheet,
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

// Local component for the Google Icon (since it's multi-colored)
const GoogleIcon = () => (
  <Image
    source={imageIndex.Google}
    style={{ width: 18, height: 18, marginRight: 10 }}
  />
);

const RegisterScreen = ({ navigation }: any) => {
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
        {/* 3. Circular Logo Seal */}
        {/* <View style={styles.logoOuterRing}>
                    <View style={styles.logoInnerRing}>
                        <Image
                            source={imageIndex.LogoIcon}
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                    </View>
                </View> */}

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
              Create your free SAM Global account to shop smarter, track orders,
              and enjoy a seamless buying experience.
            </AppText>
          </View>

          {/* 4. Action Buttons */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Create an account"
              buttonStyle={styles.primaryBtn}
              onPress={() => navigation.navigate('SignupFlowScreen')}
            />

            {/* <View style={styles.dividerRow}>
                            <AppText style={styles.dividerText}>Or</AppText>
                        </View> */}

            {/* Social Logins */}

            {/* <AppButton
                            title="Continue with Google"
                            leftIcon={<GoogleIcon />}
                            buttonStyle={styles.googleBtn}
                            textStyle={styles.darkBtnText}
                        /> */}
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
