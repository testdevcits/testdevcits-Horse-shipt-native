import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../constants';

export const MyShipmentsSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((_, index) => (
        <View key={`my-shipment-skel-${index}`} style={styles.card}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Skeleton width={110} height={24} borderRadius={RADIUS.xs} />
            <Skeleton width={90} height={24} borderRadius={RADIUS.xs} />
          </View>

          {/* Route Section */}
          <View style={styles.routeContainer}>
            <View style={styles.routeStep}>
              <View style={styles.indicatorCol}>
                <SkeletonCircle size={10} />
                <Skeleton width={2} height={26} style={styles.line} />
              </View>
              <View style={styles.addressCol}>
                <SkeletonText width={60} height={10} />
                <View style={styles.spacingXs} />
                <SkeletonText width="85%" height={14} />
              </View>
            </View>

            <View style={styles.routeStep}>
              <View style={styles.indicatorCol}>
                <SkeletonCircle size={10} />
              </View>
              <View style={styles.addressCol}>
                <SkeletonText width={65} height={10} />
                <View style={styles.spacingXs} />
                <SkeletonText width="80%" height={14} />
              </View>
            </View>
          </View>

          {/* Meta Info Grid */}
          <View style={styles.metaContainer}>
            <View style={styles.metaCol}>
              <SkeletonText width={45} height={10} />
              <View style={styles.spacingXs} />
              <SkeletonText width={65} height={14} />
            </View>
            <View style={styles.metaCol}>
              <SkeletonText width={60} height={10} />
              <View style={styles.spacingXs} />
              <SkeletonText width={55} height={14} />
            </View>
            <View style={styles.metaCol}>
              <SkeletonText width={50} height={10} />
              <View style={styles.spacingXs} />
              <SkeletonText width={70} height={14} />
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Skeleton width="48%" height={36} borderRadius={RADIUS.xs} />
            <Skeleton width="48%" height={36} borderRadius={RADIUS.xs} />
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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  routeContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 20,
    paddingTop: 4,
  },
  line: {
    marginVertical: 4,
  },
  addressCol: {
    flex: 1,
    marginLeft: SPACING.xs,
  },
  spacingXs: {
    height: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default MyShipmentsSkeleton;
