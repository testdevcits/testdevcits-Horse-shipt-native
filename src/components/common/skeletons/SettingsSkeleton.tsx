import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const SettingsSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <SkeletonText width={140} height={22} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="90%" height={14} />
        <View style={styles.spacingSmall} />
        <SkeletonText width="70%" height={14} />
      </View>

      <View style={styles.box}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.item}>
            <SkeletonText width="70%" height={16} />
            <Skeleton width={44} height={24} borderRadius={RADIUS.pill} />
          </View>
        ))}
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
  box: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
});

export default SettingsSkeleton;
