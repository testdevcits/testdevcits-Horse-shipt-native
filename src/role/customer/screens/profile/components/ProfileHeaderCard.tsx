import React, { memo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.profile';

interface ProfileHeaderCardProps {
  bannerUri: string | null;
  isValidBanner: boolean;
  avatarUri: string | null;
  isValidAvatar: boolean;
  uploading: boolean;
  picking: boolean;
  fullName: string;
  userEmail: string;
  userPhone: string;
  onUploadAvatar: () => void;
  onOpenImageViewer: (uri: string) => void;
  onNavigateToShipments: () => void;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  bannerUri,
  isValidBanner,
  avatarUri,
  isValidAvatar,
  uploading,
  picking,
  fullName,
  userEmail,
  userPhone,
  onUploadAvatar,
  onOpenImageViewer,
  onNavigateToShipments,
}) => {
  return (
    <>
      {/* TOP SECTION: BANNER IMAGE */}
      <View style={styles.bannerWrapper}>
        {isValidBanner && bannerUri ? (
          <Image
            source={{ uri: bannerUri }}
            style={styles.bannerImg}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder} />
        )}
      </View>

      {/* AVATAR & USER PROFILE INFO */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onUploadAvatar}
          disabled={uploading || picking}
          activeOpacity={0.85}
        >
          <View style={styles.avatarCircleWrapper}>
            {isValidAvatar && avatarUri ? (
              <Pressable onPress={() => onOpenImageViewer(avatarUri)}>
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              </Pressable>
            ) : (
              <View style={[styles.avatarImg, styles.placeholderAvatar]}>
                <AppIcon name="User" size={42} color={COLORS.grey400} />
              </View>
            )}

            {/* Uploading Overlay */}
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color={COLORS.white} size="small" />
              </View>
            )}
          </View>

          {/* Floating Camera Badge */}
          <View style={styles.avatarCameraBadge}>
            {uploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <AppIcon name="Camera" size={15} color={COLORS.white} />
            )}
          </View>
        </TouchableOpacity>

        {/* User Details */}
        <View style={styles.profileHeaderInfo}>
          <AppText style={styles.profileName}>{fullName}</AppText>

          <View style={styles.profileContactRow}>
            <AppIcon name="Mail" size={13} color={COLORS.textSecondary} />
            <AppText style={styles.profileContactText}>{userEmail}</AppText>

            {userPhone ? (
              <>
                <AppText style={{ color: COLORS.grey400 }}>•</AppText>
                <AppIcon name="Phone" size={13} color={COLORS.textSecondary} />
                <AppText style={styles.profileContactText}>{userPhone}</AppText>
              </>
            ) : null}
          </View>

          <View style={styles.verifiedBadge}>
            <AppIcon name="ShieldCheck" size={14} color={COLORS.saddleBrown} />
            <AppText style={styles.verifiedBadgeText}>
              VERIFIED CUSTOMER
            </AppText>
          </View>
        </View>
      </View>

      {/* QUICK STATS BAR */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <View style={styles.statIconBox}>
            <AppIcon name="Shield" size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.statVal}>Active</AppText>
          <AppText style={styles.statSub}>Account Status</AppText>
        </View>

        <View style={styles.statDivider} />

        <TouchableOpacity
          style={styles.statCol}
          onPress={onNavigateToShipments}
          activeOpacity={0.7}
        >
          <View style={styles.statIconBox}>
            <AppIcon name="Truck" size={16} color={COLORS.saddleBrown} />
          </View>
          <AppText style={styles.statVal}>Shipments</AppText>
          <AppText style={styles.statSub}>Bookings</AppText>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <View style={styles.statIconBox}>
            <AppIcon
              name="Star"
              size={16}
              color={COLORS.warning}
              fill={COLORS.warning}
            />
          </View>
          <AppText style={styles.statVal}>Member</AppText>
          <AppText style={styles.statSub}>Verified Role</AppText>
        </View>
      </View>
    </>
  );
};

export default memo(ProfileHeaderCard);
