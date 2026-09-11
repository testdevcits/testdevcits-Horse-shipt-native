import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';
import { COLORS, RADIUS, SPACING } from '../../../constants';

const ChatDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonCircle size={28} />
        <SkeletonCircle size={40} />
        <View style={styles.headerTextCol}>
          <SkeletonText width={130} height={16} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={170} height={12} />
        </View>
      </View>

      {/* Conversation Messages Thread Skeleton */}
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Date Divider Skeleton */}
        <View style={styles.dateDivider}>
          <Skeleton width={100} height={16} borderRadius={RADIUS.round} />
        </View>

        {/* Bubble 1 - Received (Left) */}
        <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
          <Skeleton width={220} height={50} borderRadius={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={45} height={10} />
        </View>

        {/* Bubble 2 - Sent (Right) */}
        <View style={[styles.bubbleWrapper, styles.bubbleRight]}>
          <Skeleton width={180} height={42} borderRadius={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={45} height={10} />
        </View>

        {/* Bubble 3 - Received (Left) */}
        <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
          <Skeleton width={250} height={66} borderRadius={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={45} height={10} />
        </View>

        {/* Bubble 4 - Sent (Right) */}
        <View style={[styles.bubbleWrapper, styles.bubbleRight]}>
          <Skeleton width={160} height={44} borderRadius={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={45} height={10} />
        </View>

        {/* Bubble 5 - Received (Left) */}
        <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
          <Skeleton width={200} height={46} borderRadius={18} />
          <View style={styles.spacingSmall} />
          <SkeletonText width={45} height={10} />
        </View>
      </ScrollView>

      {/* Input Bar Footer Skeleton */}
      <View style={styles.inputFooter}>
        <SkeletonCircle size={36} />
        <Skeleton width="70%" height={42} borderRadius={RADIUS.round} />
        <SkeletonCircle size={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: SPACING.xs + 2,
  },
  headerTextCol: {
    flex: 1,
    marginLeft: 4,
  },
  spacingSmall: {
    height: 4,
  },
  messagesContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  bubbleWrapper: {
    marginVertical: 6,
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: COLORS.white,
  },
});

export default ChatDetailsSkeleton;
