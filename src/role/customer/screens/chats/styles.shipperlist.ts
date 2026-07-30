import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from '../../../../constants';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  screenTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  filterContainer: {
    alignSelf: 'flex-start',
    width: 130,
    marginTop: SPACING.xs,
  },

  miniSelect: {
    height: 36,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
    marginBottom: 0,
  },

  list: { paddingBottom: 100 },
});

export default styles;