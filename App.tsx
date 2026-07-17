import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AppNavigation from './src/navigations/AppNavigation'

import { store } from './src/app/store'
import { Provider } from 'react-redux';
import { COLORS } from './src/constants'


const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.background}   barStyle={'dark-content'}/>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <AppNavigation />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App