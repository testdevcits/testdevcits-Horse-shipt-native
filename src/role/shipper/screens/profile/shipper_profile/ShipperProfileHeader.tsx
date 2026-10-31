import React, { memo } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';
import styles from './styles.shipperprofile';

interface ShipperProfileHeaderProps {
  user: any;
  profileData: any;
  bannerUrl: string | null;
  avatarUrl: string | null;
  bannerUploading: boolean;
  profileUploading: boolean;
  ratingVal: number;
  shipmentCount: number;
  onUploadBannerImage: () => void;
  onUploadProfileImage: () => void;
}

const ShipperProfileHeader: React.FC<ShipperProfileHeaderProps> = ({
  user,
  profileData,
  bannerUrl,
  avatarUrl,
  bannerUploading,
  profileUploading,
  ratingVal,
  shipmentCount,
  onUploadBannerImage,
  onUploadProfileImage,
}) => {
  const getBannerPath = () => {
    if (bannerUrl) return bannerUrl;
    if (typeof profileData?.bannerImage === 'string')
      return profileData?.bannerImage;
    if (profileData?.bannerImage?.url) return profileData?.bannerImage?.url;
    if (typeof user?.bannerImage === 'string') return user?.bannerImage;
    if (user?.bannerImage?.url) return user?.bannerImage?.url;
    return null;
  };

  const candidateBanner = getBannerPath();
  const isValidBanner =
    candidateBanner &&
    typeof candidateBanner === 'string' &&
    candidateBanner.trim() !== '' &&
    candidateBanner !== 'null' &&
    candidateBanner !== 'undefined' &&
    candidateBanner !== '/images/default_banner.png' &&
    candidateBanner !== '/default-banner.png' &&
    !candidateBanner.includes('default_banner') &&
    !candidateBanner.includes('default-banner');

  const displayBanner = isValidBanner ? candidateBanner : null;

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

  return (
    <>
      {/* TOP SECTION: BANNER IMAGE */}
      <View style={styles.bannerWrapper}>
        {displayBanner ? (
          <Image
            source={{ uri: displayBanner }}
            style={styles.bannerImg}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity
            style={styles.bannerPlaceholder}
            onPress={onUploadBannerImage}
            disabled={bannerUploading}
            activeOpacity={0.7}
          >
            <View style={styles.bannerIconCircle}>
              <AppIcon name="ImagePlus" size={22} color={COLORS.primary} />
            </View>
            <AppText style={styles.bannerPlaceholderText}>Add Banner</AppText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editBannerBtn}
          onPress={onUploadBannerImage}
          disabled={bannerUploading}
          activeOpacity={0.8}
        >
          {bannerUploading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <AppIcon name="Camera" size={14} color={COLORS.white} />
              <AppText style={styles.editBannerText}>
                {isValidBanner ? 'Edit banner' : 'Add banner'}
              </AppText>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* AVATAR & USER PROFILE INFO */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onUploadProfileImage}
          disabled={profileUploading}
          activeOpacity={0.85}
        >
          <View style={styles.avatarCircleWrapper}>
            {isValidAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
            ) : (
              <Image
                source={imageIndex?.AccountIcon}
                style={styles.avatarImg}
              />
            )}
          </View>

          {/* Floating Camera Edit Badge */}
          <View style={styles.avatarCameraBadge}>
            {profileUploading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <AppIcon name="Camera" size={15} color={COLORS.white} />
            )}
          </View>
        </TouchableOpacity>

        {/* User Details Box */}
        <View style={styles.profileHeaderInfo}>
          <AppText style={styles.profileName}>
            {profileData?.name || user?.name || 'Shipper User'}
          </AppText>

          <View style={styles.profileContactRow}>
            <AppIcon name="Mail" size={13} color={COLORS.textSecondary} />
            <AppText style={styles.profileContactText}>
              {profileData?.email || user?.email || 'No email provided'}
            </AppText>

            {(profileData?.mobile || user?.mobile) && (
              <>
                <AppText style={{ color: COLORS.grey400 }}>•</AppText>
                <AppIcon name="Phone" size={13} color={COLORS.textSecondary} />
                <AppText style={styles.profileContactText}>
                  {profileData?.mobile || user?.mobile}
                </AppText>
              </>
            )}
          </View>

          <View style={styles.verifiedBadge}>
            <AppIcon name="ShieldCheck" size={14} color={COLORS.saddleBrown} />
            <AppText style={styles.verifiedBadgeText}>VERIFIED SHIPPER</AppText>
          </View>
        </View>
      </View>

      {/* QUICK STATS BAR */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <View style={styles.statIconBox}>
            <AppIcon
              name="Star"
              size={16}
              color={COLORS.warning}
              fill={COLORS.warning}
            />
          </View>
          <AppText style={styles.statVal}>
            {ratingVal > 0 ? ratingVal.toFixed(1) : '5.0'}
          </AppText>
          <AppText style={styles.statSub}>Overall Rating</AppText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <View style={styles.statIconBox}>
            <AppIcon name="Truck" size={16} color={COLORS.primary} />
          </View>
          <AppText style={styles.statVal}>{shipmentCount}</AppText>
          <AppText style={styles.statSub}>Completed Loads</AppText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <View style={styles.statIconBox}>
            <AppIcon
              name="ShieldCheck"
              size={16}
              color={COLORS.emeraldPrimary}
            />
          </View>
          <AppText
            style={[
              styles.statVal,
              { color: COLORS.emeraldPrimary, fontSize: 14 },
            ]}
          >
            Active
          </AppText>
          <AppText style={styles.statSub}>Shipper Status</AppText>
        </View>
      </View>
    </>
  );
};

export default memo(ShipperProfileHeader);
