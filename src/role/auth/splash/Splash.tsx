// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
// import { useNavigation, CommonActions } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Truck } from 'lucide-react-native'; // Import Lucide Truck Icon
// import { COLORS, FONTS } from '../../../constants';
// import styles from './styles.splash';
// import { useDispatch, useSelector } from 'react-redux';
// import { rehydrateAuth } from '../../../redux/slices/authSlice';

// const Splash = () => {
//   const navigation = useNavigation<any>();
//   const dispatch = useDispatch()

//   // Animation values
//   const truckSlideIn = useRef(new Animated.Value(-150)).current;
//   const engineVibration = useRef(new Animated.Value(0)).current;
//   const speedLines = useRef(new Animated.Value(0)).current;
//   const fadeContent = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // 1. Entrance & Loop Animations
//     Animated.parallel([
//       Animated.timing(truckSlideIn, {
//         toValue: 0,
//         duration: 1000,
//         easing: Easing.out(Easing.back(1)),
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeContent, {
//         toValue: 1,
//         duration: 800,
//         delay: 400,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Loop engine vibration (tiny rapid vertical movement)
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(engineVibration, {
//           toValue: -2.5,
//           duration: 90,
//           useNativeDriver: true,
//         }),
//         Animated.timing(engineVibration, {
//           toValue: 0.5,
//           duration: 90,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     // Loop speed lines
//     Animated.loop(
//       Animated.timing(speedLines, {
//         toValue: -120,
//         duration: 900,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // 2. Token Check & Redirection
//     checkAuthSession();
//   }, []);

//   // const checkAuthSession = async () => {
//   //   try {
//   //     const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
//   //     const [token] = await Promise.all([
//   //       AsyncStorage.getItem('userToken'),
//   //       delay(2500),
//   //     ]);

//   //     if (token) {
//   //       navigation.dispatch(
//   //         CommonActions.reset({
//   //           index: 0,
//   //           routes: [{ name: 'Tabs' }],
//   //         })
//   //       );
//   //     } else {
//   //       navigation.dispatch(
//   //         CommonActions.reset({
//   //           index: 0,
//   //           routes: [{ name: 'Login' }],
//   //         })
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.warn('Error fetching authentication token:', error);
//   //     navigation.dispatch(
//   //       CommonActions.reset({
//   //         index: 0,
//   //         routes: [{ name: 'Login' }],
//   //       })
//   //     );
//   //   }
//   // };


//   // Inside Splash.tsx useEffect
//   useEffect(() => {
//     dispatch(rehydrateAuth());
//   }, []);

//   // Watch the Redux state to navigate
//   const { isLoading, token } = useSelector((state: any) => state.auth);

//   useEffect(() => {
//     if (!isLoading) {
//       // If loading finished and no token, go to Login
//       // If token exists, AppNavigation will automatically switch the Stack!
//       if (!token) navigation.replace('Login');
//     }
//   }, [isLoading, token]);

//   const checkAuthSession = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const role = await AsyncStorage.getItem('userRole');
//       const userData = await AsyncStorage.getItem('userData');

//       if (token && role && userData) {
//         // 1. Fill Redux so AppNavigation can see the role
//         dispatch(hydrateAuth({
//           token,
//           user: JSON.parse(userData)
//         }));
//         // 2. Navigation will automatically switch stacks because of the logic in AppNavigation.tsx
//       } else {
//         navigation.replace('Login');
//       }
//     } catch (error) {
//       navigation.replace('Login');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoWrapper}>

//         {/* Speed Lines */}
//         <View style={styles.linesClipContainer}>
//           <Animated.View
//             style={[
//               styles.speedLinesContainer,
//               {
//                 transform: [{ translateX: speedLines }],
//               },
//             ]}
//           >
//             <View style={[styles.speedLine, { width: 40 }]} />
//             <View style={[styles.speedLine, { width: 25, marginTop: 12, marginLeft: 15 }]} />
//             <View style={[styles.speedLine, { width: 35, marginTop: 12, marginLeft: -5 }]} />
//           </Animated.View>
//         </View>

//         {/* Lucide Truck Icon Container */}
//         <Animated.View
//           style={[
//             styles.truckContainer,
//             {
//               transform: [
//                 { translateX: truckSlideIn },
//                 { translateY: engineVibration },
//               ],
//             },
//           ]}
//         >
//           <Truck
//             size={90}
//             color={COLORS.primary}
//             strokeWidth={1.75}
//           />
//         </Animated.View>
//       </View>

//       {/* Title & Loader Container */}
//       <Animated.View style={[styles.textWrapper, { opacity: fadeContent }]}>
//         <Text style={styles.titleText}>FLEETRUN</Text>
//         <Text style={styles.subtitleText}>DRIVER PORTAL</Text>

//         <ActivityIndicator
//           size="small"
//           color={COLORS.primary}
//           style={styles.loader}
//         />
//       </Animated.View>
//     </View>
//   );
// };

// export default Splash;



import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Truck } from 'lucide-react-native';

import { COLORS } from '../../../constants';
import styles from './styles.splash';
import { rehydrateAuth } from '../../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';

const Splash = ({ navigation }) => {
  // const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isLoading, token } = useAppSelector((state) => state.auth); // 'state' is automatically typed!

  // Animation refs
  const truckSlideIn = useRef(new Animated.Value(-150)).current;
  const engineVibration = useRef(new Animated.Value(0)).current;
  const speedLines = useRef(new Animated.Value(0)).current;
  const fadeContent = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Run Entrance Animations
    startAnimations();

    // 2. Start checking for existing session
    // We wrap this in a small timeout to ensure the user sees our beautiful animation
    const initApp = async () => {
      const startTime = Date.now();

      // Dispatch the Thunk (This handles AsyncStorage -> Redux automatically)
      await dispatch(rehydrateAuth());

      const endTime = Date.now();
      const duration = endTime - startTime;
      const minimumDisplayTime = 2500; // 2.5 seconds minimum

      // If data loaded too fast, wait the remaining time
      if (duration < minimumDisplayTime) {
        setTimeout(() => {
          handleNavigation();
        }, minimumDisplayTime - duration);
      } else {
        handleNavigation();
      }
    };

    initApp();
  }, []);

  const handleNavigation = () => {
    // Note: If 'token' exists, your RootNavigator (AppNavigation) will 
    // automatically swap the screens. If not, we manually move to Login.
    if (!token) {
      navigation?.replace('Welcome');
    }
    // If token exists, do nothing here. AppNavigation.tsx will handle the swap 
    // to DriverRoot/ShipperRoot/CustomerRoot automatically.
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
        Animated.timing(engineVibration, { toValue: -2.5, duration: 90, useNativeDriver: true }),
        Animated.timing(engineVibration, { toValue: 0.5, duration: 90, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(speedLines, { toValue: -120, duration: 900, easing: Easing.linear, useNativeDriver: true })
    ).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.linesClipContainer}>
          <Animated.View style={[styles.speedLinesContainer, { transform: [{ translateX: speedLines }] }]}>
            <View style={[styles.speedLine, { width: 40 }]} />
            <View style={[styles.speedLine, { width: 25, marginTop: 12, marginLeft: 15 }]} />
            <View style={[styles.speedLine, { width: 35, marginTop: 12, marginLeft: -5 }]} />
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.truckContainer,
            { transform: [{ translateX: truckSlideIn }, { translateY: engineVibration }] },
          ]}>
          <Truck size={90} color={COLORS.primary} strokeWidth={1.75} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.textWrapper, { opacity: fadeContent }]}>
        <Text style={styles.titleText}>FLEETRUN</Text>
        <Text style={styles.subtitleText}>LOGISTICS PORTAL</Text>

        <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
      </Animated.View>
    </View>
  );
};

export default Splash;