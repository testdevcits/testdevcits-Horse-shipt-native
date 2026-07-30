import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

export default StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },

  label: {
    marginBottom: 4,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  leftIconContainer: {
    marginRight: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    height: 46,
    backgroundColor: COLORS.white,
  },

  focusedBorder: {
    borderColor: COLORS.primary,
  },

  errorBorder: {
    borderColor: COLORS.error,
  },

  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  error: {
    marginTop: 2,
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
  },

  disabledBorder: {
    backgroundColor: COLORS.grey100,
    borderColor: COLORS.grey300,
  },
});