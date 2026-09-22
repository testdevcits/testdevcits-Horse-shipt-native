import { StyleSheet } from 'react-native';

import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 2,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  requiredStar: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  selector: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.inputBorder || COLORS.border,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  disabledSelector: {
    backgroundColor: COLORS.grey50,
    borderColor: COLORS.grey200,
  },
  leftIcon: {
    marginRight: SPACING.xs,
  },
  valueText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },
  disabledText: {
    color: COLORS.grey400,
  },
  errorBorder: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontFamily: FONTS.medium,
    marginLeft: 4,
  },

  /* Bottom Sheet Styles */
  sheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  sheetIndicator: {
    backgroundColor: COLORS.grey300,
    width: 40,
    height: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 80,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedOptionItem: {
    backgroundColor: COLORS.goldLightBg || COLORS.goldLightBg,
    borderBottomColor: COLORS.transparent,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconBox: {
    marginRight: SPACING.sm,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  optionSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldTintBox || COLORS.goldTintBox,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  emptyContainer: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
  },

  /* Fallback Modal Styles */
  fallbackOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay50,
  },
  fallbackSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
    paddingBottom: SPACING.xl,
  },
});

export default styles;
