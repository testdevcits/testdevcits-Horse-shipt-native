import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  FONT_SIZE,
} from '../../../constants';
import { AppText, Button } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Background Image Section */}
      <ImageBackground
        source={imageIndex.HorseBg} // Add your horse image here
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      {/* 2. Bottom Content Card */}
      <View style={styles.contentCard}>
        <Image
          source={imageIndex.Logo} // Stylized horse head icon
          style={styles.logoIcon}
          resizeMode="contain"
        />

        <View style={styles.textSection}>
          <AppText style={styles.title}>Welcome</AppText>
          <AppText style={styles.description}>
            Connecting horse owners with reliable transporters. Post your route,
            compare competitive bids, and book a safe journey for your equine
            companions in just a few taps.
          </AppText>
        </View>

        {/* 4. Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Create an account "
            onPress={() => navigation.navigate('Register')}
            buttonStyle={{ marginTop: 10 }}
          />

          <TouchableOpacity
            style={styles.loginRow}
            onPress={() => navigation.navigate('Login')}
          >
            <AppText style={styles.loginText}>
              Already have an account?{' '}
              <AppText style={styles.loginLink}>Login</AppText>
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.57,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)', // Using a slight tint
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -RADIUS.xl * 2, // Smooth overlap
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    // Optional: Add shadow for depth
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginTop: -50, // Half of height to center on the edge
    borderRadius: RADIUS.md,
  },
  textSection: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZE.heading, // 32
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'left',
  },
  description: {
    fontSize: FONT_SIZE.md, // 16
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: SPACING.xxxl, // Using token (32) instead of 40 for consistency
    gap: SPACING.lg,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  loginText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.grey600,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: FONTS.bold, // Bold makes it look more clickable
  },
});

export default WelcomeScreen;
