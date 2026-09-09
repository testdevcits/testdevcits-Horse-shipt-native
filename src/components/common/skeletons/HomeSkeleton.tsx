import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SCREEN_WIDTH, SPACING } from '../../../constants';

const HomeSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Welcome Header Skeleton */}
      <View style={styles.welcomeHeader}>
        <SkeletonText width={180} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={140} height={14} />
      </View>

      {/* Banner Skeleton */}
      <View style={styles.bannerContainer}>
        <Skeleton
          width={SCREEN_WIDTH - 16}
          height={216}
          borderRadius={20}
        />
      </View>

      {/* Section Header: Current Shipments */}
      <View style={styles.sectionHeader}>
        <SkeletonText width={150} height={18} />
        <SkeletonText width={60} height={14} />
      </View>

      {/* Shipment Cards Skeleton (2 items) */}
      {[1, 2].map((_, index) => (
        <View key={`shipment-skel-${index}`} style={styles.shipmentCard}>
          {/* Left image placeholder */}
          <Skeleton width={100} height={100} borderRadius={RADIUS.md} />

          {/* Middle details placeholder */}
          <View style={styles.shipmentContent}>
            <SkeletonText width="85%" height={16} />
            <View style={styles.spacingSmall} />
            <View style={styles.row}>
              <SkeletonText width={50} height={12} />
              <Skeleton width={80} height={18} borderRadius={RADIUS.round} />
            </View>
            <View style={styles.spacingSmall} />
            <SkeletonText width="90%" height={12} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="60%" height={12} />
          </View>

          {/* Right timeline indicator */}
          <View style={styles.timelinePlaceholder}>
            <SkeletonCircle size={8} />
            <Skeleton width={2} height={20} style={styles.timelineLine} />
            <SkeletonCircle size={18} />
            <Skeleton width={2} height={20} style={styles.timelineLine} />
            <SkeletonCircle size={8} />
          </View>
        </View>
      ))}

      {/* Section Header: Favorite Shippers */}
      <View style={styles.sectionHeader}>
        <SkeletonText width={160} height={18} />
        <SkeletonText width={60} height={14} />
      </View>

      {/* Favorite Shipper Cards Skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.shipperRow}
      >
        {[1, 2].map((_, index) => (
          <View key={`shipper-skel-${index}`} style={styles.shipperCard}>
            {/* Avatar & Heart button */}
            <View style={styles.shipperHeader}>
              <SkeletonCircle size={40} />
              <SkeletonCircle size={24} />
            </View>
            <View style={styles.spacingMedium} />
            <SkeletonText width="70%" height={16} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="50%" height={12} />
            <View style={styles.divider} />
            <View style={styles.row}>
              <SkeletonText width="60%" height={12} />
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export const HomeSkelaton = HomeSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingTop: SPACING.xs,
  },
  welcomeHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 10,
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  shipmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  shipmentContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelinePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  timelineLine: {
    marginVertical: 2,
  },
  shipperRow: {
    paddingHorizontal: SPACING.lg,
  },
  shipperCard: {
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginRight: SPACING.md,
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

export default HomeSkeleton;
