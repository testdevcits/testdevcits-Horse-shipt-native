import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,

} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Home,
  ClipboardList,
  User,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ChevronDown,
  Locate,
  FileText,
  Edit3,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, ICON_SIZE } from '../constants/dimensions';
import { FONTS } from '../constants/fonts';
import imageIndex from '../assets/images/imageIndex';
import { AppText, ConfirmationModal } from '../components';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../redux/slices/authSlice';

interface DrawerItemProps {
  label: string;
  IconComponent?: React.ElementType;
  imageSource?: any;
  onPress: () => void;
  isActive?: boolean;
  hasChevron?: boolean;
  isExpanded?: boolean;
}

const ShipperDrawerMenuItem: React.FC<DrawerItemProps> = ({
  label,
  IconComponent,
  imageSource,
  onPress,
  isActive,
  hasChevron,
  isExpanded,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isActive && styles.menuItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.menuImage}
          resizeMode="contain"
        />
      ) : IconComponent ? (
        <IconComponent
          size={20}
          color={isActive ? COLORS.brandBrown : COLORS.grey700}
          strokeWidth={1.8}
        />
      ) : null}
    </View>
    <AppText style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
      {label}
    </AppText>
    {hasChevron ? (
      isExpanded ? (
        <ChevronDown
          size={18}
          color={isActive ? COLORS.brandBrown : COLORS.textLight}
          style={styles.chevron}
        />
      ) : (
        <ChevronRight
          size={18}
          color={isActive ? COLORS.brandBrown : COLORS.textLight}
          style={styles.chevron}
        />
      )
    ) : (
      isActive && (
        <ChevronRight
          size={18}
          color={COLORS.brandBrown}
          style={styles.chevron}
        />
      )
    )}
  </TouchableOpacity>
);

interface SubMenuItemProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const ShipperDrawerSubMenuItem: React.FC<SubMenuItemProps> = ({
  label,
  onPress,
  isActive,
}) => (
  <TouchableOpacity
    style={[styles.subMenuItem, isActive && styles.subMenuItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <AppText style={[styles.subMenuLabel, isActive && styles.subMenuLabelActive]}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const CustomShipperDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);
  const [isShipmentExpanded, setIsShipmentExpanded] = React.useState(true);

  const currentDrawerRoute = state?.routes[state?.index]?.name;
  const mainTabsRoute = state?.routes?.find(r => r.name === 'MainTabs');
  const mainTabsState = mainTabsRoute?.state;
  const currentActiveTab = mainTabsState?.routes
    ? mainTabsState.routes[mainTabsState.index ?? 0]?.name
    : 'Home';

  const postRoute = mainTabsState?.routes?.find((r: any) => r.name === 'Post');
  const activeSubTab = postRoute?.params?.initialTab || 'my_shipments';

  const isTabActive = (tabName: string) => {
    return currentDrawerRoute === 'MainTabs' && currentActiveTab === tabName;
  };

  const isDrawerRouteActive = (routeName: string) => {
    return currentDrawerRoute === routeName;
  };

  const navigateToTab = (tabName: string, params?: any) => {
    navigation.navigate('MainTabs', { screen: tabName, params });
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

  const isPostActive = isTabActive('Post');

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
            IconComponent={Edit3}
            isActive={isPostActive}
            hasChevron
            isExpanded={isShipmentExpanded}
            onPress={() => {
              setIsShipmentExpanded(prev => !prev);
              if (!isPostActive) {
                navigateToTab('Post', { initialTab: 'my_shipments' });
              }
            }}
          />
          {isShipmentExpanded && (
            <View style={styles.subMenuContainer}>
              <ShipperDrawerSubMenuItem
                label="My Shipment"
                isActive={isPostActive && activeSubTab === 'my_shipments'}
                onPress={() => navigateToTab('Post', { initialTab: 'my_shipments' })}
              />
              <ShipperDrawerSubMenuItem
                label="Quote Requests"
                isActive={isPostActive && activeSubTab === 'quote_request'}
                onPress={() => navigateToTab('Post', { initialTab: 'quote_request' })}
              />
              <ShipperDrawerSubMenuItem
                label="All Shipments"
                isActive={isPostActive && activeSubTab === 'all_shipment'}
                onPress={() => navigateToTab('Post', { initialTab: 'all_shipment' })}
              />
            </View>
          )}
          <ShipperDrawerMenuItem
            label="My Quotes"
            IconComponent={ClipboardList}
            isActive={isTabActive('MyQuotes')}
            onPress={() => navigateToTab('MyQuotes')}
          />
          <ShipperDrawerMenuItem
            label="My Vehicles"
            imageSource={imageIndex.vehicles}
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
            imageSource={imageIndex.earnings}
            isActive={isDrawerRouteActive('Earnings')}
            onPress={() => navigateToRoute('Earnings')}
          />
          <ShipperDrawerMenuItem
            label="Google review"
            imageSource={imageIndex.googlereview}
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
            label="Preferred Areas"
            IconComponent={Locate}
            isActive={isDrawerRouteActive('PreferredAreas')}
            onPress={() => navigateToRoute('PreferredAreas')}
          />
          <ShipperDrawerMenuItem
            label="Privacy policy"
            IconComponent={ShieldCheck}
            isActive={isDrawerRouteActive('PrivacyPolicy')}
            onPress={() => navigateToRoute('PrivacyPolicy')}
          />
          <ShipperDrawerMenuItem
            label="Terms & Conditions"
            IconComponent={FileText}
            isActive={isDrawerRouteActive('TermsAndConditions')}
            onPress={() => navigateToRoute('TermsAndConditions')}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setIsLogoutModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <LogOut size={20} color={COLORS.error} strokeWidth={1.8} />
          </View>
          <AppText style={[styles.menuLabel, { color: COLORS.error }]}>
            Logout
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        description="Are you sure you want to log out of your shipper account?"
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  logoIcon: {
    width: ICON_SIZE.xl,
    height: ICON_SIZE.xl,
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
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
    paddingVertical: SPACING.md2,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  menuItemActive: {
    backgroundColor: COLORS.goldLightBg,
  },
  iconContainer: {
    width: ICON_SIZE.lg,
    height: ICON_SIZE.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  menuImage: {
    width: SPACING.xl,
    height: SPACING.xl,
  },
  menuLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
    flex: 1,
  },
  menuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: 'auto',
  },
  subMenuContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.xs,
  },
  subMenuItem: {
    paddingVertical: SPACING.sm + 2,
    paddingLeft: SPACING.xl + 24,
    paddingRight: SPACING.md,
  },
  subMenuItemActive: {
    backgroundColor: COLORS.goldLightBg,
  },
  subMenuLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  subMenuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  footerContainer: {
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey100,
  },
});

export default CustomShipperDrawerContent;
