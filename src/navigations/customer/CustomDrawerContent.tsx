import React, { lazy, memo, Suspense, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  StatusBar,
  Platform,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  LogOut,
  FileText,
  ChevronRight,
  Star,
  User,
  Bell,
  HelpCircle,
  Home as HomeIcon,
  MessageSquare,
  BadgeCheck,
  Sparkles,
} from 'lucide-react-native';
import DeviceInfo from 'react-native-device-info';


// Import constants & helpers
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

interface DrawerMenuItemProps {
  label: string;
  iconSource?: ImageSourcePropType;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  onPress: () => void;
  isActive?: boolean;
  isLast?: boolean;
  hasChevron?: boolean;
  badgeCount?: number;
}

const ConfirmationModal = lazy(
  () => import('../../components/common/ConfirmationModal/ConfirmationModal'),
);

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = memo(({
  label,
  iconSource,
  IconComponent,
  iconColor,
  onPress,
  isActive,
  isLast,
  hasChevron = true,
  badgeCount,
}) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      isActive && styles.menuItemActive,
      isLast && { marginBottom: 0 },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {isActive && <View style={styles.activeLeftBar} />}

    <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
      {IconComponent ? (
        <IconComponent
          size={19}
          color={
            iconColor || (isActive ? COLORS.primary : COLORS.grey600)
          }
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ) : iconSource ? (
        <Image
          source={iconSource}
          style={[
            styles.menuIcon,
            isActive && { tintColor: COLORS.primary },
          ]}
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
      numberOfLines={1}
    >
      {label}
    </AppText>

    {badgeCount !== undefined && badgeCount > 0 && (
      <View style={styles.badgeContainer}>
        <AppText style={styles.badgeText}>{badgeCount}</AppText>
      </View>
    )}

    {(isActive || hasChevron) && (
      <ChevronRight
        size={16}
        color={iconColor || (isActive ? COLORS.primary : COLORS.grey400)}
        style={styles.chevron}
      />
    )}
  </TouchableOpacity>
));

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useAppSelector(state => state.auth);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  // User details
  const userName = user?.name || (user as any)?.fullName || 'Not Available';
  const userEmail = user?.email || 'Not Available';
  const userRole = (user?.role || 'Not Available').toUpperCase();
  const profileImage = (user as any)?.profileImage || (user as any)?.avatar;

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Active drawer route name
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
      {/* Premium Profile Header Section */}
      <TouchableOpacity
        style={[
          styles.profileHeaderContainer,
          { paddingTop: Math.max(insets.top, 20) + 8 },
        ]}
        activeOpacity={0.9}
        onPress={() => navigateToRoute('Profile')}
      >
        <View style={styles.headerTopRow}>
          <Image
            source={imageIndex?.Logo}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.roleBadge}>
            <Sparkles size={11} color={COLORS.primary} style={{ marginRight: 4 }} />
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
              <BadgeCheck size={16} color={COLORS.success || '#10B981'} style={{ marginLeft: 4 }} />
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
        {/* SECTION 1: MAIN NAVIGATION */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>NAVIGATION</AppText>
          <DrawerMenuItem
            label="Home"
            IconComponent={HomeIcon}
            isActive={isTabActive('Home')}
            onPress={() => navigateToTab('Home')}
          />
          <DrawerMenuItem
            label="New Shipping"
            iconSource={imageIndex?.Shipping}
            isActive={isTabActive('New')}
            onPress={() => navigateToTab('New')}
          />
          <DrawerMenuItem
            label="My Shipments"
            iconSource={imageIndex?.Drawer_Shipments}
            isActive={isTabActive('Shipments')}
            onPress={() => navigateToTab('Shipments')}
          />
          <DrawerMenuItem
            label="My Horses"
            iconSource={imageIndex?.Horse}
            isActive={isTabActive('Horses')}
            onPress={() => navigateToTab('Horses')}
          />
          <DrawerMenuItem
            label="Chat"
            IconComponent={MessageSquare}
            isActive={isTabActive('Chats')}
            onPress={() => navigateToTab('Chats')}
          />
        </View>

        <View style={styles.divider} />

        {/* SECTION 2: ACCOUNT & REVIEWS */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>ACCOUNT</AppText>
          <DrawerMenuItem
            label="Profile"
            IconComponent={User}
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
            label="Settings"
            IconComponent={Bell}
            isActive={isDrawerRouteActive('Settings')}
            onPress={() => navigateToRoute('Settings')}
          />
        </View>

        <View style={styles.divider} />

        {/* SECTION 3: SUPPORT & LEGAL */}
        <View style={styles.sectionContainer}>
          <AppText style={styles.sectionTitle}>SUPPORT & LEGAL</AppText>
          <DrawerMenuItem
            label="Help Center"
            IconComponent={HelpCircle}
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

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setIsLogoutModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.logoutIconBg}>
            <LogOut size={17} color={COLORS.error} strokeWidth={2} />
          </View>
          <AppText style={styles.logoutText}>Log Out</AppText>
        </TouchableOpacity>

        <AppText style={styles.versionText}>HorseShipt v{DeviceInfo?.getVersion()}</AppText>
      </View>

      {/* Logout Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleLogoutConfirm}
          title="Log out of your account?"
          description="You will need to sign back in with your credentials to access your profile and saved settings."
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
  profileHeaderContainer: {
    backgroundColor: COLORS.background || '#F8FAFC',
    paddingHorizontal: SPACING.lg,
    // paddingTop: Platform.OS === 'ios' ? 20 : (StatusBar.currentHeight || 24) + 0,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100 || '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,

  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg || '#FEFCE8',
    paddingHorizontal: SPACING.sm2 || 10,
    paddingVertical: SPACING.xxs + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#FDE68A',
  },
  roleBadgeText: {
    fontSize: FONT_SIZE.xxs || 10,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 0.6,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
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
  drawerScroll: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xxs || 10,
    fontFamily: FONTS.bold,
    color: COLORS.textLight || '#94A3B8',
    letterSpacing: 1,
    marginLeft: SPACING.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm2 || 10,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xxs,
    borderRadius: RADIUS.md,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: COLORS.goldLightBg || '#FEFCE8',
  },
  activeLeftBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
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
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  menuLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  badgeContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: SPACING.xs,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider || '#F1F5F9',
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
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
    fontSize: FONT_SIZE.xxs || 10,
    fontFamily: FONTS.medium,
    color: COLORS.textLight || '#94A3B8',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default memo(CustomDrawerContent);
