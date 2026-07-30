import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Home,
  Package,
  ClipboardList,
  Disc,
  User,
  MessageSquare,
  DollarSign,
  Star,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE } from '../constants/dimensions';
import { FONTS } from '../constants/fonts';
import imageIndex from '../assets/images/imageIndex';
import { AppText } from '../components';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';

interface DrawerItemProps {
  label: string;
  IconComponent: React.ElementType;
  onPress: () => void;
  isActive?: boolean;
  hasChevron?: boolean;
}

const ShipperDrawerMenuItem: React.FC<DrawerItemProps> = ({
  label,
  IconComponent,
  onPress,
  isActive,
  hasChevron,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isActive && styles.menuItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      <IconComponent
        size={20}
        color={isActive ? '#A06333' : '#374151'}
        strokeWidth={1.8}
      />
    </View>
    <AppText style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
      {label}
    </AppText>
    {hasChevron && (
      <ChevronRight size={18} color="#9CA3AF" style={styles.chevron} />
    )}
  </TouchableOpacity>
);

const CustomShipperDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useDispatch();

  const currentDrawerRoute = state?.routes[state?.index]?.name;
  const mainTabsRoute = state?.routes?.find(r => r.name === 'MainTabs');
  const mainTabsState = mainTabsRoute?.state;
  const currentActiveTab = mainTabsState?.routes
    ? mainTabsState.routes[mainTabsState.index ?? 0]?.name
    : 'Home';

  const isTabActive = (tabName: string) => {
    return currentDrawerRoute === 'MainTabs' && currentActiveTab === tabName;
  };

  const isDrawerRouteActive = (routeName: string) => {
    return currentDrawerRoute === routeName;
  };

  const navigateToTab = (tabName: string) => {
    navigation.navigate('MainTabs', { screen: tabName });
    navigation.closeDrawer();
  };

  const navigateToRoute = (routeName: string) => {
    navigation.navigate(routeName);
    navigation.closeDrawer();
  };

  const openGoogleReview = () => {
    Linking.openURL('https://google.com');
    navigation.closeDrawer();
  };

  return (
    <View style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={imageIndex.LogoIcon}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <AppText style={styles.logoText}>HorseShipt</AppText>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          <ShipperDrawerMenuItem
            label="Home"
            IconComponent={Home}
            isActive={isTabActive('Home')}
            onPress={() => navigateToTab('Home')}
          />
          <ShipperDrawerMenuItem
            label="Shipment"
            IconComponent={Package}
            hasChevron={true}
            isActive={isTabActive('Post')}
            onPress={() => navigateToTab('Post')}
          />
          <ShipperDrawerMenuItem
            label="My Quotes"
            IconComponent={ClipboardList}
            isActive={isTabActive('MyQuotes')}
            onPress={() => navigateToTab('MyQuotes')}
          />
          <ShipperDrawerMenuItem
            label="My Vehicles"
            IconComponent={Disc}
            isActive={isDrawerRouteActive('MyVehicles')}
            onPress={() => navigateToRoute('MyVehicles')}
          />
          <ShipperDrawerMenuItem
            label="Truck Driver"
            IconComponent={User}
            isActive={isDrawerRouteActive('TruckDriver')}
            onPress={() => navigateToRoute('TruckDriver')}
          />
          <ShipperDrawerMenuItem
            label="Chat"
            IconComponent={MessageSquare}
            isActive={isTabActive('Chats')}
            onPress={() => navigateToTab('Chats')}
          />
          <ShipperDrawerMenuItem
            label="Earnings"
            IconComponent={DollarSign}
            isActive={isDrawerRouteActive('Earnings')}
            onPress={() => navigateToRoute('Earnings')}
          />
          <ShipperDrawerMenuItem
            label="Google review"
            IconComponent={Star}
            isActive={isDrawerRouteActive('GoogleReview')}
            onPress={() => navigateToRoute('GoogleReview')}
          />
          <ShipperDrawerMenuItem
            label="Settings"
            IconComponent={Settings}
            isActive={isDrawerRouteActive('Settings')}
            onPress={() => navigateToRoute('Settings')}
          />
          <ShipperDrawerMenuItem
            label="Privacy policy"
            IconComponent={ShieldCheck}
            isActive={isDrawerRouteActive('PrivacyPolicy')}
            onPress={() => navigateToRoute('PrivacyPolicy')}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => dispatch(logoutUser())}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <LogOut size={20} color="#EF4444" strokeWidth={1.8} />
          </View>
          <AppText style={[styles.menuLabel, { color: '#EF4444' }]}>
            Logout
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoIcon: {
    width: 32,
    height: 32,
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  drawerScroll: {
    paddingTop: SPACING.xs,
  },
  menuContainer: {
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuItemActive: {
    backgroundColor: '#FBF5EB',
  },
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  menuLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: '#374151',
    flex: 1,
  },
  menuLabelActive: {
    color: '#A06333',
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: 'auto',
  },
  footerContainer: {
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

export default CustomShipperDrawerContent;
