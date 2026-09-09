import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

import { AppText, Button } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';
import styles from './styles.Welcome';

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

export default WelcomeScreen;
