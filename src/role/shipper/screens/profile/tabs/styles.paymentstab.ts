import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../../constants';

const styles = StyleSheet.create({
  tabSection: {
    gap: SPACING.sm,
  },
  sectionHeaderTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  sectionHeaderSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  redAlertBanner: {
    backgroundColor: COLORS.redLightBg,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
    borderRadius: RADIUS.xs || 6,
    padding: SPACING.md - 2,
    marginBottom: SPACING.xs,
  },
  redAlertText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.redPrimary,
  },
  payoutMainCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  payoutAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
  },
  goldHorseIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  payoutTextCol: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: FONT_SIZE.sm + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  payoutSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notConnectedBadge: {
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
    backgroundColor: COLORS.amberLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  notConnectedBadgeText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.amberWarning,
  },
  connectedBadge: {
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    backgroundColor: COLORS.emeraldLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  connectedBadgeText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },

  // Stepper Bar
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  stepperNode: {
    alignItems: 'center',
  },
  stepperCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  stepperDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandBrown,
  },
  stepperLabelActive: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginTop: 4,
  },
  stepperCircleInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.slate300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  stepperLabelInactive: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.slate400,
    marginTop: 4,
  },
  stepperLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.slate200,
    marginHorizontal: 4,
    marginBottom: 16,
  },

  payoutActionSection: {
    padding: SPACING.md,
  },
  connectDescription: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  setupPayoutBtn: {
    backgroundColor: COLORS.brandBrown,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: SPACING.md,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  setupPayoutBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
  },

  verifiedCard: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  checkSquare: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs || 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedTextCol: {
    flex: 1,
  },
  verifiedTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  verifiedSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  encryptionFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.amberBorder,
  },
  encryptionFooterText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    letterSpacing: 0.6,
    flex: 1,
  },
});

export default styles;
