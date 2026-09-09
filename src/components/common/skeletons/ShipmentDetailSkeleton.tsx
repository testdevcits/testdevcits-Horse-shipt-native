import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ShipmentDetailSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Title & Badge */}
      <View style={styles.header}>
        <SkeletonText width={220} height={20} />
        <View style={styles.spacingSmall} />
        <Skeleton width={90} height={24} borderRadius={RADIUS.round} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[80, 70, 80, 90].map((w, i) => (
          <Skeleton
            key={i}
            width={w}
            height={36}
            borderRadius={RADIUS.pill}
            style={{ marginRight: SPACING.xs }}
          />
        ))}
      </View>

      {/* Card Detail Section */}
      <View style={styles.card}>
        <SkeletonText width={140} height={18} />
        <View style={styles.spacingMedium} />
        <SkeletonText width="90%" height={14} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="70%" height={14} />
        <View style={styles.spacingMedium} />
        <Skeleton width="100%" height={120} borderRadius={RADIUS.md} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default ShipmentDetailSkeleton;
