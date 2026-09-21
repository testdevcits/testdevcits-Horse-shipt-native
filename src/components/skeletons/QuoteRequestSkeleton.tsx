import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../constants';

export const QuoteRequestSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((_, index) => (
        <View key={`quote-skel-${index}`} style={styles.card}>
          {/* Left Thumbnail Placeholder */}
          <Skeleton width={80} height={80} borderRadius={RADIUS.md} />

          {/* Right Content Col */}
          <View style={styles.contentCol}>
            <SkeletonText width="65%" height={16} />
            <View style={styles.spacingXs} />
            <SkeletonText width="85%" height={12} />
            <View style={styles.spacingSm} />

            <View style={styles.badgeRow}>
              <Skeleton width={80} height={18} borderRadius={RADIUS.xs} />
              <Skeleton width={60} height={18} borderRadius={RADIUS.xs} />
            </View>

            <View style={styles.spacingSm} />
            <View style={styles.iconRow}>
              <SkeletonCircle size={14} />
              <View style={styles.spacingHorizontal} />
              <SkeletonText width="70%" height={12} />
            </View>

            <View style={styles.spacingXs} />
            <View style={styles.iconRow}>
              <SkeletonCircle size={14} />
              <View style={styles.spacingHorizontal} />
              <SkeletonText width="50%" height={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentCol: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacingXs: {
    height: 4,
  },
  spacingSm: {
    height: 8,
  },
  spacingHorizontal: {
    width: 6,
  },
});

export default QuoteRequestSkeleton;
