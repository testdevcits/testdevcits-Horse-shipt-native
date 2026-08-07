import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, List, MapPin, User } from 'lucide-react-native'; // Professional line-art icons

// Import local screens

// Import design systems
import { COLORS, FONTS } from '../constants'; // Adjust this path to match your structure

// Import our newly created location tracker hook
import { useActiveLocationTracker } from '../hooks/useActiveLocationTracker';
import HomeScreen from '../role/driver/screens/home/HomeScreen';
import AllTrips from '../role/driver/screens/trips/AllTrips';
import LocationScreen from '../role/driver/screens/location/LocationScreen';
import Profile from '../role/driver/screens/profile/Profile';

export type BottomTabParamList = {
  Home: undefined;
  Trips: undefined;
  Location: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();



const TabsNavigation = () => {
  // Initialize the 3-second active tracker at the tab entry root point [1]
  // useActiveLocationTracker();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Custom rendering for Tab Icons with active indicator dots
        tabBarIcon: ({ color, focused }) => {
          const iconSize = 22;
          let iconComponent;

          switch (route.name) {
            case 'Home':
              iconComponent = <Home size={iconSize} color={color} strokeWidth={2} />;
              break;
            case 'Trips':
              iconComponent = <List size={iconSize} color={color} strokeWidth={2} />;
              break;
            case 'Location':
              iconComponent = <MapPin size={iconSize} color={color} strokeWidth={2} />;
              break;
            case 'Profile':
              iconComponent = <User size={iconSize} color={color} strokeWidth={2} />;
              break;
          }

          return (
            <View style={styles.iconContainer}>
              {iconComponent}
              {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
            </View>
          );
        },

        // Integration of standard design colors
        tabBarActiveTintColor: COLORS.primary, // Sleek primary blue
        tabBarInactiveTintColor: COLORS.textLight, // Grey secondary inactive state

        // Custom layout and border definitions
        tabBarLabelStyle: {
          fontFamily: FONTS.medium, // Applied custom DM Sans typography
          fontSize: 11,
          letterSpacing: 0.2,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 88 : 68, // Account for iOS home indicator
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,

          // Drop shadow effect for floating-dock style
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 10, // Android shadow fallback
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trips" component={AllTrips} />

      <Tab.Screen name="Location" component={LocationScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabsNavigation;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 36,
    width: 36,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -6,
  },
});