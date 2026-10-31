import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  questionIconBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  cardBody: {
    padding: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
    fontFamily: FONTS.medium,
  },
  emailHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  mailIconBox: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  emailValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  faqContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  faqContent: {
    flex: 1,
  },

  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  faqDescription: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: SPACING.sm,
    paddingRight: SPACING.md,
  },
});

export default styles;
