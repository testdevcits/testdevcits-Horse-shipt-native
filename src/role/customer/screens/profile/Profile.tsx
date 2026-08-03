

import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { MessageCircle, PencilLine, Star, User, X } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import { useProfile } from './useProfile';
import {
  AppHeader,
  AppLoader,
  EmptyState,
  ReviewCard,
} from '../../../../components';
import styles from './style.profile';
import NotificationSettings from '../notificationsettings/NotificationSettings';
import Payments from '../payments/Payments';

const Profile = ({ navigation }: any) => {
  const {
    profile,
    loading,
    isUpdating,
    updateProfile,
    uploading,
    uploadAvatar,
  } = useProfile();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
    if (res.success) {
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

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Profile Details" />
      <AppLoader visible={loading || isUpdating} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Profile', 'Notifications', 'Payments'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
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
              {/* Profile Image Logic - Handles nested .url from your JSON */}
              {profile?.profileImage?.url ? (
                <Image
                  source={{ uri: profile.profileImage.url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <User size={40} color={COLORS.grey400} />
                </View>
              )}

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
              disabled={uploading}
              activeOpacity={0.8}
            >
              {uploading ? (
                <Text style={styles.editPictureText}>Processing...</Text>
              ) : (
                <>
                  <PencilLine size={16} color={COLORS.textPrimary} />
                  <Text style={styles.editPictureText}>Edit picture</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Stats */}
          {/* <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>10</Text>
              <Text style={styles.statLabel}>Shipment</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.statNumber}>5.0 </Text>
                <Star size={18} color="#EAB308" fill="#EAB308" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View> */}

          {/* Basic Info */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Basic Info</Text>
              <TouchableOpacity
                style={styles.editIconBtn}
                onPress={() => setIsEditModalVisible(true)}
              >
                <PencilLine size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoList}>
              <InfoRow
                label="Name"
                value={`${profile?.firstName} ${profile?.lastName}`}
              />
              <InfoRow label="Email" value={profile?.email || ''} />
              <InfoRow label="Phone" value={profile?.phone || ''} isLast />
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === 'Notifications' && <NotificationSettings />}
      {activeTab === 'Payments' && <Payments />}

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>First Name</Text>
              <TextInput
                style={localStyles.input}
                value={formData.firstName}
                onChangeText={t => setFormData({ ...formData, firstName: t })}
              />

              <Text style={localStyles.inputLabel}>Last Name</Text>
              <TextInput
                style={localStyles.input}
                value={formData.lastName}
                onChangeText={t => setFormData({ ...formData, lastName: t })}
              />

              <Text style={localStyles.inputLabel}>Phone</Text>
              <TextInput
                style={localStyles.input}
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={t => setFormData({ ...formData, phone: t })}
              />
            </View>

            <TouchableOpacity style={localStyles.saveBtn} onPress={handleSave}>
              <Text style={localStyles.saveBtnText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoRow = ({ label, value, isLast }: any) => (
  <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
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
    backgroundColor: COLORS.goldPrimary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: FONT_SIZE.sm },
});

export default Profile;
