import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  Keyboard,
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
  // 3. Create a state to track keyboard visibility
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Android triggers 'Did' events, iOS can use 'Will' for smoother transitions
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // 4. If keyboard is visible, return null to hide the entire tab bar
  if (isKeyboardVisible) return null;
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