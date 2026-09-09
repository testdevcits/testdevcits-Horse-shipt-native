import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../constants';
import AppText from './AppText';
import AppIcon from '../AppIcon';

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

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 8,
    elevation: 3,
    margin: 16,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    ...Platform.select({
      android: {
        paddingTop: SPACING.md,
      },
    }),
    borderRadius: 20,
  },
  leftContainer: {
    position: 'relative',
    marginRight: SPACING.sm2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 14,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  monogramText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.greenActive,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: -2,
    right: -2,
    zIndex: 10,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs2,
  },
  driverName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.slate900,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  statusBadgeOnline: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
  },
  statusBadgeOffline: {
    backgroundColor: COLORS.grey100,
    borderColor: COLORS.grey200,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    letterSpacing: 0.5,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  captainShieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  verifiedCaptainTag: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
});
