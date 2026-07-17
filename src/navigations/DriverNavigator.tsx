import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverTabs from './DriverTabs';
import DeliveryVerificationScreen from '../role/driver/screens/verification/DeliveryVerificationScreen';


const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The main Tab screen */}
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen
        name="DeliveryVerification"
        component={DeliveryVerificationScreen}
      />

    </Stack.Navigator>
  );
};

export default DriverNavigator;