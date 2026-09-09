import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SPACING,
} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4, // Slightly shorter than welcome to fit more buttons
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -RADIUS.xl * 2,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
  },
  logoOuterRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(163, 127, 61, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -50,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  logoInnerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginTop: -50,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingTop: SPACING.xl,
  },
  textSection: {
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.display,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    lineHeight: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  buttonContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: RADIUS.md,
  },
  dividerRow: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerText: {
    color: COLORS.grey600,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.lg,
  },
  // Social Button Styles
  appleBtn: {
    backgroundColor: '#1F2937', // Dark navy/black
    height: 52,
    borderRadius: RADIUS.round,
  },
  googleBtn: {
    backgroundColor: '#F3F4F6', // Light gray
    height: 52,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  facebookBtn: {
    backgroundColor: '#3B5998', // Facebook Blue
    height: 52,
    borderRadius: RADIUS.round,
  },
  whiteBtnText: {
    color: COLORS.white,
  },
  darkBtnText: {
    color: COLORS.textPrimary,
  },
  loginRow: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.grey600,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});

export default styles;
