import React, { lazy, memo, Suspense, useState } from 'react';
import { View } from 'react-native';
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
  Locate,
  FileText,
  Edit3,
  Star,
  Truck,
  DollarSign,
} from 'lucide-react-native';

import imageIndex from '../../assets/images/imageIndex';
import { AppText } from '../../components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../redux/slices/authSlice';

import styles from './components/styles.shipperdrawer';
import ShipperDrawerHeader from './components/ShipperDrawerHeader';
import {
  ShipperDrawerMenuItem,
  ShipperDrawerSubMenuItem,
} from './components/ShipperDrawerItem';
import ShipperDrawerFooter from './components/ShipperDrawerFooter';

const ConfirmationModal = lazy(
  () => import('../../components/common/ConfirmationModal/ConfirmationModal'),
);

const CustomShipperDrawerContent: React.FC<
  DrawerContentComponentProps
> = props => {
  const { navigation, state } = props;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(reduxState => reduxState?.auth);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isShipmentExpanded, setIsShipmentExpanded] = useState(true);

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
      {/* Header Sub-Component */}
      <ShipperDrawerHeader
        user={user}
        onPressProfile={() => navigateToTab('Home')}
      />

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

      {/* Footer Sub-Component */}
      <ShipperDrawerFooter
        onLogoutPress={() => setIsLogoutModalVisible(true)}
      />

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

export default memo(CustomShipperDrawerContent);
