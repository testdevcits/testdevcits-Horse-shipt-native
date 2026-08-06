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
import PdfViewerScreen from '../role/commonscreens/pdfviews/PdfViewerScreen';
import AccountSetupScreen from '../role/shipper/screens/payments/AccountSetupScreen';
import EditProfileScreen from '../role/shipper/screens/profile/EditProfileScreen';

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
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};


export default ShipperNavigation;