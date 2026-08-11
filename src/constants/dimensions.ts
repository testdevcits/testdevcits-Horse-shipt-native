// dimensions.ts
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';


const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const SPACING = {
  xxs: 2,
  xs: 4,
  xs2: 6,
  sm: 8,
  sm2: 10,
  md: 12,
  md2: 14,
  lg: 16,
  lg2: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 40,
  huge: 48,
  massive: 60,
} as const;

export const RADIUS = {
  xxs: 2,
  xs: 4,
  xs2: 6,
  sm: 8,
  sm2: 10,
  md: 12,
  md2: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 30,
  circle: 50,
  round: 999,
} as const;

// export const FONT_SIZE = {
//   xxs: 8,
//   mini: 9,
//   xs: 10,
//   sm: 12,
//   md: 14,
//   lg: 16,
//   xl: 18,
//   xxl: 20,
//   title: 22,
//   heading: 24,
//   display: 28,
//   hero: 30,
//   giant: 32,
// } as const;




export const FONT_SIZE = {
  xxs: RFValue(8),
  mini: RFValue(9),
  xs: RFValue(10),
  sm: RFValue(12),
  md: RFValue(14),
  lg: RFValue(16),
  xl: RFValue(18),
  xxl: RFValue(20),
  title: RFValue(22),
  heading: RFValue(24),
  display: RFValue(28),
  hero: RFValue(30),
  giant: RFValue(32),
} as const;

export const ICON_SIZE = {
  mini: 12,
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
  xxl: 40,
  giant: 48,
} as const;

export const SIZES = {
  borderWidthThin: 1,
  borderWidthThick: 2,
  avatarSm: 32,
  avatarMd: 40,
  avatarMd44: 44,
  avatarLg: 48,
  avatar54: 54,
  avatarXl: 64,
  iconHeaderBg: 68,
  controlBtn: 44,
  iconActionBtn: 36,
  markerCircle: 28,
  truckMarker: 36,
  timelinePoint: 24,
  timelineLine: 18,
  handleBar: 36,
  handleBarHeight: 4,
  buttonHeight: 48,
  headerHeight: 56,
  inputHeight: 48,
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
