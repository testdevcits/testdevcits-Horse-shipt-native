import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ShipperHomeSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Welcome Header Skeleton */}
      <View style={styles.welcomeHeader}>
        <SkeletonText width={170} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={140} height={14} />
      </View>

      {/* Stats Row Skeleton */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.flexOne}>
            <SkeletonText width="80%" height={12} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="40%" height={24} />
          </View>
          <SkeletonCircle size={40} />
        </View>

        <View style={styles.statCard}>
          <View style={styles.flexOne}>
            <SkeletonText width="80%" height={12} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="40%" height={24} />
          </View>
          <SkeletonCircle size={40} />
        </View>
      </View>

      {/* Opportunities Card Skeleton */}
      <View style={styles.opportunitiesCard}>
        <View style={styles.sectionHeaderRow}>
          <SkeletonText width={150} height={20} />
          <SkeletonText width={60} height={14} />
        </View>
        <View style={styles.spacingSmall} />
        <SkeletonText width="85%" height={12} />
        <View style={styles.spacingMedium} />

        {/* Search Bar Skeleton */}
        <Skeleton height={46} borderRadius={RADIUS.md} />
        <View style={styles.spacingMedium} />

        {/* Filter Row Skeleton */}
        <View style={styles.filterRow}>
          <SkeletonText width={60} height={14} />
          <View style={styles.filterPillsGroup}>
            <Skeleton width={105} height={32} borderRadius={RADIUS.round} />
            <Skeleton width={105} height={32} borderRadius={RADIUS.round} />
          </View>
        </View>

        {/* View Toggle Row Skeleton */}
        <View style={styles.viewToggleRow}>
          <Skeleton width="48%" height={38} borderRadius={RADIUS.md} />
          <Skeleton width="48%" height={38} borderRadius={RADIUS.md} />
        </View>
      </View>

      {/* New Shipment Section Header Skeleton */}
      <View style={styles.sectionHeader}>
        <SkeletonText width={130} height={18} />
        <SkeletonText width={60} height={14} />
      </View>

      {/* Available Shipment Cards Skeleton */}
      {[1, 2, 3].map((_, index) => (
        <View key={`shipper-shipment-skel-${index}`} style={styles.shipmentCard}>
          {/* Left horse image placeholder */}
          <Skeleton width={75} height={75} borderRadius={RADIUS.md} />

          {/* Center Info Col */}
          <View style={styles.cardInfoCol}>
            <SkeletonText width="70%" height={16} />
            <View style={styles.spacingSmall} />
            <SkeletonText width="85%" height={12} />
            <View style={styles.spacingSmall} />
            <View style={styles.rowBetween}>
              <SkeletonText width="45%" height={12} />
              <Skeleton width={65} height={18} borderRadius={RADIUS.xs} />
            </View>
            <View style={styles.spacingSmall} />
            <View style={styles.row}>
              <SkeletonCircle size={14} />
              <View style={{ width: 6 }} />
              <SkeletonText width="65%" height={12} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  welcomeHeader: {
    marginBottom: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  flexOne: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border || '#E8ECEF',
  },
  opportunitiesCard: {
    backgroundColor: '#FFFBF5',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#F0E4D4',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  filterPillsGroup: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  viewToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  shipmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border || '#E8ECEF',
    alignItems: 'center',
  },
  cardInfoCol: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ShipperHomeSkeleton;
