import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../../../constants';

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  // Top Card
  topCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warmBeige,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  topCardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    backgroundColor: COLORS.brandBrownLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round || 999,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.amberPrimary,
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  timelineAddress: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldCreamBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginTop: 4,
    gap: 4,
  },
  dateChipText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.warmBeige,
    marginLeft: 11,
    marginVertical: 4,
  },

  // Actions
  actionRow: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.zinc800,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  primaryActionBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  chatActionBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  chatActionBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  secondaryActionBtn: {
    backgroundColor: COLORS.zinc100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  secondaryActionBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
  },

  // Details Card
  detailsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warmBeige,
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.creamSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmBeige,
  },
  detailsHeaderTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  detailsBody: {
    padding: SPACING.md,
  },

  // Summary Box
  summaryBox: {
    backgroundColor: COLORS.zinc50,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  summaryBoxHeader: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Horse Card
  horseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.warmBeige,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  horseCardBadgeHeader: {
    backgroundColor: COLORS.warmSand,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warmBeige,
  },
  horseCardBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
  horseCardBody: {
    padding: SPACING.md,
  },
  horseSpecGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.sm,
    columnGap: SPACING.md,
    marginBottom: SPACING.md,
  },
  specItem: {
    width: '46%',
  },
  specLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  specValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  infoQuoteBox: {
    backgroundColor: COLORS.goldCreamBg,
    padding: SPACING.md,
    borderRadius: RADIUS.xs,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  infoQuoteTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginBottom: 2,
  },
  infoQuoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // Logs
  logSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  logSectionHeader: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  logCardItem: {
    backgroundColor: COLORS.zinc50,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: SPACING.xs,
  },
  logCardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logUserNameText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  logTimeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  logBodyText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey800,
    lineHeight: 16,
  },

  // Documents
  documentsContainer: {
    marginTop: SPACING.xs,
  },
  documentsHeaderTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  editDocsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editDocsText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
  },
  docListGrid: {
    gap: SPACING.xs,
  },
  docCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldCreamBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    gap: SPACING.sm,
  },
  docCardPillTextCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },
  emptyDocsText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },

  // Footer Actions
  footerActionsRow: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  publishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  publishButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  trackButton: {
    backgroundColor: COLORS.zinc900,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 8,
  },
  trackButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
});

export default styles;
