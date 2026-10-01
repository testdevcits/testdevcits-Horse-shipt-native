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
import { COLORS, FONT_SIZE, FONTS } from '../../constants';
import imageIndex from '../../assets/images/imageIndex';
import AppIcon from '../../components/app_icon/AppIcon';
import AppText from '../../components/common/AppText';

// Screens
import DriverHomeScreen from '../../role/driver/screens/home/home_screen/HomeScreen';
import AllTrips from '../../role/driver/screens/trips/AllTrips';
import LocationScreen from '../../role/driver/screens/location/LocationScreen';
import ProfileScreen from '../../role/driver/screens/profile/Profile';

const Tab = createBottomTabNavigator<{
  Home: undefined;
  Trips: undefined;
  Location: undefined;
  Profile: undefined;
}>();

const { width } = Dimensions.get('window');

const CustomDriverTabBar = ({ state, navigation }: any) => {
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
        <View style={styles.tabBarButtonsContainer}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const activeColor = COLORS.primary;
            const inactiveColor = COLORS.slate400;

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
                      source={imageIndex?.Home}
                      style={{ width: 22, height: 22, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                case 'Trips':
                  return (
                    <Image
                      source={imageIndex?.Shipments}
                      style={{ width: 22, height: 22, tintColor: color }}
                      resizeMode="contain"
                    />
                  );
                case 'Location':
                  return <AppIcon name="Navigation" size={22} color={color} />;
                case 'Profile':
                  return (
                    <Image
                      source={imageIndex?.AccountIcon}
                      style={{ width: 22, height: 22, tintColor: color }}
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
                  return 'Shipments';
                case 'Trips':
                  return 'Tracking';
                case 'Location':
                  return 'Live GPS';
                case 'Profile':
                  return 'Account';
                default:
                  return route.name;
              }
            };

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.tabItem, isFocused && styles.tabItemActive]}
              >
                <View style={styles.iconWrapper}>
                  {renderIcon(isFocused ? activeColor : inactiveColor)}
                </View>
                <AppText
                  style={[
                    styles.tabLabel,
                    isFocused
                      ? styles.tabLabelFocused
                      : styles.tabLabelInactive,
                  ]}
                >
                  {getTabLabel()}
                </AppText>
                {isFocused && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const DriverTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomDriverTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={DriverHomeScreen} />
    <Tab.Screen name="Trips" component={AllTrips} />
    <Tab.Screen name="Location" component={LocationScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: COLORS.transparent,
    elevation: 0,
  },
  tabBarBackground: {
    backgroundColor: COLORS.white,
    height: Platform.OS === 'ios' ? 88 : 74,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBarButtonsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: '#FFFBEB', // Soft gold cream active highlight capsule
  },
  iconWrapper: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
  },
  tabLabelFocused: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  tabLabelInactive: {
    fontFamily: FONTS.medium,
    color: COLORS.slate400,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

export default DriverTabs;
