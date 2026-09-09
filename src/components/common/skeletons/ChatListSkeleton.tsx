import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ChatListSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <SkeletonText width={120} height={24} />
        <View style={styles.spacingMedium} />
        <Skeleton width="100%" height={44} borderRadius={RADIUS.md} />
      </View>

      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.chatRow}>
          <SkeletonCircle size={48} />
          <View style={styles.chatContent}>
            <View style={styles.row}>
              <SkeletonText width={140} height={16} />
              <SkeletonText width={50} height={12} />
            </View>
            <View style={styles.spacingSmall} />
            <SkeletonText width="80%" height={12} />
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
    paddingTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  spacingSmall: {
    height: 6,
  },
  spacingMedium: {
    height: 12,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  chatContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ChatListSkeleton;
