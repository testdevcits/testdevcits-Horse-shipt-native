import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ShippersListSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Header & Search Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <View>
            <SkeletonText width={160} height={22} />
            <View style={styles.spacingSmall} />
            <SkeletonText width={200} height={14} />
          </View>
          <SkeletonCircle size={40} />
        </View>
        <View style={styles.spacingMedium} />
        <Skeleton width="100%" height={48} borderRadius={RADIUS.md} />

        {/* Quick filters */}
        <View style={styles.filterScroll}>
          {[70, 90, 80, 75].map((w, i) => (
            <Skeleton
              key={i}
              width={w}
              height={32}
              borderRadius={RADIUS.pill}
              style={{ marginRight: SPACING.xs }}
            />
          ))}
        </View>
      </View>

      {/* Shipper card list */}
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.shipperCard}>
          <View style={styles.shipperHeader}>
            <SkeletonCircle size={40} />
            <SkeletonCircle size={24} />
          </View>
          <View style={styles.spacingMedium} />
          <SkeletonText width="60%" height={16} />
          <View style={styles.spacingSmall} />
          <SkeletonText width="40%" height={12} />
          <View style={styles.divider} />
          <SkeletonText width="50%" height={12} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  filterScroll: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  shipperCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shipperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
});

export default ShippersListSkeleton;
