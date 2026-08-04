import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../../constants';

const styles = StyleSheet.create({
  tabSection: {
    gap: SPACING.md,
  },
  sectionHeaderTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  sectionHeaderSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  payoutAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  goldHorseIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.xs || 8,
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutTextCol: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  payoutSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider || '#E2E8F0',
    marginVertical: SPACING.md,
  },
  verifiedCard: {
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  checkSquare: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs || 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedTextCol: {
    flex: 1,
  },
  verifiedTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    marginBottom: 4,
  },
  verifiedSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    lineHeight: 18,
  },
  calloutBanner: {
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderRadius: RADIUS.xs || 8,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
  },
  calloutText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.primary || '#A06333',
  },
});

export default styles;
