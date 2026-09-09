import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const MyHorsesSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Header section placeholder */}
      <View style={styles.headerWrap}>
        <SkeletonText width={140} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="90%" height={14} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="70%" height={14} />
        <View style={styles.spacingMedium} />
        <Skeleton width={100} height={36} borderRadius={RADIUS.pill} />
      </View>

      {/* Horse cards placeholder */}
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width="100%" height={160} borderRadius={RADIUS.md} />
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <SkeletonText width="60%" height={18} />
              <Skeleton width={60} height={20} borderRadius={RADIUS.xs} />
            </View>
            <View style={styles.spacingSmall} />
            <SkeletonText width="80%" height={14} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="40%" height={12} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export const MyHorsesSkelatons = MyHorsesSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  headerWrap: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardContent: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default MyHorsesSkeleton;
