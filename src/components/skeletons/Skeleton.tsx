// import React, { memo, useEffect, useRef } from 'react';
// import {
//   Animated,
//   DimensionValue,
//   StyleProp,
//   StyleSheet,
//   ViewStyle,
// } from 'react-native';
// import { COLORS } from '../../constants';

// interface SkeletonProps {
//   width?: DimensionValue;
//   height?: DimensionValue;
//   borderRadius?: number;
//   style?: StyleProp<ViewStyle>;
// }

// const Skeleton = ({
//   width = '100%',
//   height = 16,
//   borderRadius = 6,
//   style,
// }: SkeletonProps) => {
//   const opacity = useRef(new Animated.Value(0.4)).current;

//   useEffect(() => {
//     const animation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(opacity, {
//           toValue: 1,
//           duration: 700,
//           useNativeDriver: true,
//         }),
//         Animated.timing(opacity, {
//           toValue: 0.4,
//           duration: 700,
//           useNativeDriver: true,
//         }),
//       ]),
//     );

//     animation.start();

//     return () => animation.stop();
//   }, [opacity]);

//   return (
//     <Animated.View
//       style={[
//         styles.skeleton,
//         {
//           width,
//           height,
//           borderRadius,
//           opacity,
//         },
//         style,
//       ]}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   skeleton: {
//     backgroundColor: COLORS.grey250,
//   },
// });

// export default memo(Skeleton);

import React, { memo } from 'react';
import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = 6,
  style,
}: SkeletonProps) => {
  return (
    <ShimmerPlaceHolder
      LinearGradient={LinearGradient}
      shimmerColors={[
        COLORS.grey250,
        COLORS.white,
        COLORS.grey250,
      ]}
      shimmerStyle={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      duration={1200}
    // shimmerWidth={200}
    // autoRun
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

export default memo(Skeleton);