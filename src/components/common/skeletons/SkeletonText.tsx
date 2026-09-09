import React from 'react';
import Skeleton from './Skeleton';
import { DimensionValue } from 'react-native';

interface SkeletonTextProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

const SkeletonText = ({ width = '80%', height = 14 }: SkeletonTextProps) => {
  return <Skeleton width={width} height={height} borderRadius={4} />;
};

export default SkeletonText;
