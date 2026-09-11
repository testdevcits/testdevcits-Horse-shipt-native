import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: SPACING.md,
  },

  list: {
    paddingBottom: SPACING.sm, // Extra space for FAB
  },
  // Welcome Header
  welcomeHeader: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  welcomeSub: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});


export default styles