import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerTabs from './CustomerTabs';

// Additional Drawer Screens
import NotificationSettings from '../role/customer/screens/notificationsettings/NotificationSettings';
import CustomDrawerContent from './CustomDrawerContent';
import Profile from '../role/customer/screens/profile/Profile';
import HelpCenter from '../role/customer/screens/help_center/HelpCenter';
import PrivacyPolicyScreen from '../role/shipper/screens/privacy/PrivacyPolicyScreen';

const Drawer = createDrawerNavigator();

const CustomerDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* The Tab Navigator is the "MainTabs" root of the Drawer */}
      <Drawer.Screen
        name="MainTabs"
        component={CustomerTabs}
        options={{ drawerLabel: 'Home' }}
      />

      {/* Additional Drawer Screens */}
      <Drawer.Screen name="Settings" component={NotificationSettings} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="HelpCenter" component={HelpCenter} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Drawer.Navigator>
  );
};

export default CustomerDrawer;
