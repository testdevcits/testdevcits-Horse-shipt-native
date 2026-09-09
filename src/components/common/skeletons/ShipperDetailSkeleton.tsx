import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ShipperDetailSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      {/* Cover / Profile Banner */}
      <View style={styles.headerCover}>
        <Skeleton width="100%" height={140} borderRadius={0} />
        <View style={styles.avatarPosition}>
          <SkeletonCircle size={80} />
        </View>
      </View>

      <View style={styles.profileMeta}>
        <SkeletonText width={180} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={120} height={14} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={150} height={14} />
      </View>

      {/* Stats Cards Row */}
      <View style={styles.statsRow}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.statBox}>
            <SkeletonText width={40} height={18} />
            <View style={styles.spacingSmall} />
            <SkeletonText width={60} height={12} />
          </View>
        ))}
      </View>

      {/* Bio / Details */}
      <View style={styles.section}>
        <SkeletonText width={120} height={18} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="95%" height={14} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="80%" height={14} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  headerCover: {
    position: 'relative',
    marginBottom: 44,
  },
  avatarPosition: {
    position: 'absolute',
    bottom: -40,
    left: SPACING.lg,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 40,
  },
  profileMeta: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
});

export default ShipperDetailSkeleton;
