import React, { memo } from 'react';
import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import { COLORS } from '../../../constants'; // Adjust paths
import AppText from '../../common/AppText';
import imageIndex from '../../../assets/images/imageIndex';
import AppIcon from '../../app_icon/AppIcon';
import styles from './styles.ShipperCard';

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
    isWishlisted?: boolean;
  };
  onPress: () => void;
  onFavoritePress?: (item: any) => void;
  customstyle?: any;
}

const ShipperCard = memo(
  ({ item, onPress, onFavoritePress, customstyle }: ShipperCardProps) => {
    // Check either isFavorite or isWishlisted
    const isFav = Boolean(item?.isFavorite || item?.isWishlisted);

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
        <AppIcon
          key={index}
          name="Star"
          size={14}
          color={
            index <= Math.round(ratingValue) ? COLORS.warning : COLORS.grey300
          }
          fill={
            index <= Math.round(ratingValue) ? COLORS.warning : 'transparent'
          }
          style={styles.starIcon}
        />
      ));
    };

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          customstyle,
        ]}
      >
        {/* Top Row: Avatar and Favorite */}
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            {(() => {
              const profileUri =
                typeof item?.profileImage === 'string'
                  ? item.profileImage
                  : (item?.profileImage as any)?.url;
              const hasValidImage = Boolean(
                profileUri && profileUri !== '/default-avatar.png',
              );
              return (
                <Image
                  source={
                    hasValidImage
                      ? { uri: profileUri }
                      : imageIndex?.AccountIcon
                  }
                  style={styles.avatar}
                />
              );
            })()}
            <View style={styles.verifiedBadge}>
              <AppIcon
                name="CheckCircle2"
                size={12}
                color={COLORS.white}
                fill={COLORS.primary}
              />
            </View>
          </View>

          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.favoriteBtn}
            onPress={e => {
              e?.stopPropagation?.();
              onFavoritePress?.(item);
            }}
          >
            <AppIcon
              name="Heart"
              size={20}
              color={isFav ? COLORS.error : COLORS.grey400}
              fill={isFav ? COLORS.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Body Section */}
        <View style={styles.content}>
          <AppText style={styles.name} numberOfLines={1}>
            {item?.name || 'Unnamed Shipper'}
          </AppText>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>{renderStars()}</View>
            <AppText style={styles.ratingText}>
              {ratingValue.toFixed(1)}
              <AppText style={styles.reviewCount}>
                {' '}
                ({item?.reviewCount || 0})
              </AppText>
            </AppText>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer Section */}
        <View style={styles.footerRow}>
          <View style={styles.locationContainer}>
            <AppIcon name="MapPin" size={14} color={COLORS.primary} />
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
  },
);

export default ShipperCard;
