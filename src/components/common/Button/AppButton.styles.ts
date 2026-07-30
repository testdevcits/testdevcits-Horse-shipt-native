import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

export default StyleSheet.create({
  button: {
    height: 46,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },

  disabledButton: {
    backgroundColor: COLORS.buttonDisabled || '#CBD5E1',
    opacity: 0.7,
  },

  title: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
});