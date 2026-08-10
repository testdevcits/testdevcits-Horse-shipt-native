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
import { Plus } from 'lucide-react-native';

// Import screens and components
import HomeScreen from '../role/customer/screens/home/HomeScreen';
import MyShipments from '../role/customer/screens/myshipments/MyShipments';
import NewShipment from '../role/customer/screens/newshipment/NewShipment';
import MyHorses from '../role/customer/screens/myhorses/MyHorses';
import ShipperList from '../role/customer/screens/chats/Shipperlist';
import { AppText } from '../components';
import { COLORS, FONT_SIZE, FONTS } from '../constants';
import imageIndex from '../assets/images/imageIndex';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
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
      {/* Background card with hump */}
      <View style={styles.tabBarBackground}>
        <View style={styles.hump} />

        <View style={styles.tabBarButtonsContainer}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const activeColor = COLORS.brandBrown;
            const inactiveColor = COLORS.grey500;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const renderIcon = (color: string) => {
              switch (route.name) {
                case 'Home':
                  return (
                    <Image
                      source={imageIndex.Home}
                      style={{ width: 24, height: 24, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                case 'Shipments':
                  return (
                    <Image
                      source={imageIndex.Shipments}
                      style={{ width: 24, height: 24, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                case 'New':
                  return null;
                case 'Horses':
                  return (
                    <Image
                      source={imageIndex.Horse}
                      style={{ width: 24, height: 24, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                case 'Chats':
                  return (
                    <Image
                      source={imageIndex.Chat}
                      style={{ width: 24, height: 24, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                default:
                  return null;
              }
            };

            const getTabLabel = () => {
              switch (route.name) {
                case 'Home':
                  return 'Home';
                case 'Shipments':
                  return 'Shipments';
                case 'Horses':
                  return 'Horses';
                case 'Chats':
                  return 'Chats';
                default:
                  return '';
              }
            };

            if (route.name === 'New') {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={styles.centerButton}
                >
                  <Plus size={26} color={COLORS.white} strokeWidth={2.5} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                {renderIcon(isFocused ? activeColor : inactiveColor)}
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

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
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
    backgroundColor: COLORS.white,
    height: Platform.OS === 'ios' ? 88 : 72,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: COLORS.black,
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
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: COLORS.black,
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
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    marginTop: 3,
  },
  centerButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    top: -28,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },
});

export default CustomerTabs;

