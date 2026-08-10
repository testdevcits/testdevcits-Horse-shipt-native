import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Star, MapPin, Package, User } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

interface ReviewCardProps {
  item: any;
  fullWidth?: boolean;
}

const ReviewCard = memo(({ item, fullWidth = true }: ReviewCardProps) => {
  const shipperObj = typeof item?.shipperId === 'object' ? item?.shipperId : null;
  const shipmentObj = typeof item?.shipmentId === 'object' ? item?.shipmentId : null;

  const shipperName =
    item?.shipperName ||
    shipperObj?.name ||
    'Shipper';

  const avatarUrl =
    shipperObj?.profileImage?.url ||
    shipperObj?.profileImage ||
    item?.avatar ||
    null;

  const rating = Number(item?.rating) || 0;
  const reviewText = item?.reviewText || '';
  const shipmentCode = shipmentObj?.shipmentCode || item?.shipmentCode || '';
  const pickupLoc = shipmentObj?.pickupLocation || item?.pickupLocation || '';
  const deliveryLoc = shipmentObj?.deliveryLocation || item?.deliveryLocation || '';
  const createdAt = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : '';

  const renderStars = (count: number) => {
    const STAR_COLOR = COLORS.warning;
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          color={i < count ? STAR_COLOR : COLORS.slate300}
          fill={i < count ? STAR_COLOR : 'transparent'}
          strokeWidth={1.5}
        />
      ));
  };

  return (
    <View style={[styles.card, fullWidth && styles.fullWidthCard]}>
      {/* Header: Shipper Info & Date */}
      <View style={styles.headerRow}>
        <View style={styles.profileRow}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <User size={20} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.shipperInfo}>
            <AppText style={styles.shipperName}>{shipperName}</AppText>
            {shipperObj?.email ? (
              <AppText style={styles.shipperSubText}>{shipperObj.email}</AppText>
            ) : null}
          </View>
        </View>

        {createdAt ? <AppText style={styles.dateText}>{createdAt}</AppText> : null}
      </View>

      {/* Stars & Rating Row */}
      <View style={styles.starRow}>
        {renderStars(rating)}
        <AppText style={styles.ratingNumberText}>{rating}.0</AppText>
      </View>

      {/* Review Text */}
      {reviewText ? (
        <AppText style={styles.reviewText}>"{reviewText}"</AppText>
      ) : null}

      {/* Shipment Details Box */}
      {shipmentCode || pickupLoc || deliveryLoc ? (
        <View style={styles.shipmentBox}>
          {shipmentCode ? (
            <View style={styles.shipmentCodeRow}>
              <Package size={13} color={COLORS.textSecondary} />
              <AppText style={styles.shipmentCodeText}>#{shipmentCode}</AppText>
            </View>
          ) : null}

          {pickupLoc && deliveryLoc ? (
            <View style={styles.routeContainer}>
              <View style={styles.routeRow}>
                <MapPin size={12} color={COLORS.amberPrimary} />
                <AppText style={styles.routeText} numberOfLines={1}>
                  {pickupLoc}
                </AppText>
              </View>
              <View style={styles.routeRow}>
                <MapPin size={12} color={COLORS.greenActive} />
                <AppText style={styles.routeText} numberOfLines={1}>
                  {deliveryLoc}
                </AppText>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: SPACING.md,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey100,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperInfo: {
    justifyContent: 'center',
  },
  shipperName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  shipperSubText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.xs2,
  },
  ratingNumberText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.amberWarning,
    marginLeft: SPACING.xs,
  },
  reviewText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    lineHeight: SPACING.xl,
    marginVertical: SPACING.xs2,
  },
  shipmentBox: {
    backgroundColor: COLORS.slate50,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm2,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: 6,
  },
  shipmentCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shipmentCodeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  routeContainer: {
    gap: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.slate700,
  },
});

export default ReviewCard;