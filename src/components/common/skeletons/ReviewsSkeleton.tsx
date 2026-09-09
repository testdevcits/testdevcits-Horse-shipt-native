import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ReviewsSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Summary Card Placeholder */}
      <View style={styles.summaryCard}>
        <SkeletonCircle size={56} />
        <View style={styles.summaryText}>
          <SkeletonText width={140} height={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={100} height={12} />
        </View>
      </View>

      {/* Review items */}
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.reviewCard}>
          <View style={styles.userRow}>
            <SkeletonCircle size={36} />
            <View style={styles.userInfo}>
              <SkeletonText width={120} height={14} />
              <View style={styles.spacingSmall} />
              <SkeletonText width={80} height={12} />
            </View>
          </View>
          <View style={styles.spacingMedium} />
          <SkeletonText width="95%" height={14} />
          <View style={styles.spacingSmall} />
          <SkeletonText width="70%" height={14} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryText: {
    marginLeft: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 10,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: SPACING.sm,
  },
});

export default ReviewsSkeleton;
