import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,

  StatusBar,
  Image,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants';
import { AppText, Button } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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
            Join thousands of customers worldwide and explore top brands, exclusive deals, and everything you need in one trusted marketplace.
          </AppText>
        </View>

        {/* 4. Action Buttons */}
        <View style={styles.buttonContainer}>


          <Button title='Create an account ' onPress={() => navigation.navigate('Register')} buttonStyle={{ marginTop: 10 }} />


          <TouchableOpacity
            style={styles.loginRow}
            onPress={() => navigation.navigate('Login')}
          >
            <AppText style={styles.loginText}>
              Already have an account? <AppText style={styles.loginLink}>Login</AppText>
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
    height: SCREEN_HEIGHT * 0.57, // Takes top 60% of screen
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle darkening for the mist effect
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -RADIUS.xl * 2, // Overlaps the image
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
  },

  logoIcon: {
    width: 100,
    height: 100,
    marginTop: -50,
  },
  textSection: {
    marginTop: SPACING.xl,
    gap: SPACING.md,

  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    textAlign: 'left',
    lineHeight: 24,
    paddingHorizontal: SPACING.sm,


  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto', // Pushes buttons to bottom
    marginBottom: 40,
    gap: SPACING.lg,
  },

  loginRow: {
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
    marginBottom: SPACING.lg,

  },
  loginText: {
    fontSize: 14,
    color: COLORS.grey600,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.medium,
  },
});

export default WelcomeScreen;