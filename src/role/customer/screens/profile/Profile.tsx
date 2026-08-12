

import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,

  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { LogOut, PencilLine, User, X } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import { useProfile } from './useProfile';
import { useAppDispatch } from '../../../../hooks/redux';
import { logoutUser } from '../../../../redux/slices/authSlice';
import {
  AppHeader,
  AppLoader,
  AppText,
  ConfirmationModal,
  CountryCodePicker,
  COUNTRIES,

  Input,

} from '../../../../components';
import styles from './styles.profile';
import NotificationSettings from '../notificationsettings/NotificationSettings';
import Payments from '../payments/Payments';
import { useAppSelector } from '../../../../hooks/redux';

const Profile = ({ }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  console.log("user from profile screen", JSON.stringify(user, null, 2))


  const {
    profile,
    loading,
    isUpdating,
    updateProfile,
    uploading,
    uploadAvatar,
    picking
  } = useProfile();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  // Initialize form when modal opens
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName?.trim() || '',
        lastName: profile.lastName?.trim() || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, isEditModalVisible]);

  const handleSave = async () => {
    const res = await updateProfile(formData);
    if (res?.success) {
      setIsEditModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.message || 'Update failed',
      });
    }
  };

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

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Profile Details" showProfileImage={false} />
      <AppLoader visible={loading || isUpdating} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Profile', 'Notifications', 'Payments'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Profile' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.imageWrapper}>
              {/* Profile Image Logic - Safely extracts string URL */}
              {(() => {
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

                return isValidAvatar ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.placeholderAvatar]}>
                    <User size={40} color={COLORS.grey400} />
                  </View>
                );
              })()}

              {/* Loader Overlay: Shown only during upload */}
              {uploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator color={COLORS.white} size="small" />
                </View>
              )}
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={uploadAvatar}
              style={[styles.editPictureBtn, uploading && { opacity: 0.7 }]}
              disabled={uploading || picking}
              activeOpacity={0.8}
            >
              {uploading ? (
                <AppText style={styles.editPictureText}>Processing...</AppText>
              ) : (
                <>
                  <PencilLine size={16} color={COLORS.textPrimary} />
                  <AppText style={styles.editPictureText}>Edit picture</AppText>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Basic Info */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <AppText style={styles.cardTitle}>Basic Info</AppText>
              <TouchableOpacity
                style={styles.editIconBtn}
                onPress={() => setIsEditModalVisible(true)}
              >
                <PencilLine size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoList}>
              {
                profile?.firstName && profile?.lastName && <InfoRow
                  label="Name"
                  value={`${profile?.firstName} ${profile?.lastName}`}
                />
              }
              <InfoRow label="Email" value={profile?.email || 'Not Available'} />
              {
                profile?.phone && <InfoRow label="Phone" value={profile?.phone} isLast />
              }
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={localStyles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={18} color={COLORS.error} />
            <AppText style={localStyles.logoutBtnText}>Logout</AppText>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'Notifications' && <NotificationSettings />}
      {activeTab === 'Payments' && <Payments />}

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <AppText style={localStyles.modalTitle}>Edit Profile</AppText>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: SPACING.md }}>
              <Input
                label="First Name"
                value={formData?.firstName}
                onChangeText={t => setFormData({ ...formData, firstName: t })}
              />

              <Input
                label="Last Name"
                value={formData?.lastName}
                onChangeText={t => setFormData({ ...formData, lastName: t })}
              />

              <Input
                label="Phone"
                value={formData?.phone}
                keyboardType="phone-pad"
                leftIcon={
                  <CountryCodePicker
                    selectedCountry={selectedCountry}
                    onSelectCountry={c => setSelectedCountry(c)}
                    showBorder={true}
                  />
                }
                onChangeText={t => setFormData({ ...formData, phone: t })}
              />
            </View>

            <TouchableOpacity style={localStyles.saveBtn} onPress={handleSave}>
              <AppText style={localStyles.saveBtnText}>Update Profile</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
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
    </View>
  );
};

const InfoRow = ({ label, value, isLast }: any) => (
  <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
    <AppText style={styles.infoLabel}>{label}</AppText>
    <AppText style={styles.infoValue}>{value}</AppText>
  </View>
);

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  inputGroup: { marginBottom: SPACING.lg },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontFamily: FONTS.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey200,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  logoutBtnText: {
    color: COLORS.error,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default Profile;
