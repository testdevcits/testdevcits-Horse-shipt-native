import { View, Text, StatusBar, Platform } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigations/AppNavigation'

import { store } from './src/app/store'
import { Provider } from 'react-redux';
import { COLORS } from './src/constants'
import Toast from 'react-native-toast-message'
import { toastConfig } from './src/components/common/ToastConfig'


const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.background} barStyle={'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <AppNavigation />
          {/* <Toast/> */}

          {/* Proper Placement */}
          <Toast
            config={toastConfig}
            topOffset={Platform.OS === 'ios' ? 60 : 40} // Avoids the notch
            visibilityTime={2500}
          />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App