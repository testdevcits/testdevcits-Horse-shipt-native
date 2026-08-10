import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, SIZES } from "../../../../constants";


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  trackingCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextWrapper: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  cardHeaderSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.lightGrey,
    marginTop: SPACING.xxs,
  },
  highlightInfoBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md2,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  highlightLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  driverName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  coordinateText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.grey400,
  },
  goldButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  autoTrackActiveButton: {
    backgroundColor: '#374151',
  },
  btnIcon: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
  },
  tipLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs2,
  },
  tipDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.lightGrey,
    lineHeight: SPACING.lg2,
  },
});

export default styles;