import React from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // CRITICAL for Map & BottomSheet
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

// Your Imports
import AppNavigation from './src/navigations/AppNavigation';
import { store } from './src/app/store';
import { COLORS } from './src/constants';
import { toastConfig } from './src/components/common/ToastConfig';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StripeProvider } from '@stripe/stripe-react-native';
import { REACT_APP_STRIPE_PUBLISHABLE_KEY } from './src/config/constants';

const App = () => {
  return (
    // 1. GestureHandlerRootView must wrap EVERYTHING for Reanimated/Bottom Sheets to work
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          {/* 2. Redux Provider */}
          <Provider store={store}>
            {/* 3. StatusBar Configuration */}
            <StatusBar
              backgroundColor={COLORS.background}
              barStyle={'dark-content'}
              translucent={false}
            />
            <SafeAreaView style={{ flex: 1 }}>
              {/*
              Note: We removed SafeAreaView from here.
              Professional apps usually handle SafeArea inside screens
              to allow Maps/Images to go full-screen under the notch.
          */}
              <StripeProvider publishableKey={REACT_APP_STRIPE_PUBLISHABLE_KEY}>
                <AppNavigation />
              </StripeProvider>
            </SafeAreaView>

            {/* 4. Toast at the absolute top of the visual stack */}
            <Toast
              config={toastConfig}
              topOffset={Platform.OS === 'ios' ? 60 : 40}
              visibilityTime={2500}
            />
          </Provider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

// import React from 'react';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { StyleSheet, View } from 'react-native'; // remove PROVIDER_GOOGLE import if not using Google Maps

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     height: 400,
//     width: 400,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default () => (
//   <View style={styles.container}>
//     <MapView
//       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//       style={styles.map}
//       initialRegion={{
//         latitude: 37.78825,
//         longitude: -122.4324,
//         latitudeDelta: 0.015,
//         longitudeDelta: 0.0121,
//       }}
//     />
//   </View>
// );
