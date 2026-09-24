import React, { useEffect } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // CRITICAL for Map & BottomSheet
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

// Your Imports
import AppNavigation from './src/navigations/AppNavigation';
import { store, persistor } from './src/redux/store';
import { COLORS } from './src/constants';
import { toastConfig } from './src/components/common/ToastConfig';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StripeProvider } from '@stripe/stripe-react-native';
import { REACT_APP_STRIPE_PUBLISHABLE_KEY } from './src/config/constants';
import OfflineBanner from './src/components/common/OfflineBanner';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { notificationService } from './src/services/notificationService';
import {PersistGate} from 'redux-persist/integration/react';


const App = () => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    notificationService
      .init(data => {
        console.log('App notification clicked with payload:', data);
      })
      .then(unsubscribe => {
        cleanup = unsubscribe;
      });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    // 1. GestureHandlerRootView must wrap EVERYTHING for Reanimated/Bottom Sheets to work
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          {/* 2. Redux Provider */}
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {/* 3. StatusBar Configuration */}
              <StatusBar
                backgroundColor={COLORS.background}
                barStyle={'dark-content'}
                translucent={false}
              />
              <SafeAreaView style={styles.container}>
                <OfflineBanner />
                <ErrorBoundary>
                  <StripeProvider
                    publishableKey={REACT_APP_STRIPE_PUBLISHABLE_KEY}
                  >
                    <AppNavigation />
                  </StripeProvider>
                </ErrorBoundary>
              </SafeAreaView>

              {/* 4. Toast at the absolute top of the visual stack */}

              <Toast
                config={toastConfig}
                position="top"
                bottomOffset={Platform.OS === 'ios' ? 40 : 30}
                visibilityTime={2500}
              />
            </PersistGate>
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
