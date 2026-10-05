import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.giant,
    gap: SPACING.md,
  },

  /* Hero Summary Card */
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: SPACING.xs,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  summaryMainCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  summaryRatingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.goldCreamBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  summaryRatingText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    lineHeight: 36,
  },
  ratingMetaCol: {
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  summarySubText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLightBg,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    paddingHorizontal: SPACING.sm2,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  badgePillText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldBadgeText,
    marginLeft: 4,
    letterSpacing: 0.3,
  },

  /* Filter Scroll Row */
  filterScroll: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  filterChipActive: {
    backgroundColor: COLORS.brandBrown,
    borderColor: COLORS.brandBrown,
  },
  filterChipText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  reviewCountBadge: {
    backgroundColor: COLORS.amberLightBg,
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  reviewCountText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },

  /* Review Item Card */
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  reviewerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: COLORS.brandBrown,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.brandBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  reviewerInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  reviewerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginTop: 1,
  },
  starsContainer: {
    alignItems: 'flex-end',
  },

  /* Review Content */
  reviewText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.grey700,
    lineHeight: 22,
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs2,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.greenActive,
  },
  sourceBadge: {
    backgroundColor: COLORS.divider,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  sourceBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  /* Empty State */
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
});

export default styles;
