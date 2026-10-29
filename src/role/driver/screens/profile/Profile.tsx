import React, { lazy, Suspense, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// Custom Design Systems
import { COLORS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import { useDriverMe } from '../../../../hooks/useDriverMe';
import styles from './styles.profile';
import DriverHeader from '../../../../components/common/DriverHeader/DriverHeader';
import { Button, ProfileSkeleton } from '../../../../components';
import { useAppDispatch } from '../../../../hooks/redux';
import { logoutUser } from '../../../../redux/slices/authSlice';
import AppIcon from '../../../../components/app_icon/AppIcon';
import CompletedShipments from './components/CompletedShipments';
import driverService from '../../../../api/services/driverService';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

const Profile = () => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const { driver, allShipments, loading, refresh } = useDriverMe();
  const dispatch = useAppDispatch();

  // Extract completed shipments count
  const completedShipments = allShipments.filter(
    shipment =>
      shipment?.tripStatus === 'delivered' ||
      shipment?.tripStatus === 'completed',
  );
  const completedCount = completedShipments?.length;

  // State to control your custom confirmation modal
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleProfilePhotoPress = async () => {
    if (isUploadingPhoto) return;

    setIsUploadingPhoto(true);
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      if (!image.path) {
        showErrorToast('Upload Error', 'Could not read the selected image.');
        return;
      }

      if (image.size && image.size > 1 * 1024 * 1024) {
        showErrorToast(
          'File Too Large',
          'Selected profile photo must be 1 MB or less.',
        );
        return;
      }

      const imageMime = image.mime || 'image/jpeg';
      const imageExtension = imageMime.split('/')[1] || 'jpeg';
      const formData = new FormData();
      formData.append('image', {
        uri:
          Platform.OS === 'android'
            ? image.path
            : image.path.replace('file://', ''),
        type: imageMime,
        name:
          image.filename || `driver-profile-${Date.now()}.${imageExtension}`,
      } as any);

      const response = await driverService.updateProfilePhoto(formData);
      if (!response?.success) {
        showErrorToast(
          'Upload Error',
          response?.message || 'Failed to update profile photo.',
        );
        return;
      }

      await refresh();
      showSuccessToast('Success', 'Profile photo updated successfully.');
    } catch (error: any) {
      if (
        error?.message !== 'User cancelled image selection' &&
        error?.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Driver profile photo upload error:', error);
        showErrorToast(
          'Upload Error',
          error?.message || 'Failed to update profile photo.',
        );
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalVisible(false); // 1. Close UI Modal

    try {
      // 2. Dispatch the Thunk
      // This automatically clears AsyncStorage + Sets Redux User/Token to null
      await dispatch(logoutUser()).unwrap();

      // SUCCESS:
      // You don't need navigation.reset()!
      // AppNavigation.tsx (Root Navigator) will see that 'token' is now null
      // and will automatically unmount the Tabs and mount the Login screen.
    } catch (error) {
      console.error('Manual logout failed:', error);
    }
  };

  if (loading && !driver) {
    return <ProfileSkeleton />;
  }

  // Fallback monogram if driver profile image does not exist
  const firstLetter = driver?.name
    ? driver?.name?.charAt(0)?.toUpperCase()
    : 'D';

  return (
    <View style={styles.safeArea}>
      {/* 1. Global Header Component rendered at the top of the screen */}
      <DriverHeader
        name={driver?.name || 'Driver'}
        statusText={driver?.driverStatus || 'Not Available'}
        profileImageUrl={driver?.profileImage?.url}
        isOnline={driver?.isActive !== false}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Header Card */}
        <View style={styles.mainCard}>
          {/* Avatar Area */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handleProfilePhotoPress}
            disabled={isUploadingPhoto}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            {driver?.profileImage?.url ? (
              <Image
                source={{ uri: driver.profileImage.url }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.monogramBox}>
                <AppText style={styles.monogramText}>{firstLetter}</AppText>
              </View>
            )}
            {isUploadingPhoto ? (
              <View style={styles.avatarUploadingOverlay}>
                <ActivityIndicator color={COLORS.white} />
              </View>
            ) : (
              <View style={styles.avatarCameraBadge}>
                <AppIcon name="Camera" size={14} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* Driver Metadata */}
          <AppText style={styles.driverName}>
            {driver?.name || 'Not Available'}
          </AppText>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <AppText style={styles.statusText}>
              {driver?.driverStatus
                ? driver?.driverStatus
                    ?.replace(/([A-Z])/g, ' $1')
                    ?.toUpperCase()
                : 'ON TRIP'}
            </AppText>
          </View>

          {/* Side-by-Side Statistics Block */}
          <View style={styles.statsRow}>
            {/* Completed stats box */}
            <View style={styles.completedBox}>
              <AppText style={styles.statLabel}>COMPLETED</AppText>
              <AppText style={styles.statValue}>{completedCount}</AppText>
            </View>

            {/* Account active stats box */}
            <View
              style={[
                styles.accountBox,
                driver?.isActive === false && styles.accountBoxInactive,
              ]}
            >
              <AppText
                style={[
                  styles.statLabel,
                  {
                    color:
                      driver?.isActive === false
                        ? COLORS.textSecondary
                        : COLORS.greenPrimary,
                  },
                ]}
              >
                ACCOUNT
              </AppText>
              <AppText
                style={[
                  styles.statValue,
                  {
                    color:
                      driver?.isActive === false
                        ? COLORS.textSecondary
                        : COLORS.greenPrimary,
                  },
                ]}
              >
                {driver?.isActive !== false ? 'Active' : 'Inactive'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <AppText style={styles.detailsHeaderTitle}>
              Personal Details
            </AppText>
          </View>
          <View style={styles.detailsBody}>
            {/* Email field */}
            <View style={styles.detailRow}>
              <View style={styles.detailIconTile}>
                <AppIcon name={'Mail'} size={16} color={COLORS.primary} />
              </View>
              <View>
                <AppText style={styles.detailLabel}>EMAIL</AppText>
                <AppText style={styles.detailValue}>
                  {driver?.email || 'Not Available'}
                </AppText>
              </View>
            </View>

            {/* Phone field */}
            <View style={styles.detailRow}>
              <View style={styles.detailIconTile}>
                <AppIcon name={'Phone'} size={16} color={COLORS.primary} />
              </View>
              <View>
                <AppText style={styles.detailLabel}>PHONE</AppText>
                <AppText style={styles.detailValue}>
                  {driver?.phone || 'N/A'}
                </AppText>
              </View>
            </View>

            {/* License field */}
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <View style={styles.detailIconTile}>
                <AppIcon name={'FileText'} size={16} color={COLORS.primary} />
              </View>
              <View>
                <AppText style={styles.detailLabel}>LICENSE</AppText>
                <AppText style={styles.detailValue}>
                  {driver?.licenseNumber || 'N/A'}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Completed Shipments Section */}
        <CompletedShipments
          completedShipments={completedShipments}
          completedCount={completedCount}
        />

        {/* Action Logout Button */}

        <Button
          buttonStyle={styles.logoutBtn}
          leftIcon={
            <AppIcon
              name={'LogOut'}
              size={18}
              color={COLORS.white}
              style={styles.logoutIcon}
            />
          }
          title="Logout"
          onPress={() => setIsLogoutModalVisible(!isLogoutModalVisible)}
        />
      </ScrollView>

      {/* 3. Integrated Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={handleLogoutConfirm}
          title="Log out of your account?"
          description="You will need to sign back in with your credentials to access your profile and saved settings."
          confirmText="Logout"
          cancelText="Cancel"
          type="danger" // Applies the red 'danger' layout styling from your stylesheet
        />
      </Suspense>
    </View>
  );
};

export default Profile;
