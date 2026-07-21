

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import AddEditHorse from '../role/customer/screens/addedithorse/AddEditHorse';
import MyShipmentDetails from '../role/customer/screens/myshipmentdetails/MyShipmentdetails';
import ChatDetails from '../role/customer/screens/chatdetails/ChatDetails';
import Notifications from '../role/commonscreens/notifications/Notifications';
import Payments from '../role/customer/screens/payments/Payments';
import PaymentDetails from '../role/customer/screens/paymentdetails/PaymentDetails';
import ReviewsScreen from '../role/customer/screens/reviews/ReviewsScreen';
import NotificationSettings from '../role/customer/screens/notificationsettings/NotificationSettings';
import TopShippersScreen from '../role/customer/screens/topratedshippers/TopShippersScreen';
import ShipperDetail from '../role/customer/screens/topratedshippers/ShipperDetail';

const Stack = createNativeStackNavigator();

const CustomerNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The main Tab screen */}
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="AddEditHorse" component={AddEditHorse} />
      <Stack.Screen name="MyShipmentDetails" component={MyShipmentDetails} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />

      <Stack.Screen name="Payments" component={Payments} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
      <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />

      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="TopShippersScreen" component={TopShippersScreen} />
      <Stack.Screen name="ShipperDetail" component={ShipperDetail} />




    </Stack.Navigator>

  );
};

export default CustomerNavigation;