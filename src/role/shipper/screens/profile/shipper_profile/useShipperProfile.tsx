import { useState, useEffect, useCallback, useRef } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../../hooks/redux';
import { updateUser, logoutUser } from '../../../../../redux/slices/authSlice';
import shipperService from '../../../../../api/services/shipperService';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';

export const useShipperProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth || {});

  // Ref lock to prevent multiple rapid taps opening duplicate picker dialogs
  const isPickingRef = useRef(false);

  // Modal states
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  // Data states
  const [profileData, setProfileData] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);

  // Loader & Image Uploading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  const handleUploadBannerImage = async () => {
    if (isPickingRef.current || bannerUploading) return;
    isPickingRef.current = true;
    setBannerUploading(true);

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
      isPickingRef.current = false;
      setBannerUploading(false);
    }
  };

  const handleUploadProfileImage = async () => {
    if (isPickingRef.current || profileUploading) return;
    isPickingRef.current = true;
    setProfileUploading(true);

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
      isPickingRef.current = false;
      setProfileUploading(false);
    }
  };

  const fetchAllProfileData = useCallback(async () => {
    try {
      const [profRes, stripeRes] = await Promise.all([
        shipperService.getProfile().catch(() => null),
        shipperService.getStripeStatus().catch(() => null),
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
      if (stripeRes) {
        setStripeStatus(stripeRes);
      }
    } catch (error) {
      console.error('Fetch Profile Data Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllProfileData();
  }, [fetchAllProfileData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllProfileData();
  }, [fetchAllProfileData]);

  const ratingVal = Number(
    profileData?.rating ?? profileData?.averageRating ?? 0.0,
  );
  const shipmentCount =
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

  return {
    user,
    profileData,
    stripeStatus,
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
    fetchAllProfileData,
    onRefresh,
    ratingVal,
    shipmentCount,
    isStripeConnected,
    setProfileData,
  };
};

export default useShipperProfile;
