import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  ClipboardList,
  Plus,
  User,
  MessageSquare,
} from 'lucide-react-native';
import { AppText } from '../components';
import { FONTS } from '../constants';

// Screens
import ShipperHomeScreen from '../role/shipper/screens/home/ShipperHomeScreen';
import MyQuotesScreen from '../role/shipper/screens/quotes/MyQuotesScreen';
import PostLoadScreen from '../role/shipper/screens/post/PostLoadScreen';
import ShipperProfileScreen from '../role/shipper/screens/profile/ShipperProfileScreen';
import ShipperChatsScreen from '../role/shipper/screens/chats/ShipperChatsScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomShipperTabBar = ({ state, descriptors, navigation }: any) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

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

  if (isKeyboardVisible) return null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabBarBackground}>
        {/* The Hump behind the center button */}
        <View style={styles.hump} />

        <View style={styles.tabBarButtonsContainer}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const activeColor = '#A06333';
            const inactiveColor = '#4B5563';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Render Center Floating '+' Button
            if (route.name === 'Post') {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={styles.centerButton}
                >
                  <Plus size={28} color="#FFF" strokeWidth={2.5} />
                </TouchableOpacity>
              );
            }

            const getTabIcon = () => {
              const iconColor = isFocused ? activeColor : inactiveColor;
              switch (route.name) {
                case 'Home':
                  return <Home size={24} color={iconColor} strokeWidth={1.8} />;
                case 'MyQuotes':
                  return (
                    <ClipboardList size={24} color={iconColor} strokeWidth={1.8} />
                  );
                case 'Profile':
                  return <User size={24} color={iconColor} strokeWidth={1.8} />;
                case 'Chats':
                  return (
                    <MessageSquare size={24} color={iconColor} strokeWidth={1.8} />
                  );
                default:
                  return null;
              }
            };

            const getTabLabel = () => {
              switch (route.name) {
                case 'Home':
                  return 'Home';
                case 'MyQuotes':
                  return 'My Quotes';
                case 'Profile':
                  return 'Profile';
                case 'Chats':
                  return 'Chats';
                default:
                  return '';
              }
            };

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                {getTabIcon()}
                {isFocused && (
                  <AppText style={styles.tabLabelFocused}>{getTabLabel()}</AppText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const ShipperTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomShipperTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={ShipperHomeScreen} />
    <Tab.Screen name="MyQuotes" component={MyQuotesScreen} />
    <Tab.Screen name="Post" component={PostLoadScreen} />
    <Tab.Screen name="Profile" component={ShipperProfileScreen} />
    <Tab.Screen name="Chats" component={ShipperChatsScreen} />
  </Tab.Navigator>
);

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
    height: Platform.OS === 'ios' ? 88 : 72,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 20,
  },
  hump: {
    position: 'absolute',
    top: -30,
    left: width / 2 - 45,
    width: 90,
    height: 60,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
    paddingBottom: Platform.OS === 'ios' ? 18 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabelFocused: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#A06333',
    marginTop: 3,
  },
  centerButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#A06333',
    justifyContent: 'center',
    alignItems: 'center',
    top: -28,
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
});

export default ShipperTabs;