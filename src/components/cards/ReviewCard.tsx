import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Star, Quote } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

const ReviewCard = memo(({ item }: { item: any }) => {
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        color={i < count ? COLORS.goldPrimary : COLORS.grey200} 
        fill={i < count ? COLORS.goldPrimary : 'transparent'} 
      />
    ));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image 
          source={{ uri: item.shipperId?.profileImage?.url }} 
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <AppText style={styles.name}>{item.shipperName}</AppText>
          <View style={styles.starRow}>{renderStars(item.rating)}</View>
        </View>
        <AppText style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </AppText>
      </View>
      
      <View style={styles.contentWrapper}>
        <Quote size={16} color={COLORS.goldBorder} style={styles.quoteIcon} />
        <AppText style={styles.reviewText}>{item.reviewText}</AppText>
      </View>

      <View style={styles.badge}>
        <AppText style={styles.badgeText}>Verified Shipment</AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.grey100 },
  headerInfo: { flex: 1, marginLeft: SPACING.md },
  name: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  date: { fontSize: 11, color: COLORS.textLight, fontFamily: FONTS.medium },
  contentWrapper: { flexDirection: 'row', gap: SPACING.sm },
  quoteIcon: { marginTop: 4 },
  reviewText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontFamily: FONTS.regular },
  badge: { alignSelf: 'flex-start', backgroundColor: COLORS.goldLightBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.xs, marginTop: SPACING.md },
  badgeText: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.goldPrimary, textTransform: 'uppercase' }
});

export default ReviewCard;