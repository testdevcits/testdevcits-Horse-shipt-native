import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Pencil, Star, Camera } from 'lucide-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import { AppHeader, AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import styles from './styles.shipperprofile';

// Import modular tab components
import ProfileTab from './tabs/ProfileTab';
import ShipmentTab from './tabs/ShipmentTab';
import PaymentsTab from './tabs/PaymentsTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import NotificationTab from './tabs/NotificationTab';
import EditProfileModal from './EditProfileModal';
import ConnectBankModal from '../home/ConnectBankModal';
import SubscriptionRequiredModal from '../../components/SubscriptionRequiredModal';
import useShipperSubscription from '../../../../hooks/useShipperSubscription';

type TabType = 'Profile' | 'Shipment' | 'Payments' | 'Subscription' | 'Notification';

const ShipperProfileScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth || {});
  const [activeTab, setActiveTab] = useState<TabType>('Profile');

  // Data states
  const [profileData, setProfileData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [billingHistoryData, setBillingHistoryData] = useState<any>(null);
  const [subscriptionStatusData, setSubscriptionStatusData] = useState<any>(null);



  console.log("======billingHistoryData========+++", billingHistoryData)
  const [settingsData, setSettingsData] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [billingFilter, setBillingFilter] = useState<'All' | 'Invoices' | 'Payments' | 'Payouts'>('All');

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
        });
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'banner.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
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
        setBannerUrl(res.bannerImage.url);
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
        });
        imagePath = image.path;
        imageMime = image.mime || 'image/jpeg';
        imageName = image.filename || 'profile.jpg';
      } else {
        const res = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
        if (res.didCancel || !res.assets || res.assets.length === 0) return;
        const asset = res.assets[0];
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
      if (res?.success && (res.profileImage?.url || res.profileImage)) {
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
      const [profRes, subRes, billRes, setRes, stripeRes, subStatusRes] = await Promise.all([
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

  const handleToggleNotification = async (key: string, channel: 'email' | 'sms') => {
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

  const ratingVal = Number(profileData?.rating ?? profileData?.averageRating ?? 0.0);
  const shipmentCount =
    profileData?.completedShipments ??
    profileData?.totalShipments ??
    profileData?.shipmentsCount ??
    profileData?.shipmentCount ??
    (Array.isArray(profileData?.shipments) ? profileData.shipments.length : 0);

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      {/* TOP HORIZONTAL SCROLLABLE TAB BAR */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {(['Profile', 'Shipment', 'Payments', 'Subscription', 'Notification'] as TabType[]).map(
            tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <AppText style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </AppText>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>
      </View>

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
        {/* ONLY SHOW BANNER, AVATAR, & STATS CARD IN PROFILE TAB */}
        {activeTab === 'Profile' && (
          <>
            {/* TOP SECTION: BANNER IMAGE */}
            <View style={styles.bannerWrapper}>
              <Image
                source={
                  bannerUrl || profileData?.bannerImage?.url
                    ? { uri: bannerUrl || profileData?.bannerImage?.url }
                    : imageIndex.Banner
                }
                style={styles.bannerImg}
                resizeMode="cover"
              />
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
                    <Camera size={14} color={COLORS.white} />
                    <AppText style={styles.editBannerText}>Edit banner</AppText>
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
                    <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
                  ) : (
                    <Image source={imageIndex.AccountIcon} style={styles.avatarImg} />
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
                    <Pencil size={16} color={COLORS.textPrimary} />
                    <AppText style={styles.editPicText}>Edit picture</AppText>
                  </>
                )}
              </TouchableOpacity>

              {/* COMMON STATS CARD CONTAINER */}
              {/* <View style={styles.statsCard}>
                <View style={styles.statCol}>
                  <AppText style={styles.statVal}>{shipmentCount}</AppText>
                  <AppText style={styles.statSub}>Shipment</AppText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCol}>
                  <View style={styles.ratingValRow}>
                    <AppText style={styles.statVal}>{ratingVal.toFixed(1)}</AppText>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 4 }} />
                  </View>
                  <AppText style={styles.statSub}>Rating</AppText>
                </View>
              </View> */}
            </View>

            {/* PROFILE TAB CONTENT */}
            <ProfileTab
              profileData={profileData}
              user={user}
              navigation={navigation}
              onEditProfile={() => setIsEditModalOpen(true)}
            />
          </>
        )}


        {activeTab === 'Shipment' && (
          <ShipmentTab navigation={navigation} />
        )}

        {activeTab === 'Payments' && (
          <PaymentsTab
            stripeStatus={stripeStatus}
            navigation={navigation}
            onRefreshStripeStatus={fetchAllProfileData}
          />
        )}

        {activeTab === 'Subscription' && (
          <SubscriptionTab
            subscriptionData={subscriptionData}
            billingHistoryData={billingHistoryData}
            subscriptionStatusData={subscriptionStatusData}
            billingFilter={billingFilter}
            setBillingFilter={setBillingFilter}
            onOpenSubscriptionModal={openSubModal}
          />
        )}

        {activeTab === 'Notification' && (
          <NotificationTab
            notifications={notifications}
            handleToggleNotification={handleToggleNotification}
          />
        )}
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        user={user}
        onSuccess={(updatedData: any) => {
          setProfileData((prev: any) => ({
            ...prev,
            ...updatedData,
          }));
        }}
      />

      <ConnectBankModal
        isVisible={isBankModalVisible}
        onClose={() => setIsBankModalVisible(false)}
        navigation={navigation}
      />

      <SubscriptionRequiredModal
        visible={isSubModalVisible}
        onClose={closeSubModal}
        shipperStatus={shipperStatus}
        subscriptionStatus={subscriptionStatus}
        plansData={plansData}
        onSubscriptionSuccess={refreshSubStatus}
      />
    </View>
  );
};

export default ShipperProfileScreen;
