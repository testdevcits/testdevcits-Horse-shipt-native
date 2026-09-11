import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import {   RADIUS, SPACING } from '../../../constants';

const ProfileSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <SkeletonCircle size={84} />
        <View style={styles.spacingMedium} />
        <SkeletonText width={160} height={20} />
        <View style={styles.spacingSmall} />
        <SkeletonText width={180} height={14} />
      </View>

      <View style={styles.tabsRow}>
        {[90, 110, 90].map((w, i) => (
          <Skeleton
            key={i}
            width={w}
            height={36}
            borderRadius={RADIUS.pill}
            style={{ marginRight: SPACING.xs }}
          />
        ))}
      </View>

      <View style={styles.formContainer}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.inputGroup}>
            <SkeletonText width={100} height={14} />
            <View style={styles.spacingSmall} />
            <Skeleton width="100%" height={48} borderRadius={RADIUS.md} />
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
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
});

export default ProfileSkeleton;
