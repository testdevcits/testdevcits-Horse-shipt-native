import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../../../constants';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.slateOverlay65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  alertIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.brandBrownLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  planImpactBox: {
    backgroundColor: COLORS.goldCreamBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  planImpactTitle: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  planImpactSub: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  asterisk: {
    color: COLORS.error,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
    marginBottom: SPACING.md,
  },
  reasonBtn: {
    width: '48.5%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
  },
  reasonBtnSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.goldLightBg,
  },
  reasonBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  reasonBtnTextSelected: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  otherInputWrapper: {
    marginBottom: SPACING.md,
  },
  otherInputLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  otherTextInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  checkboxBox: {
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  keepBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnDisabled: {
    backgroundColor: COLORS.redBorder,
    opacity: 0.7,
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  cancelBtnTextDisabled: {
    color: COLORS.white,
  },
});

export default styles;
