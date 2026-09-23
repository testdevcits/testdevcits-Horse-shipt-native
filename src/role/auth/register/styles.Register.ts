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
    backgroundColor: COLORS.overlay15,
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
    backgroundColor: COLORS.goldPrimaryOverlay25,
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
    backgroundColor: COLORS.gray800, // Dark navy/black
    height: 52,
    borderRadius: RADIUS.round,
  },
  googleBtn: {
    backgroundColor: COLORS.gray100, // Light gray
    height: 52,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookBtn: {
    backgroundColor: COLORS.facebookBlue, // Facebook Blue
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
  roleSelectionBlock: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  roleSelectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.8,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.grey100 || '#F3F4F6',
    borderRadius: RADIUS.md,
    padding: 4,
    justifyContent: 'space-between',
  },
  roleTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  roleTabBtnActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  roleTabBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  roleTabBtnTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
});

export default styles;
