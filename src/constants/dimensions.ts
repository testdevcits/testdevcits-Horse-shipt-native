// // dimensions.ts
// import { Dimensions } from 'react-native';
// import { RFValue } from 'react-native-responsive-fontsize';
// import { moderateScale } from 'react-native-size-matters';


// const { width, height } = Dimensions.get('window');

// export const SCREEN_WIDTH = width;
// export const SCREEN_HEIGHT = height;

// export const SPACING = {
//   xxs: 2,
//   xs: 4,
//   xs2: 6,
//   sm: 8,
//   sm2: 10,
//   md: 12,
//   md2: 14,
//   lg: 16,
//   lg2: 18,
//   xl: 20,
//   xxl: 24,
//   xxxl: 32,
//   giant: 40,
//   huge: 48,
//   massive: 60,
// } as const;

// export const RADIUS = {
//   xxs: 2,
//   xs: 4,
//   xs2: 6,
//   sm: 8,
//   sm2: 10,
//   md: 12,
//   md2: 14,
//   lg: 16,
//   xl: 20,
//   xxl: 24,
//   pill: 30,
//   circle: 50,
//   round: 999,
// } as const;

// // export const FONT_SIZE = {
// //   xxs: 8,
// //   mini: 9,
// //   xs: 10,
// //   sm: 12,
// //   md: 14,
// //   lg: 16,
// //   xl: 18,
// //   xxl: 20,
// //   title: 22,
// //   heading: 24,
// //   display: 28,
// //   hero: 30,
// //   giant: 32,
// // } as const;



// export const FONT_SIZE = {
//   xxs: moderateScale(8),
//   mini: moderateScale(9),
//   xs: moderateScale(10),
//   sm: moderateScale(12),
//   md: moderateScale(14),
//   lg: moderateScale(16),
//   xl: moderateScale(18),
//   xxl: moderateScale(20),
//   title: moderateScale(22),
//   heading: moderateScale(24),
//   display: moderateScale(28),
//   hero: moderateScale(30),
//   giant: moderateScale(32),
// } as const;




// // export const FONT_SIZE = {
// //   xxs: RFValue(8),
// //   mini: RFValue(9),
// //   xs: RFValue(10),
// //   sm: RFValue(12),
// //   md: RFValue(14),
// //   lg: RFValue(16),
// //   xl: RFValue(18),
// //   xxl: RFValue(20),
// //   title: RFValue(22),
// //   heading: RFValue(24),
// //   display: RFValue(28),
// //   hero: RFValue(30),
// //   giant: RFValue(32),
// // } as const;

// export const ICON_SIZE = {
//   mini: 12,
//   xs: 14,
//   sm: 18,
//   md: 22,
//   lg: 26,
//   xl: 32,
//   xxl: 40,
//   giant: 48,
// } as const;

// export const SIZES = {
//   borderWidthThin: 1,
//   borderWidthThick: 2,
//   avatarSm: 32,
//   avatarMd: 40,
//   avatarMd44: 44,
//   avatarLg: 48,
//   avatar54: 54,
//   avatarXl: 64,
//   iconHeaderBg: 68,
//   controlBtn: 44,
//   iconActionBtn: 36,
//   markerCircle: 28,
//   truckMarker: 36,
//   timelinePoint: 24,
//   timelineLine: 18,
//   handleBar: 36,
//   handleBarHeight: 4,
//   buttonHeight: 48,
//   headerHeight: 56,
//   inputHeight: 48,
// } as const;

// export default {
//   SCREEN_WIDTH,
//   SCREEN_HEIGHT,
//   SPACING,
//   RADIUS,
//   FONT_SIZE,
//   ICON_SIZE,
//   SIZES,
// };



// dimensions.ts
import { Dimensions } from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

/**
 * Spacing
 *
 * moderateScale is used so spacing changes slightly
 * between different screen sizes without becoming excessive.
 */
export const SPACING = {
  xxs: moderateScale(2),
  xs: moderateScale(4),
  xs2: moderateScale(6),
  sm: moderateScale(8),
  sm2: moderateScale(10),
  md: moderateScale(12),
  md2: moderateScale(14),
  lg: moderateScale(16),
  lg2: moderateScale(18),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  giant: moderateScale(40),
  huge: moderateScale(48),
  massive: moderateScale(60),
} as const;

/**
 * Border radius
 */
export const RADIUS = {
  xxs: moderateScale(2),
  xs: moderateScale(4),
  xs2: moderateScale(6),
  sm: moderateScale(8),
  sm2: moderateScale(10),
  md: moderateScale(12),
  md2: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  pill: moderateScale(30),
  circle: moderateScale(50),
  round: 999,
} as const;

/**
 * Font sizes
 *
 * factor 0.3 prevents fonts from growing/shrinking too aggressively.
 */
export const FONT_SIZE = {
  xxs: moderateScale(8, 0.3),
  mini: moderateScale(9, 0.3),
  xs: moderateScale(10, 0.3),
  sm: moderateScale(12, 0.3),
  md: moderateScale(14, 0.3),
  lg: moderateScale(16, 0.3),
  xl: moderateScale(18, 0.3),
  xxl: moderateScale(20, 0.3),
  title: moderateScale(22, 0.3),
  heading: moderateScale(24, 0.3),
  display: moderateScale(28, 0.3),
  hero: moderateScale(30, 0.3),
  giant: moderateScale(32, 0.3),
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZE = {
  mini: moderateScale(12),
  xs: moderateScale(14),
  sm: moderateScale(18),
  md: moderateScale(22),
  lg: moderateScale(26),
  xl: moderateScale(32),
  xxl: moderateScale(40),
  giant: moderateScale(48),
} as const;

/**
 * Component sizes
 */
export const SIZES = {
  borderWidthThin: 1,
  borderWidthThick: 2,

  avatarSm: moderateScale(32),
  avatarMd: moderateScale(40),
  avatarMd44: moderateScale(44),
  avatarLg: moderateScale(48),
  avatar54: moderateScale(54),
  avatarXl: moderateScale(64),

  iconHeaderBg: moderateScale(68),

  controlBtn: moderateScale(44),
  iconActionBtn: moderateScale(36),

  markerCircle: moderateScale(28),
  truckMarker: moderateScale(36),

  timelinePoint: moderateScale(24),
  timelineLine: moderateScale(18),

  handleBar: moderateScale(36),
  handleBarHeight: moderateScale(4),

  buttonHeight: verticalScale(48),
  headerHeight: verticalScale(56),
  inputHeight: verticalScale(48),
} as const;

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPACING,
  RADIUS,
  FONT_SIZE,
  ICON_SIZE,
  SIZES,
};