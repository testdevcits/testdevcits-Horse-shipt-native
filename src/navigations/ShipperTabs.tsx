import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, PlusCircle, Package, User } from 'lucide-react-native';
import { COLORS } from '../constants';
import { View } from 'react-native';

// Placeholder Screens (You will create these)
const ShipperDashboard = () => <View />; 
const PostShipment = () => <View />;
const MyLoads = () => <View />;
const Profile = () => <View />;

const Tab = createBottomTabNavigator();

const ShipperTabs = () => (
  <Tab.Navigator  >
    <Tab.Screen 
      name="Dashboard" 
      component={ShipperDashboard} 
      options={{ tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} /> }} 
    />
    <Tab.Screen 
      name="Post" 
      component={PostShipment} 
      options={{ tabBarIcon: ({ color }) => <PlusCircle size={22} color={color} /> }} 
    />
    <Tab.Screen 
      name="Loads" 
      component={MyLoads} 
      options={{ tabBarIcon: ({ color }) => <Package size={22} color={color} /> }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={Profile} 
      options={{ tabBarIcon: ({ color }) => <User size={22} color={color} /> }} 
    />
  </Tab.Navigator>
);

export default ShipperTabs;