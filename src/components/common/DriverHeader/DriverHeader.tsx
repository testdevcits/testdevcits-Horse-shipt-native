import React from 'react';
import {
  
  View,
  Image,
   
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { COLORS,  } from '../../../constants';
import AppText from '../AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './DriverHeader.styles';

interface DriverHeaderProps {
  name: string;
  statusText?: string;
  profileImageUrl?: string | null;
  isOnline?: boolean;
  rating?: number;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onStatusToggle?: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({
  name,
  statusText = 'ON DISPATCH',
  profileImageUrl,
  isOnline = true,

  rightComponent,
  containerStyle,
  onStatusToggle,
}) => {
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : 'C';

  const getAvatarUri = (img: any): string | null => {
    if (!img) return null;
    if (
      typeof img === 'string' &&
      img.trim() !== '' &&
      img !== '/default-avatar.png'
    ) {
      return img;
    }
    if (typeof img === 'object' && img.url) {
      return img.url;
    }
    return null;
  };

  const avatarUri = getAvatarUri(profileImageUrl);

  return (
    <View style={[styles.safeArea, containerStyle]}>
      <View style={styles.headerRow}>
        {/* Left Side: Avatar Box & Status Dot */}
        <View style={styles.leftContainer}>
          <View style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <AppText style={styles.monogramText}>{firstLetter}</AppText>
            )}
          </View>
          {isOnline && <View style={styles.indicatorDot} />}
        </View>

        {/* Center: Captain Name, Rating & Status Pill */}
        <View style={styles.middleContainer}>
          <View style={styles.nameRow}>
            <AppText style={styles.driverName} numberOfLines={1}>
              Captain {name || 'Driver'}
            </AppText>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onStatusToggle}
            style={[
              styles.statusBadge,
              isOnline ? styles.statusBadgeOnline : styles.statusBadgeOffline,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOnline
                    ? COLORS.greenActive
                    : COLORS.grey400,
                },
              ]}
            />
            <AppText
              style={[
                styles.statusBadgeText,
                { color: isOnline ? COLORS.greenSuccess : COLORS.slate600 },
              ]}
            >
              {isOnline ? statusText.toUpperCase() : 'OFFLINE'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Right Side: Action Slot */}
        {rightComponent ? (
          <View style={styles.rightContainer}>{rightComponent}</View>
        ) : (
          <View style={styles.captainShieldBox}>
            <AppIcon name={'ShieldCheck'} size={18} color={COLORS.primary} />
            <AppText style={styles.verifiedCaptainTag}>VERIFIED</AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default DriverHeader;
