import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../../constants';

const styles = StyleSheet.create({
  tabSection: {
    gap: SPACING.md,
  },
  goldFilledBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xs || 8,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    alignSelf: "flex-end"
  },
  goldFilledBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    padding: SPACING.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  iconEditBtn: {
    padding: SPACING.xs,
    borderRadius: RADIUS.xs || 6,
    backgroundColor: COLORS.grey100 || '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100 || '#F1F5F9',
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary || '#1E293B',
  },
  infoVal: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
  },
  reviewsSection: {
    marginTop: SPACING.xs,
  },
  reviewsSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    marginBottom: SPACING.sm,
  },
  reviewsScroll: {
    gap: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  reviewCard: {
    width: 260,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    padding: SPACING.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  reviewText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary || '#1E293B',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  reviewerName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  reviewDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
  },
  showMoreBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.grey100 || '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.divider || '#CBD5E1',
    borderRadius: RADIUS.xs || 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
  showMoreBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary || '#1E293B',
  },
  emptyReviewsCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EEDCBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  emptyReviewsTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    marginBottom: 4,
  },
  emptyReviewsSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md || 12,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  logoutBtnText: {
    color: COLORS.error || '#EF4444',
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default styles;
