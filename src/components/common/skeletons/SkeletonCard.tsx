import React from 'react';
import { View, StyleSheet } from 'react-native';

 import SkeletonText from './SkeletonText';
import SkeletonCircle from './SkeletonCircle';

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <SkeletonCircle size={48} />

      <View style={styles.content}>
        <SkeletonText width="60%" height={16} />

        <View style={styles.spacing} />

        <SkeletonText width="90%" height={12} />

        <View style={styles.spacingSmall} />

        <SkeletonText width="70%" height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  spacing: {
    height: 10,
  },

  spacingSmall: {
    height: 6,
  },
});

export default SkeletonCard;