import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, List, MapPin, User } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants';

// Screens
import DriverHomeScreen from '../role/driver/screens/home/HomeScreen';
import AllTrips from '../role/driver/screens/trips/AllTripes';
import LocationScreen from '../role/driver/screens/location/LocationScreen';
import ProfileScreen from '../role/driver/screens/profile/Profile';

const Tab = createBottomTabNavigator();

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
        tabBarIcon: ({ color }) => <Home size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Trips"
      component={AllTrips}
      options={{
        tabBarIcon: ({ color }) => <List size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Location"
      component={LocationScreen}
      options={{
        tabBarIcon: ({ color }) => <MapPin size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <User size={22} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default DriverTabs;
