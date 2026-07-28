// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { MessageCircle, PencilLine, Star, User } from 'lucide-react-native'; // Lucide icons
// import {
//   COLORS,
//   FONT_SIZE,
//   FONTS,
//   RADIUS,
//   SPACING,
// } from '../../../../constants';
// import { useProfile } from './useProfile';
// import {
//   AppHeader,
//   AppLoader,
//   EmptyState,
//   ReviewCard,
// } from '../../../../components';
// import NotificationSettings from '../notificationsettings/NotificationSettings';
// import Payments from '../payments/Payments';
// import { useReviews } from '../reviews/useReviews';
// import styles from './style.profile';

// const Profile = ({ navigation }) => {
//   const { profile, loading, refetch } = useProfile();
//   const [activeTab, setActiveTab] = useState('Profile');
//   const { reviews, loading: reviewsLOading, fetchReviews } = useReviews();

//   // if (loading) {
//   //   return <AppLoader visible={loading} />;
//   // }

//   if (!profile && !loading) {
//     return (
//       <View style={styles.centered}>
//         <Text>Error loading profile. Please try again.</Text>
//         <TouchableOpacity onPress={refetch}>
//           <Text>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <AppHeader showBack={true} title='Profile Details' />
//       <AppLoader visible={loading} />
//       {/* Top Tabs */}
//       <View style={styles.tabContainer}>
//         {['Profile', 'Notifications', 'Payments'].map(tab => (
//           <TouchableOpacity
//             key={tab}
//             onPress={() => setActiveTab(tab)}
//             style={[styles.tab, activeTab === tab && styles.activeTab]}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === tab && styles.activeTabText,
//               ]}
//             >
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       {activeTab === 'Profile' && (
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* Avatar Section */}
//           <View style={styles.avatarSection}>
//             <View style={styles.imageWrapper}>
//               {profile?.profileImage?.url ? (
//                 <Image
//                   source={{ uri: profile?.profileImage?.url }}
//                   style={styles.avatar}
//                 />
//               ) : (
//                 <View style={[styles.avatar, styles.placeholderAvatar]}>
//                   <User size={50} color={COLORS.grey400} />
//                 </View>
//               )}
//             </View>
//             <TouchableOpacity style={styles.editPictureBtn}>
//               <PencilLine size={16} color={COLORS.textPrimary} />
//               <Text style={styles.editPictureText}>Edit picture</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Stats Card */}
//           <View style={styles.statsCard}>
//             <View style={styles.statBox}>
//               <Text style={styles.statNumber}>10</Text>
//               <Text style={styles.statLabel}>Shipment</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statBox}>
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Text style={styles.statNumber}>5.0 </Text>
//                 <Star size={18} color="#EAB308" fill="#EAB308" />
//               </View>
//               <Text style={styles.statLabel}>Rating</Text>
//             </View>
//           </View>

//           {/* Basic Info Section */}
//           <View style={styles.infoCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>Basic Info</Text>
//               <TouchableOpacity style={styles.editIconBtn}>
//                 <PencilLine size={18} color={COLORS.textPrimary} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.infoList}>
//               <InfoRow
//                 label="Name"
//                 value={`${profile?.firstName} ${profile?.lastName}`}
//               />
//               <InfoRow label="Email" value={profile?.email} />
//               <InfoRow label="Phone" value={profile?.phone} isLast />
//             </View>
//           </View>

//           {/* Reviews Section Title */}
//           <Text
//             style={[
//               styles.cardTitle,
//               { marginTop: SPACING.xl, marginBottom: SPACING.md },
//             ]}
//           >
//             Reviews received
//           </Text>

//           {/* Horizontal Reviews */}
//           <FlatList
//             data={reviews}
//             horizontal={true}
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={item => item._id}
//             renderItem={({ item }) => <ReviewCard item={item} />}
//             contentContainerStyle={{ padding: SPACING.lg }}
//             refreshControl={
//               <RefreshControl
//                 refreshing={loading}
//                 onRefresh={fetchReviews}
//                 tintColor={COLORS.goldPrimary}
//               />
//             }
//             ListEmptyComponent={
//               <EmptyState
//                 icon={MessageCircle}
//                 title="No Reviews Yet"
//                 message="Your shipment feedback from shippers will appear here."
//               />
//             }
//           />

//           <TouchableOpacity
//             activeOpacity={1}
//             onPress={() => navigation.navigate('ReviewsScreen')}
//             style={styles.showMoreBtn}
//           >
//             <Text style={styles.showMoreText}>Show more reviews</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
//       {activeTab === 'Notifications' && <NotificationSettings />}
//       {activeTab === 'Payments' && <Payments />}
//     </View>
//   );
// };

// // Internal components
// const InfoRow = ({
//   label,
//   value,
//   isLast,
// }: {
//   label: string;
//   value: string;
//   isLast?: boolean;
// }) => (
//   <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
//     <Text style={styles.infoLabel}>{label}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

// export default Profile;

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
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import { MessageCircle, PencilLine, Star, User, X } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../../constants';
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
  const { profile, loading, isUpdating, updateProfile } = useProfile();
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
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', res.message || 'Update failed');
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
              {profile?.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: COLORS.grey200,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <User size={50} color={COLORS.grey400} />
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.editPictureBtn}>
              <PencilLine size={16} color={COLORS.textPrimary} />
              <Text style={styles.editPictureText}>Edit picture</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
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
          </View>

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
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  inputGroup: { marginBottom: SPACING.xl },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey200,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
  },
  saveBtn: {
    backgroundColor: COLORS.goldPrimary,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 16 },
});

export default Profile;
