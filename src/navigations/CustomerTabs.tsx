// import React from 'react';
// import { StyleSheet, View, Platform } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { 
//   Home, 
//   Package, 
//   PlusSquare, 
//   Wind, 
//   Settings, 
//   ChartBar,
//   MessageCircle
// } from 'lucide-react-native';

// import { COLORS, FONTS } from '../constants';
// import MyHorses from '../role/customer/screens/myhorses/MyHorses';
// import MyShipments from '../role/customer/screens/myshipments/MyShipments';
// import HomeScreen from '../role/customer/screens/home/HomeScreen';
// import ShipperList from '../role/customer/screens/chats/Shipperlist';
// import NewShipment from '../role/customer/screens/newshipment/NewShipment';

// // Placeholder Screens (Replace with your actual components)
//   const SettingsScreen = () => <View style={styles.screen} />;

// const Tab = createBottomTabNavigator();

// const CustomerTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: COLORS.goldPrimary,
//         tabBarInactiveTintColor: COLORS.textLight,
//         tabBarLabelStyle: {
//           fontFamily: FONTS.medium,
//           fontSize: 10,
//           paddingBottom: Platform.OS === 'ios' ? 0 : 8,
//         },
//         tabBarStyle: {
//           backgroundColor: COLORS.surface,
//           height: Platform.OS === 'ios' ? 85 : 65,
//           borderTopColor: COLORS.border,
//           borderTopWidth: 1,
//         },
//       }}
//     >
//       {/* 1. HOME (Renamed from Dashboard) */}
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
//         }}
//       />

//       {/* 2. SHIPMENTS */}
//       <Tab.Screen
//         name="Shipments"
//         component={MyShipments}
//         options={{
//           tabBarLabel: 'Shipments',
//           tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
//         }}
//       />

//       {/* 3. CENTER BUTTON (Differnced & Larger) */}
//       <Tab.Screen
//         name="New"
//         component={NewShipment}
//         options={{
//           tabBarLabel: 'New',
//           tabBarIcon: ({ color }) => (
//             <View style={styles.centerIconWrapper}>
//                <PlusSquare size={32} color={color} strokeWidth={2.2} />
//             </View>
//           ),
//         }}
//       />

//       {/* 4. HORSES */}
//       <Tab.Screen
//         name="Horses"
//         component={MyHorses}
//         options={{
//           tabBarLabel: 'Horses',
//           tabBarIcon: ({ color, size }) => <Wind size={size} color={color} />,
//         }}
//       />

//       {/* 4. HORSES */}
//       <Tab.Screen
//         name="Chats"
//         component={ShipperList}
//         options={{
//           tabBarLabel: 'Chats',
//           tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
//         }}
//       />

//       {/* 5. SETTINGS */}
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   centerIconWrapper: {
//     // This provides the "differnced" look without a heavy box
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: -4, // Pull it slightly higher for visual balance
//   }
// });

// export default CustomerTabs;

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Package, MessageCircle, Plus, Smartphone } from 'lucide-react-native';

// Import your actual screens
import HomeScreen from '../role/customer/screens/home/HomeScreen';
import MyShipments from '../role/customer/screens/myshipments/MyShipments';
import NewShipment from '../role/customer/screens/newshipment/NewShipment';
import MyHorses from '../role/customer/screens/myhorses/MyHorses';
import ShipperList from '../role/customer/screens/chats/Shipperlist';
import { COLORS } from '../constants';
import imageIndex from '../assets/images/imageIndex';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.mainContainer}>
      {/* This View creates the white background with the "Hump" shadow */}
      <View style={styles.tabBarBackground}>
        {/* The Hump behind the center button */}
        <View style={styles.hump} />

        <View style={styles.tabBarButtonsContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Custom Icons Logic
            const renderIcon = (color: string) => {
              const size = 26;
              switch (route.name) {
                case 'Home': return <Image source={imageIndex.Home} style={{ width: 26, height: 26, tintColor: color }} />;
                case 'Shipments': return <Image source={imageIndex.Shipments} style={{ width: 26, height: 26, tintColor: color }} />;
                case 'New': return null; // We handle center button separately
                case 'Horses':
                  // To match your image exactly, use a Horse Icon/Image 
                  // If Lucide doesn't have it, we use a placeholder icon
                  return <Image source={imageIndex.Horse} style={{ width: 26, height: 26, tintColor: color }} />;;
                case 'Chats': return <Image source={imageIndex.Chat} style={{ width: 26, height: 26, tintColor: color }} />;;
                default: return null;
              }
            };

            // If it's the center 'New' button, we render the Brown Floating Action Button
            if (route.name === 'New') {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  activeOpacity={0.8}
                  style={styles.centerButton}
                >
                  <Plus size={32} color="#FFF" strokeWidth={3} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.tabItem}
              >
                {renderIcon(isFocused ? '#A06333' : '#666')}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shipments" component={MyShipments} />
      <Tab.Screen name="New" component={NewShipment} />
      <Tab.Screen name="Horses" component={MyHorses} />
      <Tab.Screen name="Chats" component={ShipperList} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabBarBackground: {
    backgroundColor: '#FFF',
    height: Platform.OS === 'ios' ? 88 : 70,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // Shadow for the whole bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 20,
  },
  hump: {
    position: 'absolute',
    top: -30, // Pushes the hump up
    left: width / 2 - 45,
    width: 90,
    height: 60,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    // Matches the bar shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabBarButtonsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A06333', // Brown color from your image
    justifyContent: 'center',
    alignItems: 'center',
    top: -35, // Floats the button upwards into the hump
    // Stronger shadow for the button itself
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
});

export default CustomerTabs;