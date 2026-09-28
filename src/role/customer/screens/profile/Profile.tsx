import React, { useState, lazy, Suspense, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { COLORS } from '../../../../constants';
import { useProfile } from './useProfile';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { logoutUser } from '../../../../redux/slices/authSlice';
import {
  AppHeader,
  AppLoader,
  ProfileSkeleton,
} from '../../../../components';
import styles from './styles.profile';
import ProfileHeaderCard from './components/ProfileHeaderCard';
import ProfileMenuSection from './components/ProfileMenuSection';

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
        <ProfileHeaderCard
          bannerUri={bannerUri}
          isValidBanner={isValidBanner}
          avatarUri={avatarUri}
          isValidAvatar={isValidAvatar}
          uploading={uploading}
          picking={picking}
          fullName={fullName}
          userEmail={userEmail}
          userPhone={userPhone}
          onUploadAvatar={uploadAvatar}
          onOpenImageViewer={uri => {
            setImageViewerVisible(true);
            setSelectedImage(uri);
          }}
          onNavigateToShipments={() => navigateTo('Shipments')}
        />

        <View style={{ height: 12 }} />

        <ProfileMenuSection
          profile={profile}
          user={user}
          refetch={refetch}
          navigateTo={navigateTo}
          onLogout={handleLogout}
        />
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

export default Profile;
