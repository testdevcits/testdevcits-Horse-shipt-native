import React, { memo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { Star, MapPin, Heart, CheckCircle2 } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants'; // Adjust paths
import AppText from '../common/AppText';
import imageIndex from '../../assets/images/imageIndex';

interface ShipperCardProps {
  item: {
    _id?: string;
    id?: string;
    profileImage?: string;
    name: string;
    rating: number;
    reviewCount?: number;
    region: string;
    isFavorite?: boolean;
  };
  onPress: () => void;
  onFavoritePress?: (item: any) => void;
  customstyle?: any;
}

const ShipperCard = memo(({ item, onPress, onFavoritePress, customstyle }: ShipperCardProps) => {
  // Extract City/Area from a long address string
  const formatLocation = (address: string) => {
    if (!address) return 'Unknown Location';
    const parts = address.split(',');
    // Returns "Indore, India" or the last two parts of the address
    return parts.length > 2
      ? `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`
      : address;
  };

  const ratingValue = item?.rating ?? 0;

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(index => (
      <Star
        key={index}
        size={14}
        color={index <= Math.round(ratingValue) ? "#FFB800" : COLORS.grey300}
        fill={index <= Math.round(ratingValue) ? "#FFB800" : 'transparent'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        customstyle
      ]}
    >
      {/* Top Row: Avatar and Favorite */}
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              item?.profileImage && item.profileImage !== '/default-avatar.png'
                ? { uri: item.profileImage }
                : imageIndex.AccountIcon
            }
            style={styles.avatar}
          />
          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={12} color={COLORS.white} fill={COLORS.primary} />
          </View>
        </View>

        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.favoriteBtn}
          onPress={(e) => {
            e?.stopPropagation?.();
            onFavoritePress?.(item);
          }}
        >
          <Heart
            size={20}
            color={item?.isFavorite ? COLORS.error : COLORS.grey400}
            fill={item?.isFavorite ? COLORS.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Body Section */}
      <View style={styles.content}>
        <AppText style={styles.name} numberOfLines={1}>
          {item?.name || "Unnamed Shipper"}
        </AppText>

        <View style={styles.ratingRow}>
          <View style={styles.stars}>{renderStars()}</View>
          <AppText style={styles.ratingText}>
            {ratingValue.toFixed(1)}
            <AppText style={styles.reviewCount}> ({item?.reviewCount || 0})</AppText>
          </AppText>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer Section */}
      <View style={styles.footerRow}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={COLORS.primary} />
          <AppText style={styles.locationText} numberOfLines={1}>
            {formatLocation(item?.region)}
          </AppText>
        </View>

        {/* <View style={styles.badge}>
          <AppText style={styles.badgeText}>Active</AppText>
        </View> */}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, // Increased for modern look
    padding: SPACING.md,
    width: 280,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,


    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: COLORS.grey50,
    borderWidth: 2,
    borderColor: COLORS.grey100,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  favoriteBtn: {
    padding: 4,
  },
  content: {
    marginTop: SPACING.xs,
  },
  name: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    letterSpacing: 0.3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
  },
  reviewCount: {
    fontFamily: FONTS.regular,
    color: COLORS.grey500,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey100,
    marginVertical: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
    marginLeft: 4,
  },
  badge: {
    backgroundColor: '#E8F5E9', // Light green
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#2E7D32', // Dark green
    textTransform: 'uppercase',
  }
});

export default ShipperCard;