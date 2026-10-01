import React, { memo, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Sparkles, BadgeCheck, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import imageIndex from '../../../assets/images/imageIndex';
import { AppText } from '../../../components';
import styles from './styles.shipperdrawer';

interface ShipperDrawerHeaderProps {
  user: any;
  onPressProfile: () => void;
}

const ShipperDrawerHeader: React.FC<ShipperDrawerHeaderProps> = ({
  user,
  onPressProfile,
}) => {
  const [imageError, setImageError] = useState(false);

  const userName = user?.name || (user as any)?.fullName || 'NOT AVAILABLE';
  const userEmail = user?.email || 'Not Available';
  const userRole = (user?.role || 'NOT AVAILABLE').toUpperCase();
  const rawImage = (user as any)?.profileImage;
  const profileImage = typeof rawImage === 'string' ? rawImage : rawImage?.url;

  const getInitials = (name: string) => {
    if (!name || name === 'Not Available') return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      style={styles.profileHeaderContainer}
      activeOpacity={0.9}
      onPress={onPressProfile}
    >
      <View style={styles.headerTopRow}>
        <View style={styles.logoGroup}>
          <Image
            source={imageIndex?.LogoIcon}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <AppText style={styles.logoText}>HorseShipt</AppText>
        </View>

        <View style={styles.roleBadge}>
          <Sparkles
            size={11}
            color={COLORS.brandBrown}
            style={{ marginRight: 4 }}
          />
          <AppText style={styles.roleBadgeText}>{userRole}</AppText>
        </View>
      </View>

      <View style={styles.userCardRow}>
        {profileImage && !imageError ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.avatarImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <AppText style={styles.avatarInitials}>
              {getInitials(userName)}
            </AppText>
          </View>
        )}

        <View style={styles.userInfoCol}>
          <View style={styles.userNameRow}>
            <AppText style={styles.userNameText} numberOfLines={1}>
              {userName}
            </AppText>
            <BadgeCheck
              size={16}
              color={COLORS.greenSuccess || '#10B981'}
              style={{ marginLeft: 4 }}
            />
          </View>
          <AppText style={styles.userEmailText} numberOfLines={1}>
            {userEmail}
          </AppText>
        </View>

        <ChevronRight size={18} color={COLORS.grey400} />
      </View>
    </TouchableOpacity>
  );
};

export default memo(ShipperDrawerHeader);
