import React, { lazy, memo, Suspense, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
  Sparkles,
  BadgeCheck,
  Star,
  Truck,
  DollarSign,
} from 'lucide-react-native';
import DeviceInfo from 'react-native-device-info';

import { COLORS } from '../../constants/colors';
import {
  SPACING,
  FONT_SIZE,
  RADIUS,
} from '../../constants/dimensions';
import { FONTS } from '../../constants/fonts';
import imageIndex from '../../assets/images/imageIndex';
import { AppText } from '../../components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../redux/slices/authSlice';

interface DrawerItemProps {
  label: string;
  IconComponent?: React.ElementType;
  imageSource?: any;
  onPress: () => void;
  isActive?: boolean;
  hasChevron?: boolean;
  isExpanded?: boolean;
  isLast?: boolean;
}

const ConfirmationModal = lazy(
  () => import('../../components/common/ConfirmationModal/ConfirmationModal'),
);

const ShipperDrawerMenuItem: React.FC<DrawerItemProps> = memo(
  ({
    label,
    IconComponent,
    imageSource,
    onPress,
    isActive,
    hasChevron,
    isExpanded,
    isLast,
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
        isLast && { marginBottom: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {isActive && <View style={styles.activeLeftBar} />}

      <View
        style={[styles.iconContainer, isActive && styles.iconContainerActive]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.menuImage,
              isActive && { tintColor: COLORS.brandBrown },
            ]}
            resizeMode="contain"
          />
        ) : IconComponent ? (
          <IconComponent
            size={19}
            color={isActive ? COLORS.brandBrown : COLORS.grey600}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        ) : null}
      </View>

      <AppText style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {label}
      </AppText>

      {hasChevron ? (
        isExpanded ? (
          <ChevronDown
            size={16}
            color={isActive ? COLORS.brandBrown : COLORS.textLight}
            style={styles.chevron}
          />
        ) : (
          <ChevronRight
            size={16}
            color={isActive ? COLORS.brandBrown : COLORS.textLight}
            style={styles.chevron}
          />
        )
      ) : (
        <ChevronRight
          size={16}
          color={isActive ? COLORS.brandBrown : COLORS.grey400}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  ),
);

interface SubMenuItemProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const ShipperDrawerSubMenuItem: React.FC<SubMenuItemProps> = memo(
  ({ label, onPress, isActive }) => (
    <TouchableOpacity
      style={[styles.subMenuItem, isActive && styles.subMenuItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.bulletDot, isActive && styles.bulletDotActive]}
      />
      <AppText
        style={[styles.subMenuLabel, isActive && styles.subMenuLabelActive]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  ),
);

const CustomShipperDrawerContent: React.FC<
  DrawerContentComponentProps
> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(reduxState => reduxState?.auth);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isShipmentExpanded, setIsShipmentExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);

  // User details
  const userName = user?.name || (user as any)?.fullName || 'NOT AVAILABLE';
  const userEmail = user?.email || 'Not Available';
  const userRole = (user?.role || 'NOT AVAILABLE').toUpperCase();
  const rawImage = (user as any)?.profileImage;
  const profileImage = typeof rawImage === 'string' ? rawImage : rawImage?.url;

  const getInitials = (name: string) => {
    if (!name || name === 'Not Available') return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const currentDrawerRoute = state?.routes[state?.index]?.name;
  const mainTabsRoute = state?.routes?.find((r: any) => r.name === 'MainTabs');
  const mainTabsState = mainTabsRoute?.state;
  const currentActiveTab = mainTabsState?.routes
    ? mainTabsState.routes[mainTabsState.index ?? 0]?.name
    : 'Home';

  const postRoute = mainTabsState?.routes?.find((r: any) => r.name === 'Post');
  const activeSubTab = (postRoute?.params as any)?.initialTab || 'my_shipments';

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
      {/* Premium Profile & Brand Header */}
      <TouchableOpacity
        style={[
          styles.profileHeaderContainer,
          // { paddingTop: Math.max(insets.top, 20) + 6 },
        ]}
        activeOpacity={0.9}
        onPress={() => navigateToTab('Home')}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.logoGroup}>
            <Image
              source={imageIndex?.LogoIcon}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <AppText style={styles.logoText}>HorseShipt</AppText>
          </View>

          <View style={styles.roleBadge}>
            <Sparkles
              size={11}
              color={COLORS.brandBrown}
              style={{ marginRight: 4 }}
            />
            <AppText style={styles.roleBadgeText}>{userRole}</AppText>
          </View>
        </View>

        <View style={styles.userCardRow}>
          {profileImage && !imageError ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <AppText style={styles.avatarInitials}>
                {getInitials(userName)}
              </AppText>
            </View>
          )}

          <View style={styles.userInfoCol}>
            <View style={styles.userNameRow}>
              <AppText style={styles.userNameText} numberOfLines={1}>
                {userName}
              </AppText>
              <BadgeCheck
                size={16}
                color={COLORS.greenSuccess || '#10B981'}
                style={{ marginLeft: 4 }}
              />
            </View>
            <AppText style={styles.userEmailText} numberOfLines={1}>
              {userEmail}
            </AppText>
          </View>

          <ChevronRight size={18} color={COLORS.grey400} />
        </View>
      </TouchableOpacity>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: MAIN MENU */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>MAIN MENU</AppText>
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
                onPress={() =>
                  navigateToTab('Post', { initialTab: 'my_shipments' })
                }
              />
              <ShipperDrawerSubMenuItem
                label="Quote Received"
                isActive={isPostActive && activeSubTab === 'quote_request'}
                onPress={() =>
                  navigateToTab('Post', { initialTab: 'quote_request' })
                }
              />
              <ShipperDrawerSubMenuItem
                label="All Shipments"
                isActive={isPostActive && activeSubTab === 'all_shipment'}
                onPress={() =>
                  navigateToTab('Post', { initialTab: 'all_shipment' })
                }
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
            label="Chat"
            IconComponent={MessageSquare}
            isActive={isTabActive('Chats')}
            onPress={() => navigateToTab('Chats')}
          />
        </View>

        <View style={styles.divider} />

        {/* SECTION 2: FLEET & OPERATIONS */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>FLEET & OPERATIONS</AppText>
          <ShipperDrawerMenuItem
            label="My Vehicles"
            imageSource={imageIndex?.vehicles}
            IconComponent={Truck}
            isActive={isDrawerRouteActive('MyVehicles')}
            onPress={() => navigateToRoute('MyVehicles')}
          />
          <ShipperDrawerMenuItem
            label="Truck Drivers"
            IconComponent={User}
            isActive={isDrawerRouteActive('TruckDriver')}
            onPress={() => navigateToRoute('TruckDriver')}
          />
          <ShipperDrawerMenuItem
            label="Preferred Areas"
            IconComponent={Locate}
            isActive={isDrawerRouteActive('PreferredAreas')}
            onPress={() => navigateToRoute('PreferredAreas')}
          />
          <ShipperDrawerMenuItem
            label="Earnings"
            imageSource={imageIndex?.earnings}
            IconComponent={DollarSign}
            isActive={isDrawerRouteActive('Earnings')}
            onPress={() => navigateToRoute('Earnings')}
          />
        </View>

        <View style={styles.divider} />

        {/* SECTION 3: ACCOUNT & LEGAL */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>ACCOUNT & LEGAL</AppText>
          <ShipperDrawerMenuItem
            label="Google Review"
            imageSource={imageIndex?.googlereview}
            IconComponent={Star}
            isActive={isDrawerRouteActive('GoogleReview')}
            onPress={() => navigateToRoute('GoogleReview')}
          />
          <ShipperDrawerMenuItem
            label="Notifications Settings"
            IconComponent={Settings}
            isActive={isDrawerRouteActive('Settings')}
            onPress={() => navigateToRoute('Settings')}
          />
          <ShipperDrawerMenuItem
            label="Privacy Policy"
            IconComponent={ShieldCheck}
            isActive={isDrawerRouteActive('PrivacyPolicy')}
            onPress={() => navigateToRoute('PrivacyPolicy')}
          />
          <ShipperDrawerMenuItem
            label="Terms & Conditions"
            IconComponent={FileText}
            isActive={isDrawerRouteActive('TermsAndConditions')}
            onPress={() => navigateToRoute('TermsAndConditions')}
            isLast={true}
          />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setIsLogoutModalVisible(true)}
          activeOpacity={0.75}
        >
          <View style={styles.logoutIconBg}>
            <LogOut size={17} color={COLORS.error} strokeWidth={2} />
          </View>
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>

        <AppText style={styles.versionText}>
          HorseShipt v{DeviceInfo?.getVersion() || '1.0.0'}
        </AppText>
      </View>

      {/* Logout Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleLogoutConfirm}
          title="Log out of your account?"
          description="You will need to sign back in with your credentials to access your shipper profile."
          confirmText="Logout"
          cancelText="Cancel"
          type="danger"
        />
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopRightRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  /* Profile Header */
  profileHeaderContainer: {
    backgroundColor: COLORS.background || '#FAF9F6',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100 || '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 28,
    height: 28,
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    letterSpacing: -0.5,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg || '#FFFBEB',
    paddingHorizontal: SPACING.sm2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#FDE68A',
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    letterSpacing: 0.6,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.brandBrown,
  },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },
  userInfoCol: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.xs,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  userEmailText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* Drawer Scroll & Items */
  drawerScroll: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    letterSpacing: 1.1,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm2,
    paddingHorizontal: SPACING.md,
    marginBottom: 2,
    borderRadius: RADIUS.md,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: COLORS.goldLightBg || '#FFFBEB',
  },
  activeLeftBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.brandBrown,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm2,
  },
  iconContainerActive: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs,
  },
  menuImage: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
  },
  menuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: SPACING.xs,
  },

  /* Submenu */
  subMenuContainer: {
    backgroundColor: '#FAFAF9',
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.xs,
    marginVertical: 2,
    paddingVertical: 2,
  },
  subMenuItem: {
    paddingVertical: SPACING.xs + 2,
    paddingLeft: SPACING.xl + 18,
    paddingRight: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subMenuItemActive: {
    backgroundColor: '#F5F5F4',
    borderRadius: RADIUS.xs,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.grey400,
    marginRight: SPACING.sm,
  },
  bulletDotActive: {
    backgroundColor: COLORS.brandBrown,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subMenuLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  subMenuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider || '#F1F5F9',
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },

  /* Footer & Logout */
  footerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider || '#F1F5F9',
    backgroundColor: COLORS.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: '#FEF2F2',
  },
  logoutIconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logoutText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },
  versionText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default memo(CustomShipperDrawerContent);
