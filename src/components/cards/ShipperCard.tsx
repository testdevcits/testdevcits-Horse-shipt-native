import React, { memo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Star, MapPin, Heart } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants'; // Adjust paths as needed
import AppText from '../common/AppText';
import imageIndex from '../../assets/images/imageIndex';

interface ShipperCardProps {
  item: {
    profileImage: string;
    name: string;
    rating: number;
    shipmentsCount: number;
    region: string;
    isFavorite?: boolean;
    
  };
  onPress: () => void;
   customstyle?:any;
}

const ShipperCard = memo(({ item, onPress,customstyle}: ShipperCardProps) => {
  // Logic to render 5 stars
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(index => (
      <Star
        key={index}
        size={18}
        color={COLORS.primary}
        fill={
          index <= Math.round(item?.rating) ? COLORS.primary : 'transparent'
        }
        strokeWidth={1.5}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <Pressable onPress={onPress} style={[styles.card,customstyle]}>
      {/* Top Row: Avatar and Heart */}
      <View style={styles.headerRow}>
        {item?.profileImage === '/default-avatar.png' ? (
          <Image source={imageIndex.AccountIcon} style={styles.avatar} />
        ) : (
          <Image source={{ uri: item?.profileImage }} style={styles.avatar} />
        )}

        <TouchableOpacity activeOpacity={0.7}>
          <Heart
            size={24}
            color={COLORS.primary}
            fill={item?.isFavorite ? COLORS.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <AppText style={styles.name} numberOfLines={1}>
        {item?.name}
      </AppText>

      {/* Rating Row */}
      <View style={styles.ratingContainer}>
        <View style={styles.starsRow}>{renderStars()}</View>
        <AppText style={styles.ratingText}>
          {item?.rating.toFixed(1)} / 5
        </AppText>
      </View>

      {/* Footer Row: Shipments and Location */}
      <View style={styles.footerRow}>
        <AppText style={styles.footerText}>
          {item?.shipmentsCount} shipments
        </AppText>

        <View style={styles.locationRow}>
          <MapPin size={16} color={COLORS.textSecondary} />
          <AppText style={styles.footerText} numberOfLines={1}>
            {item?.region}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: 260, // Or set a fixed width if used in a horizontal list
    borderWidth: 1,
    borderColor: COLORS.grey200,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,
    // Elevation for Android / Shadow for iOS
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35, // Circular
    backgroundColor: COLORS.grey100,
  },
  name: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
});

export default ShipperCard;
