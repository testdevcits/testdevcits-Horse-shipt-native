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
  notificationsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    padding: SPACING.md,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  goldSquareIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.xs || 8,
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderTextCol: {
    flex: 1,
  },
  subHeaderTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider || '#E2E8F0',
    marginVertical: SPACING.md,
  },
  notifColHeadersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  notifChannelText: {
    width: 40,
    textAlign: 'center',
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary || '#64748B',
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider || '#E2E8F0',
  },
  notifTextCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  notifItemTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  notifItemDesc: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
  },
  notifCheckboxesCol: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  notifCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifCheckboxActive: {
    backgroundColor: COLORS.primary || '#A06333',
    borderColor: COLORS.primary || '#A06333',
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
