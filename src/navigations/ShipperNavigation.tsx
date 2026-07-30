import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShipperDrawer from './ShipperDrawer';
import ChatDetails from '../role/customer/screens/chatdetails/ChatDetails';
import Notifications from '../role/commonscreens/notifications/Notifications';

const Stack = createNativeStackNavigator();

const ShipperNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShipperDrawer" component={ShipperDrawer} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

export default ShipperNavigation;