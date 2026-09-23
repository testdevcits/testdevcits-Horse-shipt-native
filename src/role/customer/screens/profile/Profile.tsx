import React, { useState, lazy, Suspense, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../../../../constants';
import { useProfile } from './useProfile';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { logoutUser } from '../../../../redux/slices/authSlice';
import {
  AppHeader,
  AppLoader,
  AppText,
  ProfileSkeleton,
} from '../../../../components';
import styles from './styles.profile';
import AppIcon from '../../../../components/app_icon/AppIcon';

const Profile = ({ navigation }: any) => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const ImageViewer = lazy(
    () => import('../../../../components/common/ImageViewer/ImageViewer'),
  );

  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const {
    profile,
    loading,
    isUpdating,
    uploading,
    uploadAvatar,
    picking,
    refetch,
  } = useProfile();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader
          showBack={true}
          title="Profile Details"
          showProfileImage={false}
        />
        <ProfileSkeleton />
      </View>
    );
  }

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalVisible(false);
    }
  };

  // Safe navigation helper
  const navigateTo = (screenName: string, params?: any) => {
    if (navigation && typeof navigation.navigate === 'function') {
      try {
        const tabScreens = ['Horses', 'Shipments', 'Home', 'New', 'Chats'];
        if (tabScreens.includes(screenName)) {
          navigation.navigate('MainTabs', {
            screen: screenName,
            params: params,
          });
          return;
        }
        navigation.navigate(screenName, params);
      } catch (err) {
        console.warn(`Navigation error to ${screenName}:`, err);
      }
    }
  };

  // Extract avatar URL
  const rawAvatar = (user?.profileImage || profile?.profileImage) as any;
  const avatarUri =
    typeof rawAvatar === 'string'
      ? rawAvatar
      : rawAvatar?.url || rawAvatar?.uri;
  const isValidAvatar =
    avatarUri &&
    typeof avatarUri === 'string' &&
    avatarUri.trim() !== '' &&
    avatarUri !== '/default-avatar.png' &&
    avatarUri !== '/images/default_profile.png';

  // Extract banner URL if available
  const rawBanner = ((profile as any)?.bannerImage ||
    (user as any)?.bannerImage) as any;
  const bannerUri =
    typeof rawBanner === 'string'
      ? rawBanner
      : rawBanner?.url || rawBanner?.uri;
  const isValidBanner =
    bannerUri &&
    typeof bannerUri === 'string' &&
    bannerUri.trim() !== '' &&
    !bannerUri.includes('default_banner');

  const fullName =
    `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() ||
    profile?.name ||
    user?.name ||
    'Customer User';

  const userEmail = profile?.email || user?.email || 'No email provided';
  const userPhone =
    profile?.phone || (user as any)?.phone || user?.phoneNumber || '';

  return (
    <View style={styles.container}>
      <AppHeader
        showBack={true}
        title="Profile Details"
        showProfileImage={false}
      />
      <AppLoader visible={loading || isUpdating} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* TOP SECTION: BANNER IMAGE */}
        <View style={styles.bannerWrapper}>
          {isValidBanner ? (
            <Image
              source={{ uri: bannerUri }}
              style={styles.bannerImg}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bannerPlaceholder}>
              {/* <View style={styles.bannerIconCircle}>
                <AppIcon name="User" size={22} color={COLORS.primary} />
              </View>
              <AppText style={styles.bannerPlaceholderText}>
                Customer Profile
              </AppText> */}
            </View>
          )}
        </View>

        {/* AVATAR & USER PROFILE INFO */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={uploadAvatar}
            disabled={uploading || picking}
            activeOpacity={0.85}
          >
            <View style={styles.avatarCircleWrapper}>
              {isValidAvatar ? (
                <Pressable
                  onPress={() => {
                    setImageViewerVisible(true);
                    setSelectedImage(avatarUri);
                  }}
                >
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                </Pressable>
              ) : (
                <View style={[styles.avatarImg, styles.placeholderAvatar]}>
                  <AppIcon name="User" size={42} color={COLORS.grey400} />
                </View>
              )}

              {/* Uploading Overlay */}
              {uploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator color={COLORS.white} size="small" />
                </View>
              )}
            </View>

            {/* Floating Camera Badge */}
            <View style={styles.avatarCameraBadge}>
              {uploading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <AppIcon name="Camera" size={15} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>

          {/* User Details */}
          <View style={styles.profileHeaderInfo}>
            <AppText style={styles.profileName}>{fullName}</AppText>

            <View style={styles.profileContactRow}>
              <AppIcon name="Mail" size={13} color={COLORS.textSecondary} />
              <AppText style={styles.profileContactText}>{userEmail}</AppText>

              {userPhone ? (
                <>
                  <AppText style={{ color: COLORS.grey400 }}>•</AppText>
                  <AppIcon
                    name="Phone"
                    size={13}
                    color={COLORS.textSecondary}
                  />
                  <AppText style={styles.profileContactText}>
                    {userPhone}
                  </AppText>
                </>
              ) : null}
            </View>

            <View style={styles.verifiedBadge}>
              <AppIcon
                name="ShieldCheck"
                size={14}
                color={COLORS.saddleBrown}
              />
              <AppText style={styles.verifiedBadgeText}>
                VERIFIED CUSTOMER
              </AppText>
            </View>
          </View>
        </View>

        {/* QUICK STATS BAR */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <View style={styles.statIconBox}>
              <AppIcon name="Shield" size={16} color={COLORS.primary} />
            </View>
            <AppText style={styles.statVal}>Active</AppText>
            <AppText style={styles.statSub}>Account Status</AppText>
          </View>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statCol}
            onPress={() => navigateTo('Shipments')}
            activeOpacity={0.7}
          >
            <View style={styles.statIconBox}>
              <AppIcon name="Truck" size={16} color={COLORS.saddleBrown} />
            </View>
            <AppText style={styles.statVal}>Shipments</AppText>
            <AppText style={styles.statSub}>Bookings</AppText>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <View style={styles.statIconBox}>
              <AppIcon
                name="Star"
                size={16}
                color={COLORS.warning}
                fill={COLORS.warning}
              />
            </View>
            <AppText style={styles.statVal}>Member</AppText>
            <AppText style={styles.statSub}>Verified Role</AppText>
          </View>
        </View>

        <View style={{ height: 12 }} />

        {/* SECTION 1: ACCOUNT & HORSES */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Account & Profile</AppText>
          <View style={styles.menuCard}>
            {/* Edit Personal Info - Navigates to dedicated EditProfile Screen */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigateTo('EditProfile', {
                  profileData: profile,
                  user,
                  onSuccess: () => {
                    refetch();
                  },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="User" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Personal Info</AppText>
                <AppText style={styles.menuItemSub}>
                  Name, phone number & contact email
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* My Horses */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('Horses')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Heart" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>My Horses</AppText>
                <AppText style={styles.menuItemSub}>
                  Registered horses, breeds & health records
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* My Shipments */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigateTo('Shipments')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Truck" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>My Shipments</AppText>
                <AppText style={styles.menuItemSub}>
                  Active transport bookings & shipment history
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: PAYMENTS & BILLING */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Payments & Transactions</AppText>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigateTo('Payments')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon
                  name="CreditCard"
                  size={18}
                  color={COLORS.saddleBrown}
                />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Payment History & Methods
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Transaction receipts & payment details
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 3: PREFERENCES & SUPPORT */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Preferences & Support</AppText>
          <View style={styles.menuCard}>
            {/* Notification Preferences */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('Settings')}
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
                  Manage Email, Push & SMS alerts
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Customer Reviews & Feedback */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('Reviews')}
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
                <AppText style={styles.menuItemTitle}>
                  Reviews & Feedback
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Ratings & feedback left for shippers
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Help Center */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('HelpCenter')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon
                  name="HelpCircle"
                  size={18}
                  color={COLORS.saddleBrown}
                />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Help & Support</AppText>
                <AppText style={styles.menuItemSub}>
                  FAQs, customer support & live chat
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('PrivacyPolicy')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Lock" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Privacy Policy</AppText>
                <AppText style={styles.menuItemSub}>
                  How your profile & location data is protected
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigateTo('TermsAndConditions')}
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
                  HorseShipt platform rules & agreement
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: ACCOUNT ACTION */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Account Actions</AppText>
          <View style={[styles.menuCard, localStyles.logoutCard]}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: COLORS.redLightBg || '#FEF2F2' },
                ]}
              >
                <AppIcon name="LogOut" size={18} color={COLORS.error} />
              </View>
              <View style={styles.menuContent}>
                <AppText
                  style={[styles.menuItemTitle, { color: COLORS.error }]}
                >
                  Log Out
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Sign out of your account
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleConfirmLogout}
          title="Log out of your account?"
          description="You will need to sign back in with your credentials to access your profile and saved settings."
          confirmText="Logout"
          cancelText="Cancel"
          type="danger"
          isLoading={isLoggingOut}
        />
      </Suspense>

      {/* Image Viewer */}
      <Suspense fallback={null}>
        <ImageViewer
          visible={imageViewerVisible}
          image={selectedImage}
          title="Profile image"
          onClose={() => setImageViewerVisible(false)}
        />
      </Suspense>
    </View>
  );
};

const localStyles = StyleSheet.create({
  logoutCard: {
    borderColor: COLORS.redBorder || '#FCA5A5',
    backgroundColor: COLORS.redLightBg || '#FEF2F2',
  },
});

export default Profile;
