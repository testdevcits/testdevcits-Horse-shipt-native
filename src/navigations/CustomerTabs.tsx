import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  Home, 
  Package, 
  PlusSquare, 
  Wind, 
  Settings, 
  ChartBar,
  MessageCircle
} from 'lucide-react-native';

import { COLORS, FONTS } from '../constants';
import MyHorses from '../role/customer/screens/myhorses/MyHorses';
import MyShipments from '../role/customer/screens/myshipments/MyShipments';

// Placeholder Screens (Replace with your actual components)
const HomeScreen = () => <View style={styles.screen} />;
const NewShipmentScreen = () => <View style={styles.screen} />;
 const ChatsScreen = () => <View style={styles.screen} />;
const SettingsScreen = () => <View style={styles.screen} />;

const Tab = createBottomTabNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.goldPrimary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 10,
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: Platform.OS === 'ios' ? 85 : 65,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
      }}
    >
      {/* 1. HOME (Renamed from Dashboard) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* 2. SHIPMENTS */}
      <Tab.Screen
        name="Shipments"
        component={MyShipments}
        options={{
          tabBarLabel: 'Shipments',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />

      {/* 3. CENTER BUTTON (Differnced & Larger) */}
      <Tab.Screen
        name="New"
        component={NewShipmentScreen}
        options={{
          tabBarLabel: 'New',
          tabBarIcon: ({ color }) => (
            <View style={styles.centerIconWrapper}>
               <PlusSquare size={32} color={color} strokeWidth={2.2} />
            </View>
          ),
        }}
      />

      {/* 4. HORSES */}
      <Tab.Screen
        name="Horses"
        component={MyHorses}
        options={{
          tabBarLabel: 'Horses',
          tabBarIcon: ({ color, size }) => <Wind size={size} color={color} />,
        }}
      />

      {/* 4. HORSES */}
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />

      {/* 5. SETTINGS */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerIconWrapper: {
    // This provides the "differnced" look without a heavy box
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4, // Pull it slightly higher for visual balance
  }
});

export default CustomerTabs;