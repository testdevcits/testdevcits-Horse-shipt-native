import React, { lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { AppHeader, AppText, ProfileSkeleton } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import styles from './styles.shipperprofile';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import useShipperProfile from './useShipperProfile';
import ShipperProfileHeader from './ShipperProfileHeader';
import FleetNavigationCard from './FleetNavigationCard';
import PaymentMembershipCard from './PaymentMembershipCard';

const ConfirmationModal = lazy(
  () =>
    import(
      '../../../../../components/common/ConfirmationModal/ConfirmationModal'
    ),
);
const ConnectBankModal = lazy(
  () => import('../../home/components/ConnectBankModal'),
);

const ShipperProfileScreen = ({ navigation }: any) => {
  const {
    user,
    profileData,
    loading,
    refreshing,
    bannerUploading,
    profileUploading,
    bannerUrl,
    avatarUrl,
    isLogoutModalVisible,
    setIsLogoutModalVisible,
    isLoggingOut,
    isBankModalVisible,
    setIsBankModalVisible,
    handleLogout,
    handleConfirmLogout,
    handleUploadBannerImage,
    handleUploadProfileImage,
    onRefresh,
    ratingVal,
    shipmentCount,
    isStripeConnected,
    setProfileData,
  } = useShipperProfile();

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="Profile" showProfileImage={false} />
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" showProfileImage={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* HEADER SECTION (BANNER, AVATAR, USER INFO & STATS) */}
        <ShipperProfileHeader
          user={user}
          profileData={profileData}
          bannerUrl={bannerUrl}
          avatarUrl={avatarUrl}
          bannerUploading={bannerUploading}
          profileUploading={profileUploading}
          ratingVal={ratingVal}
          shipmentCount={shipmentCount}
          onUploadBannerImage={handleUploadBannerImage}
          onUploadProfileImage={handleUploadProfileImage}
        />

        <View style={{ height: 20 }} />

        {/* SECTION 1: ACCOUNT & FLEET */}
        <FleetNavigationCard
          navigation={navigation}
          profileData={profileData}
          user={user}
          setProfileData={setProfileData}
        />

        {/* SECTION 2: PAYMENTS & MEMBERSHIP */}
        <PaymentMembershipCard
          navigation={navigation}
          isStripeConnected={isStripeConnected}
        />

        {/* SECTION 3: REVIEWS & FEEDBACK */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Reviews & Feedback</AppText>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() =>
                navigation.navigate('ShipperReviews', {
                  reviews: profileData?.reviews || [],
                  profileData,
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon
                  name="MessageSquare"
                  size={18}
                  color={COLORS.saddleBrown}
                />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Customer Reviews</AppText>
                <AppText style={styles.menuItemSub}>
                  Ratings & feedback from horse owners
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: PREFERENCES & LEGAL */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Preferences & Settings</AppText>
          <View style={styles.menuCard}>
            {/* Notification Preferences */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('ShipperNotificationSettings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Bell" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Notification Preferences
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Manage Email & SMS alerts
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Account Settings */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="UserCog" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Account Settings</AppText>
                <AppText style={styles.menuItemSub}>
                  Security & general preferences
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon
                  name="ShieldCheck"
                  size={18}
                  color={COLORS.saddleBrown}
                />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Privacy Policy</AppText>
                <AppText style={styles.menuItemSub}>
                  Read how we safeguard your data
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigation.navigate('TermsAndConditions')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="FileText" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Terms & Conditions
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Terms of service agreement
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 5: ACCOUNT ACTION LOGOUT */}
        <View style={styles.menuSection}>
          <View style={[styles.menuCard, styles.logoutMenuCard]}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: COLORS.redLight },
                ]}
              >
                <AppIcon
                  name="LogOut"
                  size={18}
                  color={COLORS.redPrimary || COLORS.error}
                />
              </View>
              <View style={styles.menuContent}>
                <AppText
                  style={[styles.menuItemTitle, styles.logoutMenuItemTitle]}
                >
                  Logout Account
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Sign out of your shipper account
                </AppText>
              </View>
              <AppIcon
                name="ChevronRight"
                size={18}
                color={COLORS.redPrimary || COLORS.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleConfirmLogout}
          title="Logout Account"
          description="Are you sure you want to log out of your shipper account?"
          confirmText="Logout"
          cancelText="Cancel"
          isLoading={isLoggingOut}
          type="danger"
        />
      </Suspense>

      <Suspense fallback={null}>
        <ConnectBankModal
          isVisible={isBankModalVisible}
          onClose={() => setIsBankModalVisible(false)}
          navigation={navigation}
        />
      </Suspense>
    </View>
  );
};

export default ShipperProfileScreen;
