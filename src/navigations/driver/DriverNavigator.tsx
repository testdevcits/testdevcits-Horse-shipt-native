import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverTabs from './DriverTabs';
import DeliveryVerificationScreen from '../../role/driver/screens/verification/DeliveryVerificationScreen';
import ShipmentDetailsScreen from '../../role/driver/screens/trips/ShipmentDetailsScreen';
import { DriverShipmentItem } from '../../types/driver';

export type DriverStackParamList = {
  DriverTabs: undefined;
  DeliveryVerification: { shipment?: any };
  ShipmentDetails: { shipment: DriverShipmentItem };
};

const Stack = createNativeStackNavigator<DriverStackParamList>();

const DriverNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The main Tab screen */}
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen
        name="DeliveryVerification"
        component={DeliveryVerificationScreen}
      />
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
    </Stack.Navigator>
  );
};

export default DriverNavigator;
