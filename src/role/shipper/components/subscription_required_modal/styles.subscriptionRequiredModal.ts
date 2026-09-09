import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from "../../../../constants";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // HEADER BANNER
  headerBanner: {
    backgroundColor: COLORS.brandBrown,
    padding: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  requiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  requiredBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  trialPillRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  trialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    marginBottom: 4,
  },
  trialPillText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.amberLightBg,
  },
  trialSubText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  priceTagBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTagAmount: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    lineHeight: 24,
  },
  priceTagInterval: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: 'rgba(255, 255, 255, 0.85)',
  },

  // BODY CONTENT
  bodyContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },

  // STEP 2: ADD CARD STYLES
  addCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  addCardHeaderTitle: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  addCardSubTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redLightBg,
    borderColor: COLORS.redBorder,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  errorBannerText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.redPrimary,
    flex: 1,
  },
  stripeCardContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  stripeCardField: {
    width: '100%',
    height: 44,
  },
  securityNoteBox: {
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brandBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  securityNoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
  backBtn: {
    alignSelf: 'center',
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  backBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },

  // STEP 1: INCLUDED SECTION
  includedSection: {
    backgroundColor: COLORS.slate50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeaderLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    letterSpacing: 0.8,
    marginBottom: SPACING.xs + 2,
  },
  checkListContainer: {
    gap: SPACING.xs + 2,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  checkIconSquare: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkItemText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // PLAN TABS
  planTabsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  planTabCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  planTabCardActive: {
    borderColor: COLORS.brandBrown,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.5,
  },
  planTabName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  planTabPrice: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  planTabTextActive: {
    color: COLORS.goldDarkText,
  },

  // PAYMENT METHOD WARNING
  cardWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.amberLightBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.amberBorder,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  cardWarningIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWarningTextCol: {
    flex: 1,
  },
  cardWarningTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.amberWarning,
  },
  cardWarningSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.amberWarning,
    marginTop: 1,
  },

  // TRIAL NOTE
  trialNoteBox: {
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brandBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  trialNoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },
  trialNoteBold: {
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },

  // ACTION BUTTON
  actionBtn: {
    width: '100%',
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  footerSubText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});


export default styles