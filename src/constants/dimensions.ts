// dimensions.ts
import { Dimensions } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

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
  s20: moderateScale(20),
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
