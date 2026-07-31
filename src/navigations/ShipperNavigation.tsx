import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShipperDrawer from './ShipperDrawer';
import ChatDetails from '../role/customer/screens/chatdetails/ChatDetails';
import Notifications from '../role/commonscreens/notifications/Notifications';

import ShipperShipmentDetailsScreen from '../role/shipper/screens/home/ShipperShipmentDetailsScreen';
import LiveTrackingScreen from '../role/customer/screens/tracking/LiveTrackingScreen';
import PreferredAreasScreen from '../role/shipper/screens/preferredareas/PreferredAreasScreen';
import ShipperReviewsScreen from '../role/shipper/screens/reviews/ShipperReviewsScreen';
import AddVehicleScreen from '../role/shipper/screens/vehicles/AddVehicleModal';

const Stack = createNativeStackNavigator();

const ShipperNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShipperDrawer" component={ShipperDrawer} />
      <Stack.Screen name="ShipperShipmentDetails" component={ShipperShipmentDetailsScreen} />
      <Stack.Screen name="ShipmentDetails" component={ShipperShipmentDetailsScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
      <Stack.Screen name="PreferredAreas" component={PreferredAreasScreen} />
      <Stack.Screen name="ShipperReviews" component={ShipperReviewsScreen} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
    </Stack.Navigator>
  );
};


export default ShipperNavigation;