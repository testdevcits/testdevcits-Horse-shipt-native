import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonCircleProps {
  size?: number;
}

const SkeletonCircle = ({ size = 48 }: SkeletonCircleProps) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
    />
  );
};

export default SkeletonCircle;