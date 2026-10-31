import React, { lazy, memo, Suspense, useState } from 'react';
import { View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  ShieldCheck,
  FileText,
  Star,
  User,
  Bell,
  HelpCircle,
  Home as HomeIcon,
  MessageSquare,
} from 'lucide-react-native';

import imageIndex from '../../assets/images/imageIndex';
import { AppText } from '../../components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../redux/slices/authSlice';

import styles from './components/styles.customerdrawer';
import CustomerDrawerHeader from './components/CustomerDrawerHeader';
import { DrawerMenuItem } from './components/CustomerDrawerMenuItem';
import CustomerDrawerFooter from './components/CustomerDrawerFooter';

const ConfirmationModal = lazy(
  () => import('../../components/common/ConfirmationModal/ConfirmationModal'),
);

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(reduxState => reduxState?.auth);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Active drawer route name
  const currentDrawerRoute = state?.routes[state?.index]?.name;

  // Active bottom tab route name inside 'MainTabs'
  const mainTabsRoute = state?.routes?.find((r: any) => r.name === 'MainTabs');
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
      {/* Header Sub-Component */}
      <CustomerDrawerHeader
        user={user}
        onPressProfile={() => navigateToRoute('Profile')}
      />

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

      {/* Footer Sub-Component */}
      <CustomerDrawerFooter
        onLogoutPress={() => setIsLogoutModalVisible(true)}
      />

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

export default memo(CustomDrawerContent);
