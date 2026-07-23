import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PencilLine, Star, User } from 'lucide-react-native'; // Lucide icons
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../constants';
import { useProfile } from './useProfile';
import { AppHeader } from '../../../../components';

const Profile = () => {
  const { profile, loading, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState('Profile');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Error loading profile. Please try again.</Text>
        <TouchableOpacity onPress={refetch}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      {/* Top Tabs */}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.imageWrapper}>
            {profile.profileImage?.url ? (
              <Image
                source={{ uri: profile.profileImage.url }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <User size={50} color={COLORS.grey400} />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editPictureBtn}>
            <PencilLine size={16} color={COLORS.textPrimary} />
            <Text style={styles.editPictureText}>Edit picture</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
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

        {/* Basic Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Basic Info</Text>
            <TouchableOpacity style={styles.editIconBtn}>
              <PencilLine size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <InfoRow
              label="Name"
              value={`${profile.firstName} ${profile.lastName}`}
            />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phone} isLast />
          </View>
        </View>

        {/* Reviews Section Title */}
        <Text
          style={[
            styles.cardTitle,
            { marginTop: SPACING.xl, marginBottom: SPACING.md },
          ]}
        >
          Reviews received
        </Text>

        {/* Horizontal Reviews */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reviewList}
        >
          <ReviewCard />
          <ReviewCard />
        </ScrollView>

        <TouchableOpacity style={styles.showMoreBtn}>
          <Text style={styles.showMoreText}>Show more reviews</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Internal components
const InfoRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ReviewCard = () => (
  <View style={styles.reviewCard}>
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} color="#EAB308" fill="#EAB308" />
      ))}
    </View>
    <Text style={styles.reviewContent}>
      Always good to work with Mark, a great customer.
    </Text>
    <View style={styles.reviewerContainer}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/100?u=mark' }}
        style={styles.reviewerImage}
      />
      <View>
        <Text style={styles.reviewerName}>Mark</Text>
        <Text style={styles.reviewDate}>11/28/2023</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.goldPrimary },
  tabText: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  activeTabText: { color: COLORS.goldPrimary, fontFamily: FONTS.semiBold },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: SPACING.xl },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: COLORS.grey100,
  },
  avatar: { width: '100%', height: '100%' },
  placeholderAvatar: { justifyContent: 'center', alignItems: 'center' },
  editPictureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  editPictureText: {
    marginLeft: 5,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  statsCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    height: '80%',
    alignSelf: 'center',
  },
  infoCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  editIconBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.grey50,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  infoList: { marginTop: SPACING.sm },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grey200,
  },
  infoLabel: {
    width: 70,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  infoValue: { flex: 1, color: COLORS.textPrimary, fontFamily: FONTS.medium },
  reviewList: { flexDirection: 'row' },
  reviewCard: {
    width: 250,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
  },
  starRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  reviewContent: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
  },
  reviewerContainer: { flexDirection: 'row', alignItems: 'center' },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  reviewerName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  reviewDate: { fontSize: 10, color: COLORS.textSecondary },
  showMoreBtn: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showMoreText: { color: COLORS.textPrimary, fontFamily: FONTS.medium },
});

export default Profile;
