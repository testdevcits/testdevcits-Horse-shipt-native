import { Platform, StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SIZES,
  SPACING,
} from '../../../../constants';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.25,
    borderTopRightRadius: RADIUS.xl * 1.25,
    paddingHorizontal: SPACING.lg2,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxxl : SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLORS.grey300,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs2,
    marginBottom: SPACING.xxs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  closeBtn: {
    width: SIZES.avatarSm,
    height: SIZES.avatarSm,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rolesList: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.grey50,
    borderWidth: SIZES.borderWidthThick,
    borderColor: COLORS.grey200,
  },
  roleCardActive: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.primary,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconBadgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: SPACING.xs2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.xxs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardTitleActive: {
    color: COLORS.primary,
  },
  tagPill: {
    paddingHorizontal: SPACING.xs2,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.grey200,
  },
  tagPillActive: {
    backgroundColor: COLORS.goldBorder,
  },
  tagText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
    color: COLORS.grey600,
  },
  tagTextActive: {
    color: COLORS.primary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  cardSubtitleActive: {
    color: COLORS.textPrimary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.circle,
    borderWidth: 2,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footerContainer: {
    marginTop: SPACING.xs,
  },
  confirmBtn: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
  },
});

export default styles;
