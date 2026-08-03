import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../constants';
import AppText from '../common/AppText';

const ReviewCard = memo(({ item }: { item: any }) => {
  const renderStars = (count: number) => {
    // HorseShipt Yellow/Gold
    const STAR_COLOR = '#FACC15';

    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16} // Reduced from 24
        color={i < count ? STAR_COLOR : COLORS.grey200}
        fill={i < count ? STAR_COLOR : 'transparent'}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <View style={styles.card}>
      {/* Stars on top */}
      <View style={styles.starRow}>
        {renderStars(item?.rating || 5)}
      </View>

      {/* Review Text */}
      <AppText style={styles.reviewText} numberOfLines={4}>
        {item?.reviewText}
      </AppText>

      {/* Profile Footer */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: item?.shipperId?.profileImage?.url || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <AppText style={styles.name}>{item?.shipperName || 'Mark'}</AppText>
          <AppText style={styles.date}>
            {item?.createdAt ? new Date(item?.createdAt).toLocaleDateString('en-US') : '11/28/2023'}
          </AppText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg, // Reduced from xl
    borderWidth: 1,
    borderColor: COLORS.divider,
    width: 280, // Slightly narrower for horizontal lists
    // Subtle shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginRight: SPACING.md,
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: SPACING.md // Reduced from xl
  },
  reviewText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.lg, // Reduced to 16px (lg)
    color: COLORS.textPrimary,
    lineHeight: 22, // Adjusted for smaller font
    marginBottom: SPACING.xl, // Reduced gap
    minHeight: 66, // Keeps cards uniform height (3 lines)
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto' // Pushes footer to bottom if card height is fixed
  },
  avatar: {
    width: 42, // Reduced from 56
    height: 42,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.grey100
  },
  userInfo: {
    marginLeft: SPACING.sm
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md, // Reduced to 14px (md)
    color: COLORS.textPrimary,
    includeFontPadding: false,
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm, // Reduced to 12px (sm)
    color: COLORS.textSecondary,
    marginTop: 0
  },
});

export default ReviewCard;