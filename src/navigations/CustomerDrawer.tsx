import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerTabs from './CustomerTabs';

// Import screens you want in the drawer menu
import NotificationSettings from '../role/customer/screens/notificationsettings/NotificationSettings';
import CustomDrawerContent from './CustomDrawerContent';
import Profile from '../role/customer/screens/profile/Profile';
import HomeScreen from '../role/customer/screens/home/HomeScreen';
import MyShipments from '../role/customer/screens/myshipments/MyShipments';
import ShipperList from '../role/customer/screens/chats/Shipperlist';

const Drawer = createDrawerNavigator();

const CustomerDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Keep false if you want to use your custom headers
      }}
    >
      {/* The Tab Navigator is the "Home" of the Drawer */}
      <Drawer.Screen
        name="MainTabs"
        component={CustomerTabs}
        options={{ drawerLabel: 'Home' }}
      />

      {/* Additional Drawer Screens */}

      <Drawer.Screen name="Settings" component={NotificationSettings} />
      <Drawer.Screen name="Profile" component={Profile} />


    </Drawer.Navigator>
  );
};

export default CustomerDrawer;
