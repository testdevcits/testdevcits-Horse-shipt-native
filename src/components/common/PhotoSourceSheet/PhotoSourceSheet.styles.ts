import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONTS } from '../../../constants';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
  },
  indicator: {
    backgroundColor: COLORS.grey300,
    width: 40,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  optionsContainer: {
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey200,
    marginHorizontal: SPACING.lg,
  },
  cancelBtn: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    borderRadius: RADIUS.lg,
  },
  cancelText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
});

export default styles;
