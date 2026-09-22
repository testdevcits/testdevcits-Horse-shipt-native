import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../../../constants';
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay55,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // Header Banner
  headerBanner: {
    backgroundColor: COLORS.saddleBrown,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  headerSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.whiteOverlay85,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.overlay25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Body Content
  bodyContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  loaderBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Notice Box
  noticeBox: {
    backgroundColor: COLORS.warmCream,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.saddleBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  noticeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.darkBrown,
    lineHeight: 18,
  },

  // Label Row
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  asterisk: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },

  // Textarea Input
  textAreaContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  textAreaContainerError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.redLightBg,
  },
  textAreaInput: {
    height: 120,
    textAlignVertical: 'top',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    paddingBottom: 20,
  },
  counterText: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.sm,
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },

  // Progress Bar
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.slate200,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.brandBrown,
    borderRadius: 3,
  },
  hintText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  // Tips Box
  tipsBox: {
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brandBrown,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    gap: 6,
  },
  tipItem: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 18,
  },

  // Buttons
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  submitBtnText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  cancelLink: {
    alignSelf: 'center',
    paddingVertical: SPACING.xs,
  },
  cancelLinkText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Pending Question State Styles
  pendingQuestionCard: {
    backgroundColor: COLORS.slate50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  pendingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  pendingIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingHeaderLabel: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
  pendingQuestionText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
    lineHeight: 20,
  },
  pendingDivider: {
    height: 1,
    backgroundColor: COLORS.slate200,
    marginVertical: SPACING.xs,
  },
  pendingAskedDateText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Status Card
  statusCard: {
    backgroundColor: COLORS.amberLightBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statusIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHeaderLabel: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.amberWarning,
    letterSpacing: 0.5,
  },
  statusMainTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.amberWarning,
    marginTop: 2,
  },
  typingBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.amberLightBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderBottomLeftRadius: 3,
    alignSelf: 'flex-start',
    marginVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.amberPrimary,
  },
  statusSubText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.amberWarning,
    marginTop: 2,
  },

  // Customer Response Card Styles
  responseCard: {
    backgroundColor: COLORS.emeraldLightBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  responseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  responseLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  responseIconSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.emeraldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseHeaderLabel: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
    letterSpacing: 0.5,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  answeredBadgeText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
  },
  responseText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
    lineHeight: 20,
  },
  responseDivider: {
    height: 1,
    backgroundColor: COLORS.emeraldBorder,
    marginVertical: SPACING.xs,
  },
  responseDateText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark,
    marginTop: 2,
  },

  // Pending Footer Close Action
  pendingFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    paddingTop: SPACING.md,
    alignItems: 'flex-end',
  },
  pendingCloseBtn: {
    backgroundColor: COLORS.divider,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  pendingCloseBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

export default styles;
