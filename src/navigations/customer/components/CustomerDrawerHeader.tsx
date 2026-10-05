import React, { memo, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, BadgeCheck, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import imageIndex from '../../../assets/images/imageIndex';
import { AppText } from '../../../components';
import styles from './styles.customerdrawer';

interface CustomerDrawerHeaderProps {
  user: any;
  onPressProfile: () => void;
}

const CustomerDrawerHeader: React.FC<CustomerDrawerHeaderProps> = ({
  user,
  onPressProfile,
}) => {
  // const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);

  const userName = user?.name || (user as any)?.fullName || 'Not Available';
  const userEmail = user?.email || 'Not Available';
  const userRole = (user?.role || 'Not Available').toUpperCase();
  const profileImage = (user as any)?.profileImage || (user as any)?.avatar;

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      style={[
        styles.profileHeaderContainer,
        // { paddingTop: Math.max(insets.top, 20) + 8 },
      ]}
      activeOpacity={0.9}
      onPress={onPressProfile}
    >
      <View style={styles.headerTopRow}>
        <Image
          source={imageIndex?.Logo}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={styles.roleBadge}>
          <Sparkles
            size={11}
            color={COLORS.primary}
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
              color={COLORS.success}
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

export default memo(CustomerDrawerHeader);
