

import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import this

import { COLORS } from '../../../constants';
import styles from './styles.splash';
import { rehydrateAuth } from '../../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { AppText } from '../../../components';
import imageIndex from '../../../assets/images/imageIndex';

const Splash = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(state => state.auth);

  // Animation refs
  const truckSlideIn = useRef(new Animated.Value(-150)).current;
  const engineVibration = useRef(new Animated.Value(0)).current;
  const speedLines = useRef(new Animated.Value(0)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();

    const initApp = async () => {
      const startTime = Date.now();

      // 1. Try to restore user session (token/user data)
      await dispatch(rehydrateAuth());

      // 2. Check if a role was ever selected
      const savedRole = await AsyncStorage.getItem('@user_role');

      console.log('===savedRole=', savedRole);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const minimumDisplayTime = 2500;

      const waitTime = Math.max(0, minimumDisplayTime - duration);

      setTimeout(() => {
        handleNavigation(savedRole);
      }, waitTime);
    };

    initApp();
  }, []);

  /**
   * Logic Flow:
   * 1. If Token exists -> Do nothing (AppNavigation will automatically show Home)
   * 2. If Token NOT exists:
   *    a. If Role NOT exists -> Go to RoleSelection (First time user)
   *    b. If Role exists -> Go to Welcome/Login (Returning but not logged in)
   */


  const handleNavigation = (savedRole: string | null) => {
    console.log('Checking Navigation. Token:', token, 'SavedRole:', savedRole);

    if (!token) {
      // Use a falsy check. This covers null, undefined, and empty string ""
      // Also check for the string "null" which sometimes happens with storage
      if (!savedRole || savedRole === 'null') {
        console.log('No role found. Going to RoleSelection');
        navigation?.replace('RoleSelection');
      } else {
        console.log('Role found:', savedRole, '. Going to Welcome');
        navigation?.replace('Welcome');
      }
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(truckSlideIn, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeContent, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(engineVibration, {
          toValue: -2.5,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(engineVibration, {
          toValue: 0.5,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(speedLines, {
        toValue: -120,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.linesClipContainer}>
          <Animated.View
            style={[
              styles.speedLinesContainer,
              { transform: [{ translateX: speedLines }] },
            ]}
          >
            <View style={[styles.speedLine, { width: 40 }]} />
            <View
              style={[
                styles.speedLine,
                { width: 25, marginTop: 12, marginLeft: 15 },
              ]}
            />
            <View
              style={[
                styles.speedLine,
                { width: 35, marginTop: 12, marginLeft: -5 },
              ]}
            />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.truckContainer,
            {
              transform: [
                { translateX: truckSlideIn },
                { translateY: engineVibration },
              ],
            },
          ]}
        >
          <Image
            source={imageIndex.racinghorse}
            style={{ height: 100, width: 100 }}
            resizeMode="center"
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.textWrapper, { opacity: fadeContent }]}>
        <AppText style={styles.titleText}>Horse Shipt</AppText>
        {/* <AppText style={styles.subtitleText}>LOGISTICS PORTAL</AppText> */}
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loader}
        />
      </Animated.View>
    </View>
  );
};

export default Splash;
