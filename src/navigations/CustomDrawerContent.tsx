import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

// Import constants
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, ICON_SIZE, RADIUS } from '../constants/dimensions';
import { FONTS } from '../constants/fonts';
import imageIndex from '../assets/images/imageIndex';
import { AppText } from '../components';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../redux/slices/authSlice';

interface DrawerMenuItemProps {
  label: string;
  iconSource: ImageSourcePropType;
  onPress: () => void;
  isActive?: boolean;
  isLast?: boolean;
}

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({
  label,
  iconSource,
  onPress,
  isActive,
  isLast,
}) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      isActive && styles.menuItemActive,
      isLast ? { marginBottom: 0 } : null,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      <Image
        source={iconSource}
        style={[styles.menuIcon, isActive && styles.menuIconActive]}
        resizeMode="contain"
      />
    </View>
    <AppText style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();

  // Active drawer route name (e.g., 'MainTabs', 'Profile', 'HelpCenter', etc.)
  const currentDrawerRoute = state?.routes[state?.index]?.name;

  // Active bottom tab route name inside 'MainTabs'
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

  return (
    <View style={styles.safeArea}>
      {/* Header Section with Logo */}
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
          <DrawerMenuItem
            label="Home"
            iconSource={imageIndex.Drawer_Home}
            isActive={isTabActive('Home')}
            onPress={() => navigateToTab('Home')}
          />
          <DrawerMenuItem
            label="Shipping"
            iconSource={imageIndex.Shipping}
            isActive={isTabActive('New')}
            onPress={() => navigateToTab('New')}
          />
          <DrawerMenuItem
            label="My Shipments"
            iconSource={imageIndex.Drawer_Shipments}
            isActive={isTabActive('Shipments')}
            onPress={() => navigateToTab('Shipments')}
          />
          <DrawerMenuItem
            label="My Horses"
            iconSource={imageIndex.Horse}
            isActive={isTabActive('Horses')}
            onPress={() => navigateToTab('Horses')}
          />
          <DrawerMenuItem
            label="Chat"
            iconSource={imageIndex.Messages}
            isActive={isTabActive('Chats')}
            onPress={() => navigateToTab('Chats')}
          />
          <DrawerMenuItem
            label="Profile"
            iconSource={imageIndex.AccountIcon}
            isActive={isDrawerRouteActive('Profile')}
            onPress={() => navigateToRoute('Profile')}
          />
          <DrawerMenuItem
            label="Help Center"
            iconSource={imageIndex.Help}
            isActive={isDrawerRouteActive('HelpCenter')}
            onPress={() => navigateToRoute('HelpCenter')}
          />
          <DrawerMenuItem
            label="Privacy Policy"
            iconSource={imageIndex.Help}
            isActive={isDrawerRouteActive('PrivacyPolicy')}
            onPress={() => navigateToRoute('PrivacyPolicy')}
            isLast={true}
          />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <DrawerMenuItem
          label="Logout"
          iconSource={imageIndex.Help}
          onPress={() => dispatch(logoutUser())}
          isLast={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  logoIcon: {
    width: 32,
    height: 32,
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  drawerScroll: {
    paddingTop: SPACING.sm,
  },
  menuContainer: {
    paddingHorizontal: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  menuItemActive: {
    backgroundColor: '#F5EBE1',
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: ICON_SIZE.sm,
    height: ICON_SIZE.sm,
  },
  menuIconActive: {
    tintColor: '#A06333',
  },
  menuLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  menuLabelActive: {
    color: '#A06333',
    fontFamily: FONTS.bold,
  },
  footerContainer: {
    padding: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});

export default CustomDrawerContent;
