import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ShipmentsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Tabs placeholder */}
      <View style={styles.tabsRow}>
        {[100, 70, 90, 80].map((w, i) => (
          <Skeleton
            key={i}
            width={w}
            height={36}
            borderRadius={RADIUS.pill}
            style={{ marginRight: SPACING.sm }}
          />
        ))}
      </View>

      {/* Shipment card skeletons */}
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.card}>
            <Skeleton width={100} height={100} borderRadius={RADIUS.md} />
            <View style={styles.content}>
              <SkeletonText width="85%" height={16} />
              <View style={styles.spacingSmall} />
              <View style={styles.row}>
                <SkeletonText width={40} height={12} />
                <Skeleton width={75} height={18} borderRadius={RADIUS.round} />
              </View>
              <View style={styles.spacingSmall} />
              <SkeletonText width="90%" height={12} />
              <View style={styles.spacingSmall} />
              <SkeletonText width="60%" height={12} />
            </View>
            <View style={styles.timeline}>
              <SkeletonCircle size={8} />
              <Skeleton width={2} height={18} style={{ marginVertical: 2 }} />
              <SkeletonCircle size={18} />
              <Skeleton width={2} height={18} style={{ marginVertical: 2 }} />
              <SkeletonCircle size={8} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  card: {
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
  content: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  spacingSmall: {
    height: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

export default ShipmentsSkeleton;
