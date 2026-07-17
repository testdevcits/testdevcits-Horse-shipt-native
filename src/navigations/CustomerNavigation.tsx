

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import AddEditHorse from '../role/customer/screens/addedithorse/AddEditHorse';
import MyShipmentDetails from '../role/customer/screens/myshipmentdetails/MyShipmentdetails';

const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The main Tab screen */}
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="AddEditHorse" component={AddEditHorse} />
      <Stack.Screen name="MyShipmentDetails" component={MyShipmentDetails} />

    </Stack.Navigator>
  );
};

export default DriverNavigator;