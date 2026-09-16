import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../../hooks/redux';
import { updateUser, logoutUser } from '../../../../../redux/slices/authSlice';
import { AppHeader, AppText, ProfileSkeleton } from '../../../../../components';
import { COLORS, FONTS } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import imageIndex from '../../../../../assets/images/imageIndex';
import styles from './styles.shipperprofile';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileTab from '../tabs/profile/ProfileTab';
import ShipmentTab from '../tabs/shipments/ShipmentTab';
import PaymentsTab from '../tabs/payments/PaymentsTab';
import SubscriptionTab from '../tabs/subscription/SubscriptionTab';
import NotificationTab from '../tabs/notifications/NotificationTab';
import useShipperSubscription from '../../../../../hooks/useShipperSubscription';
import AppIcon from '../../../../../components/AppIcon';

const Tab = createMaterialTopTabNavigator();

const ShipperProfileScreen = ({ navigation }: any) => {
  const ConfirmationModal = lazy(
    () => import('../../../../../components/common/ConfirmationModal'),
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
  const [subscriptionStatusData, setSubscriptionStatusData] =
    useState<any>(null);

  const [settingsData, setSettingsData] = useState<any>(null);
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
          Toast.show({
            type: 'error',
            text1: 'File Too Large',
            text2: 'Selected banner image must be 1 MB or less.',
          });
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
          Toast.show({
            type: 'error',
            text1: 'File Too Large',
            text2: 'Selected banner image must be 1 MB or less.',
          });
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Banner image updated successfully.',
        });
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Banner Image Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update banner image.',
        });
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
          Toast.show({
            type: 'error',
            text1: 'File Too Large',
            text2: 'Selected profile image must be 1 MB or less.',
          });
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
          Toast.show({
            type: 'error',
            text1: 'File Too Large',
            text2: 'Selected profile image must be 1 MB or less.',
          });
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile image updated successfully.',
        });
      }
    } catch (err: any) {
      if (
        err?.message !== 'User cancelled image selection' &&
        err?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Update Profile Image Error:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update profile image.',
        });
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
          if (bUrl) {
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
        // console.log('Subscription Data:4444444444444444', subRes);
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

  const ratingVal = Number(
    profileData?.rating ?? profileData?.averageRating ?? 0.0,
  );
  const shipmentCount =
    profileData?.completedShipments ??
    profileData?.totalShipments ??
    profileData?.shipmentsCount ??
    profileData?.shipmentCount ??
    (Array.isArray(profileData?.shipments) ? profileData.shipments.length : 0);

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

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary,
            height: 3,
            borderRadius: 2,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: FONTS.bold,
            textTransform: 'none',
          },
          tabBarItemStyle: {
            width: 'auto',
            paddingHorizontal: 16,
          },
          tabBarStyle: {
            backgroundColor: COLORS.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.divider,
          },
          swipeEnabled: true,
        }}
      >
        <Tab.Screen name="Profile">
          {() => (
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
                  const displayBanner =
                    bannerUrl ||
                    (typeof profileData?.bannerImage === 'string'
                      ? profileData?.bannerImage
                      : profileData?.bannerImage?.url);
                  return displayBanner ? (
                    <Image
                      source={{ uri: displayBanner }}
                      style={styles.bannerImg}
                      resizeMode="cover"
                    />
                  ) : null;
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
                        Edit banner
                      </AppText>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* AVATAR & EDIT PICTURE */}
              <View style={styles.avatarSection}>
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

                <TouchableOpacity
                  style={styles.editPicBtn}
                  onPress={handleUploadProfileImage}
                  disabled={profileUploading}
                >
                  {profileUploading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <>
                      <AppIcon
                        name="Pencil"
                        size={16}
                        color={COLORS.textPrimary}
                      />
                      <AppText style={styles.editPicText}>Edit picture</AppText>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* PROFILE TAB CONTENT */}
              <ProfileTab
                profileData={profileData}
                user={user}
                navigation={navigation}
                onEditProfile={() =>
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
                onLogout={handleLogout}
              />
            </ScrollView>
          )}
        </Tab.Screen>

        <Tab.Screen name="Shipment">
          {() => (
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
              <ShipmentTab navigation={navigation} />
            </ScrollView>
          )}
        </Tab.Screen>

        <Tab.Screen name="Payments">
          {() => (
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
              <PaymentsTab
                stripeStatus={stripeStatus}
                navigation={navigation}
                onRefreshStripeStatus={fetchAllProfileData}
              />
            </ScrollView>
          )}
        </Tab.Screen>

        <Tab.Screen name="Subscription">
          {() => (
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
          )}
        </Tab.Screen>

        <Tab.Screen name="Notification">
          {() => (
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
              <NotificationTab
                notifications={notifications}
                handleToggleNotification={handleToggleNotification}
              />
            </ScrollView>
          )}
        </Tab.Screen>
      </Tab.Navigator>
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
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleConfirmLogout}
          title="Logout"
          description="Are you sure you want to log out?"
          confirmText="Logout"
          cancelText="Cancel"
          type="danger"
          isLoading={isLoggingOut}
        />
      </Suspense>
    </View>
  );
};

export default ShipperProfileScreen;
