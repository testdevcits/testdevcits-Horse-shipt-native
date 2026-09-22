import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../../hooks/redux';
import { updateUser, logoutUser } from '../../../../../redux/slices/authSlice';
import { AppHeader, AppText, ProfileSkeleton } from '../../../../../components';
import { COLORS, FONTS } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import imageIndex from '../../../../../assets/images/imageIndex';
import styles from './styles.shipperprofile';

import PaymentsTab from '../tabs/payments/PaymentsTab';
import SubscriptionTab from '../tabs/subscription/SubscriptionTab';
import NotificationTab from '../tabs/notifications/NotificationTab';
import useShipperSubscription from '../../../../../hooks/useShipperSubscription';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';

const ShipperProfileScreen = ({ navigation }: any) => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const ConnectBankModal = lazy(
    () => import('../../home/components/ConnectBankModal'),
  );
  const SubscriptionRequiredModal = lazy(
    () =>
      import(
        '../../../components/subscription_required_modal/SubscriptionRequiredModal'
      ),
  );

  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth || {});
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sub-modal states for Payments, Subscription, and Notifications
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

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

  // Data states
  const [profileData, setProfileData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [billingHistoryData, setBillingHistoryData] = useState<any>(null);
  const [subscriptionStatusData, setSubscriptionStatusData] = useState<any>(null);

  const [_settingsData, setSettingsData] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  const {
    shipperStatus,
    subscriptionStatus,
    plansData,
    isModalVisible: isSubModalVisible,
    openModal: openSubModal,
    closeModal: closeSubModal,
    refreshStatus: refreshSubStatus,
  } = useShipperSubscription();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [billingFilter, setBillingFilter] = useState<
    'All' | 'Invoices' | 'Payments' | 'Payouts'
  >('All');

  // Notification Checkbox Toggles State
  const [notifications, setNotifications] = useState<any>({
    quote: { email: true, sms: true },
    opportunity: { email: true, sms: true },
    message: { email: true, sms: true },
    question: { email: true, sms: true },
    review: { email: true, sms: true },
    shipment: { email: true, sms: true },
  });

  const handleUploadBannerImage = async () => {
    try {
      let imagePath = '';
      let imageMime = 'image/jpeg';
      let imageName = 'banner.jpg';

      const pickerModule: any = (ImagePicker as any)?.openPicker
        ? ImagePicker
        : (ImagePicker as any)?.default;

      if (pickerModule && typeof pickerModule.openPicker === 'function') {
        const image = await pickerModule.openPicker({
          width: 1200,
          height: 400,
          cropping: true,
          mediaType: 'photo',
          compressImageQuality: 0.8,
        });
        if (image?.size && image.size > 1 * 1024 * 1024) {
          showErrorToast(
            'File Too Large',
            'Selected banner image must be 1 MB or less.',
          );
          return;
        }
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'banner.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res?.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
        if (asset?.fileSize && asset.fileSize > 1 * 1024 * 1024) {
          showErrorToast(
            'File Too Large',
            'Selected banner image must be 1 MB or less.',
          );
          return;
        }
        imagePath = asset.uri || '';
        imageMime = asset.type || 'image/jpeg';
        imageName = asset.fileName || 'banner.jpg';
      }

      if (!imagePath) return;
      setBannerUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        type: imageMime,
        name: imageName,
      } as any);

      const res = await shipperService?.updateBannerImage?.(formData);
      if (res?.success && res.bannerImage?.url) {
        setBannerUrl(res?.bannerImage.url);
        showSuccessToast('Success', 'Banner image updated successfully.');
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Banner Image Error:', err);
        showErrorToast('Error', 'Failed to update banner image.');
      }
    } finally {
      setBannerUploading(false);
    }
  };

  const handleUploadProfileImage = async () => {
    try {
      let imagePath = '';
      let imageMime = 'image/jpeg';
      let imageName = 'profile.jpg';

      const pickerModule: any = (ImagePicker as any)?.openPicker
        ? ImagePicker
        : (ImagePicker as any)?.default;

      if (pickerModule && typeof pickerModule.openPicker === 'function') {
        const image = await pickerModule.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          mediaType: 'photo',
          compressImageQuality: 0.8,
        });
        if (image?.size && image.size > 1 * 1024 * 1024) {
          showErrorToast(
            'File Too Large',
            'Selected profile image must be 1 MB or less.',
          );
          return;
        }
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'profile.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res?.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
        if (asset?.fileSize && asset.fileSize > 1 * 1024 * 1024) {
          showErrorToast(
            'File Too Large',
            'Selected profile image must be 1 MB or less.',
          );
          return;
        }
        imagePath = asset.uri || '';
        imageMime = asset.type || 'image/jpeg';
        imageName = asset.fileName || 'profile.jpg';
      }

      if (!imagePath) return;
      setProfileUploading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        type: imageMime,
        name: imageName,
      } as any);

      const res = await shipperService?.updateProfileImage?.(formData);
      if (res?.success && (res?.profileImage?.url || res.profileImage)) {
        const newImg = res.profileImage;
        const newUrl = typeof newImg === 'string' ? newImg : newImg?.url;
        if (newUrl) {
          setAvatarUrl(newUrl);
        }
        dispatch(updateUser({ profileImage: newImg as any }));
        showSuccessToast('Success', 'Profile image updated successfully.');
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Profile Image Error:', err);
        showErrorToast('Error', 'Failed to update profile image.');
      }
    } finally {
      setProfileUploading(false);
    }
  };

  const fetchAllProfileData = async () => {
    try {
      const [profRes, subRes, billRes, setRes, stripeRes, subStatusRes] =
        await Promise.all([
          shipperService.getProfile().catch(() => null),
          shipperService.getSubscriptionPlan().catch(() => null),
          shipperService.getBillingHistory().catch(() => null),
          shipperService.getSettings().catch(() => null),
          shipperService.getStripeStatus().catch(() => null),
          shipperService.getSubscriptionStatus().catch(() => null),
        ]);

      if (profRes?.data) {
        setProfileData(profRes.data);
        if (profRes.data?.bannerImage) {
          const bUrl =
            typeof profRes.data?.bannerImage === 'string'
              ? profRes.data?.bannerImage
              : profRes.data?.bannerImage?.url;
          if (
            bUrl &&
            bUrl !== '/images/default_banner.png' &&
            bUrl !== '/default-banner.png' &&
            !bUrl.includes('default_banner') &&
            !bUrl.includes('default-banner')
          ) {
            setBannerUrl(bUrl);
          }
        }
        if (profRes.data?.profileImage) {
          const imgUrl =
            typeof profRes.data?.profileImage === 'string'
              ? profRes.data?.profileImage
              : profRes.data?.profileImage?.url;
          if (imgUrl) {
            setAvatarUrl(imgUrl);
          }
          dispatch(updateUser({ profileImage: profRes.data?.profileImage }));
        }
      }
      if (subRes?.data) {
        setSubscriptionData(subRes.data);
      }
      if (billRes) {
        setBillingHistoryData(billRes.data || billRes);
      }
      if (setRes?.data?.notifications) {
        setSettingsData(setRes.data);
        setNotifications(setRes.data?.notifications);
      }
      if (stripeRes) {
        setStripeStatus(stripeRes);
      }
      if (subStatusRes) {
        setSubscriptionStatusData(subStatusRes);
      }
    } catch (error) {
      console.error('Fetch Profile Data Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllProfileData();
  };

  const handleToggleNotification = async (
    key: string,
    channel: 'email' | 'sms',
  ) => {
    const updated = {
      ...notifications,
      [key]: {
        ...notifications[key],
        [channel]: !notifications[key]?.[channel],
      },
    };
    setNotifications(updated);

    try {
      await shipperService.updateNotifications(updated);
    } catch (e) {
      console.error('Update Notifications Error:', e);
    }
  };

  const _ratingVal = Number(
    profileData?.rating ?? profileData?.averageRating ?? 0.0,
  );
  const _shipmentCount =
    profileData?.completedShipments ??
    profileData?.totalShipments ??
    profileData?.shipmentsCount ??
    profileData?.shipmentCount ??
    (Array.isArray(profileData?.shipments) ? profileData.shipments.length : 0);

  const isStripeConnected = Boolean(
    stripeStatus?.verified ||
      stripeStatus?.chargesEnabled ||
      stripeStatus?.onboardingCompleted,
  );

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
        {/* TOP SECTION: BANNER IMAGE */}
        <View style={styles.bannerWrapper}>
          {(() => {
            const getBannerPath = () => {
              if (bannerUrl) return bannerUrl;
              if (typeof profileData?.bannerImage === 'string')
                return profileData?.bannerImage;
              if (profileData?.bannerImage?.url)
                return profileData?.bannerImage?.url;
              if (typeof user?.bannerImage === 'string')
                return user?.bannerImage;
              if (user?.bannerImage?.url) return user?.bannerImage?.url;
              return null;
            };

            const candidate = getBannerPath();
            const isValidBanner =
              candidate &&
              typeof candidate === 'string' &&
              candidate.trim() !== '' &&
              candidate !== 'null' &&
              candidate !== 'undefined' &&
              candidate !== '/images/default_banner.png' &&
              candidate !== '/default-banner.png' &&
              !candidate.includes('default_banner') &&
              !candidate.includes('default-banner');

            const displayBanner = isValidBanner ? candidate : null;

            return displayBanner ? (
              <Image
                source={{ uri: displayBanner }}
                style={styles.bannerImg}
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                style={styles.bannerPlaceholder}
                onPress={handleUploadBannerImage}
                disabled={bannerUploading}
                activeOpacity={0.7}
              >
                <View style={styles.bannerIconCircle}>
                  <AppIcon name="ImagePlus" size={22} color={COLORS.primary} />
                </View>
                <AppText style={styles.bannerPlaceholderText}>
                  Add Banner
                </AppText>
              </TouchableOpacity>
            );
          })()}

          <TouchableOpacity
            style={styles.editBannerBtn}
            onPress={handleUploadBannerImage}
            disabled={bannerUploading}
            activeOpacity={0.8}
          >
            {bannerUploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <AppIcon name="Camera" size={14} color={COLORS.white} />
                <AppText style={styles.editBannerText}>
                  {(() => {
                    const getBannerPath = () => {
                      if (bannerUrl) return bannerUrl;
                      if (typeof profileData?.bannerImage === 'string')
                        return profileData?.bannerImage;
                      if (profileData?.bannerImage?.url)
                        return profileData?.bannerImage?.url;
                      if (typeof user?.bannerImage === 'string')
                        return user?.bannerImage;
                      if (user?.bannerImage?.url)
                        return user?.bannerImage?.url;
                      return null;
                    };

                    const candidate = getBannerPath();
                    const isValidBanner =
                      candidate &&
                      typeof candidate === 'string' &&
                      candidate.trim() !== '' &&
                      candidate !== 'null' &&
                      candidate !== 'undefined' &&
                      candidate !== '/images/default_banner.png' &&
                      candidate !== '/default-banner.png' &&
                      !candidate.includes('default_banner') &&
                      !candidate.includes('default-banner');

                    return isValidBanner ? 'Edit banner' : 'Add banner';
                  })()}
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* AVATAR & USER PROFILE INFO */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleUploadProfileImage}
            disabled={profileUploading}
            activeOpacity={0.85}
          >
            <View style={styles.avatarCircleWrapper}>
              {(() => {
                const displayAvatar =
                  avatarUrl ||
                  (typeof profileData?.profileImage === 'string'
                    ? profileData?.profileImage
                    : profileData?.profileImage?.url) ||
                  (typeof user?.profileImage === 'string'
                    ? user.profileImage
                    : user?.profileImage?.url);
                const isValidAvatar =
                  displayAvatar &&
                  displayAvatar !== '/images/default_profile.png' &&
                  displayAvatar !== '/default-avatar.png';

                return isValidAvatar ? (
                  <Image
                    source={{ uri: displayAvatar }}
                    style={styles.avatarImg}
                  />
                ) : (
                  <Image
                    source={imageIndex.AccountIcon}
                    style={styles.avatarImg}
                  />
                );
              })()}
            </View>

            {/* Floating Camera Edit Badge */}
            <View style={styles.avatarCameraBadge}>
              {profileUploading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <AppIcon name="Camera" size={15} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>

          {/* User Details Box */}
          <View style={styles.profileHeaderInfo}>
            <AppText style={styles.profileName}>
              {profileData?.name || user?.name || 'Shipper User'}
            </AppText>

            <View style={styles.profileContactRow}>
              <AppIcon name="Mail" size={13} color={COLORS.textSecondary} />
              <AppText style={styles.profileContactText}>
                {profileData?.email || user?.email || 'No email provided'}
              </AppText>

              {(profileData?.mobile || user?.mobile) && (
                <>
                  <AppText style={{ color: COLORS.grey400 }}>•</AppText>
                  <AppIcon name="Phone" size={13} color={COLORS.textSecondary} />
                  <AppText style={styles.profileContactText}>
                    {profileData?.mobile || user?.mobile}
                  </AppText>
                </>
              )}
            </View>

            <View style={styles.verifiedBadge}>
              <AppIcon name="ShieldCheck" size={14} color={COLORS.saddleBrown} />
              <AppText style={styles.verifiedBadgeText}>
                VERIFIED SHIPPER
              </AppText>
            </View>
          </View>
        </View>

        {/* QUICK STATS BAR */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <View style={styles.statIconBox}>
              <AppIcon
                name="Star"
                size={16}
                color={COLORS.warning}
                fill={COLORS.warning}
              />
            </View>
            <AppText style={styles.statVal}>
              {_ratingVal > 0 ? _ratingVal.toFixed(1) : '5.0'}
            </AppText>
            <AppText style={styles.statSub}>Overall Rating</AppText>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <View style={styles.statIconBox}>
              <AppIcon name="Truck" size={16} color={COLORS.primary} />
            </View>
            <AppText style={styles.statVal}>{_shipmentCount}</AppText>
            <AppText style={styles.statSub}>Completed Loads</AppText>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <View style={styles.statIconBox}>
              <AppIcon name="ShieldCheck" size={16} color={COLORS.emeraldPrimary} />
            </View>
            <AppText
              style={[
                styles.statVal,
                { color: COLORS.emeraldPrimary, fontSize: 14 },
              ]}
            >
              Active
            </AppText>
            <AppText style={styles.statSub}>Shipper Status</AppText>
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* SECTION 1: ACCOUNT & FLEET */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Account & Fleet</AppText>
          <View style={styles.menuCard}>
            {/* Edit Personal Profile */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate('EditProfile', {
                  profileData,
                  user,
                  onSuccess: (updatedData: any) => {
                    setProfileData((prev: any) => ({
                      ...prev,
                      ...updatedData,
                    }));
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
                  Name, phone, bio & operating location
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Operating Service Areas */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('PreferredAreas')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="MapPin" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Service Coverage Areas
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Operating zones & bidding preferences
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Google Review Link */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('GoogleReview')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Star" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Google Review Link
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Connect your Google Business reviews
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* My Vehicles & Capacity */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('MyVehicles')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Truck" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  My Vehicles & Fleet
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Trucks, trailers & capacity management
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Truck Drivers */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigation.navigate('TruckDriver')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Users" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>Truck Drivers</AppText>
                <AppText style={styles.menuItemSub}>
                  Manage driver accounts & assignments
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: PAYMENTS & MEMBERSHIP */}
        <View style={styles.menuSection}>
          <AppText style={styles.sectionTitle}>Payments & Membership</AppText>
          <View style={styles.menuCard}>
            {/* Payout Account (Stripe) */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsPaymentsModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="CreditCard" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Payment Settings & Payouts
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Stripe payout account & bank setup
                </AppText>
              </View>
              <View style={styles.menuRightRow}>
                <View
                  style={[
                    styles.badgePill,
                    isStripeConnected && styles.badgePillConnected,
                  ]}
                >
                  <AppText
                    style={[
                      styles.badgeText,
                      isStripeConnected && styles.badgeTextConnected,
                    ]}
                  >
                    {isStripeConnected ? 'Connected' : 'Action Needed'}
                  </AppText>
                </View>
                <AppIcon
                  name="ChevronRight"
                  size={18}
                  color={COLORS.textLight}
                />
              </View>
            </TouchableOpacity>

            {/* Subscription & Billing */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsSubscriptionModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Sparkles" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Subscription & Billing
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Active plan, invoices & upgrade options
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Earnings History */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => navigation.navigate('Earnings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <AppIcon name="Wallet" size={18} color={COLORS.saddleBrown} />
              </View>
              <View style={styles.menuContent}>
                <AppText style={styles.menuItemTitle}>
                  Earnings & Payout Logs
                </AppText>
                <AppText style={styles.menuItemSub}>
                  Track total earnings & payout history
                </AppText>
              </View>
              <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>

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
              onPress={() => setIsNotificationsModalOpen(true)}
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
                <AppIcon name="ShieldCheck" size={18} color={COLORS.saddleBrown} />
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
                <AppText style={styles.menuItemTitle}>Terms & Conditions</AppText>
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
                  { backgroundColor: COLORS.redLight || '#FEE2E2' },
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

      {/* PAYMENTS MODAL */}
      <Modal
        visible={isPaymentsModalOpen}
        animationType="slide"
        onRequestClose={() => setIsPaymentsModalOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsPaymentsModalOpen(false)}
              activeOpacity={0.7}
            >
              <AppIcon name="X" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <AppText style={styles.modalTitle}>Payment Settings</AppText>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <PaymentsTab
              stripeStatus={stripeStatus}
              navigation={navigation}
              onRefreshStripeStatus={fetchAllProfileData}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* SUBSCRIPTION MODAL */}
      <Modal
        visible={isSubscriptionModalOpen}
        animationType="slide"
        onRequestClose={() => setIsSubscriptionModalOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsSubscriptionModalOpen(false)}
              activeOpacity={0.7}
            >
              <AppIcon name="X" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <AppText style={styles.modalTitle}>Subscription & Billing</AppText>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <SubscriptionTab
              subscriptionData={subscriptionData}
              billingHistoryData={billingHistoryData}
              subscriptionStatusData={subscriptionStatusData}
              billingFilter={billingFilter}
              setBillingFilter={setBillingFilter}
              onOpenSubscriptionModal={openSubModal}
              subsciptionPlans={subscriptionData?.plans || []}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* NOTIFICATION PREFERENCES MODAL */}
      <Modal
        visible={isNotificationsModalOpen}
        animationType="slide"
        onRequestClose={() => setIsNotificationsModalOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsNotificationsModalOpen(false)}
              activeOpacity={0.7}
            >
              <AppIcon name="X" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <AppText style={styles.modalTitle}>
              Notification Preferences
            </AppText>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <NotificationTab
              notifications={notifications}
              handleToggleNotification={handleToggleNotification}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

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

      <Suspense fallback={null}>
        <SubscriptionRequiredModal
          visible={isSubModalVisible}
          onClose={closeSubModal}
          shipperStatus={shipperStatus}
          subscriptionStatus={subscriptionStatus}
          plansData={plansData}
          onSubscriptionSuccess={refreshSubStatus}
        />
      </Suspense>
    </View>
  );
};

export default ShipperProfileScreen;
