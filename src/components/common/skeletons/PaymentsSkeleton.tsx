import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const PaymentsSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <SkeletonText width={180} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={220} height={14} />
      </View>

      {[1, 2, 3, 4].map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <SkeletonCircle size={40} />
              <View style={styles.textContainer}>
                <SkeletonText width={120} height={16} />
                <View style={styles.spacingSmall} />
                <SkeletonText width={90} height={12} />
              </View>
            </View>
            <View style={styles.right}>
              <SkeletonText width={60} height={16} />
              <View style={styles.spacingSmall} />
              <Skeleton width={50} height={18} borderRadius={RADIUS.xs} />
            </View>
          </View>
        </View>
      ))}
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: SPACING.sm,
  },
  right: {
    alignItems: 'flex-end',
  },
});

export default PaymentsSkeleton;
