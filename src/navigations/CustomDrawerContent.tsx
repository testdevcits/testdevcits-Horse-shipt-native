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
import { ShieldCheck, LogOut, FileText, ChevronRight, Star } from 'lucide-react-native';

// Import constants
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, ICON_SIZE, RADIUS } from '../constants/dimensions';
import { FONTS } from '../constants/fonts';
import imageIndex from '../assets/images/imageIndex';
import { AppText, ConfirmationModal } from '../components';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../redux/slices/authSlice';

interface DrawerMenuItemProps {
  label: string;
  iconSource?: ImageSourcePropType;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  onPress: () => void;
  isActive?: boolean;
  isLast?: boolean;
  hasChevron?: boolean;
}

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({
  label,
  iconSource,
  IconComponent,
  iconColor,
  onPress,
  isActive,
  isLast,
  hasChevron,
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
      {IconComponent ? (
        <IconComponent
          size={18}
          color={iconColor || (isActive ? COLORS.brandBrown : COLORS.textPrimary)}
          strokeWidth={1.8}
        />
      ) : iconSource ? (
        <Image
          source={iconSource}
          style={[styles.menuIcon, isActive && styles.menuIconActive]}
          resizeMode="contain"
        />
      ) : null}
    </View>
    <AppText
      style={[
        styles.menuLabel,
        isActive && styles.menuLabelActive,
        iconColor ? { color: iconColor } : null,
      ]}
    >
      {label}
    </AppText>
    {(isActive || hasChevron) && (
      <ChevronRight
        size={18}
        color={iconColor || (isActive ? COLORS.brandBrown : COLORS.grey400)}
      />
    )}
  </TouchableOpacity>
);

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);

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

  const handleLogoutConfirm = () => {
    setIsLogoutModalVisible(false);
    dispatch(logoutUser());
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
            label="Reviews"
            IconComponent={Star}
            isActive={isDrawerRouteActive('Reviews')}
            onPress={() => navigateToRoute('Reviews')}
          />
          <DrawerMenuItem
            label="Help Center"
            iconSource={imageIndex.Help}
            isActive={isDrawerRouteActive('HelpCenter')}
            onPress={() => navigateToRoute('HelpCenter')}
          />
          <DrawerMenuItem
            label="Privacy Policy"
            IconComponent={ShieldCheck}
            isActive={isDrawerRouteActive('PrivacyPolicy')}
            onPress={() => navigateToRoute('PrivacyPolicy')}
          />
          <DrawerMenuItem
            label="Terms & Conditions"
            IconComponent={FileText}
            isActive={isDrawerRouteActive('TermsAndConditions')}
            onPress={() => navigateToRoute('TermsAndConditions')}
            isLast={true}
          />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <DrawerMenuItem
          label="Logout"
          IconComponent={LogOut}
          iconColor={COLORS.error}
          onPress={() => setIsLogoutModalVisible(true)}
          isLast={true}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        description="Are you sure you want to log out of your account?"
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
      />
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
    width: ICON_SIZE.xl,
    height: ICON_SIZE.xl,
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
    paddingVertical: SPACING.xs2,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  menuItemActive: {
    backgroundColor: COLORS.brandBrownLightBg,
  },
  iconContainer: {
    width: FONT_SIZE.display,
    height: FONT_SIZE.display,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: ICON_SIZE.sm,
    height: ICON_SIZE.sm,
  },
  menuIconActive: {
    tintColor: COLORS.brandBrown,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  menuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  footerContainer: {
    padding: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});

export default CustomDrawerContent;
