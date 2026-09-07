import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { COLORS, FONTS } from '../constants';

// Screens
import DriverHomeScreen from '../role/driver/screens/home/HomeScreen';
import AllTrips from '../role/driver/screens/trips/AllTrips';
import LocationScreen from '../role/driver/screens/location/LocationScreen';
import ProfileScreen from '../role/driver/screens/profile/Profile';
import AppIcon from '../components/AppIcon';

const Tab = createBottomTabNavigator<{
  Home: undefined;
  Trips: undefined;
  Location: undefined;
  Profile: undefined;
}>();

const DriverTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.grey400,
      tabBarLabelStyle: {
        fontFamily: FONTS.semiBold,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={DriverHomeScreen}
      options={{
        tabBarIcon: ({ color }) => <AppIcon name={'Home'} size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Trips"
      component={AllTrips}
      options={{
        tabBarIcon: ({ color }) => <AppIcon name={'List'} size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Location"
      component={LocationScreen}
      options={{
        tabBarIcon: ({ color }) => <AppIcon name={'MapPin'} size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <AppIcon name={'User'} size={22} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default DriverTabs;
