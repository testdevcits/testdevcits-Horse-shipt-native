import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, SPACING, RADIUS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    height: 120,
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  linesClipContainer: {
    position: 'absolute',
    left: SPACING.xl,
    width: 100,
    height: 80,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  speedLinesContainer: {
    width: 200,
    flexDirection: 'column',
    opacity: 0.6,
  },
  speedLine: {
    height: 3,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.xxs,
  },
  truckContainer: {
    marginLeft: SPACING.giant,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: SPACING.giant,
  },
  titleText: {
    fontFamily: FONTS.bold, // Applied DM Sans Bold
    fontSize: FONT_SIZE.display,
    color: COLORS.textSecondary,
    letterSpacing: 4,
  },
  subtitleText: {
    fontFamily: FONTS.semiBold, // Applied DM Sans Semi-Bold
    fontSize: FONT_SIZE.sm,

    color: COLORS.primary,
    letterSpacing: 3,
    marginTop: SPACING.xs,
  },
  loader: {
    marginTop: RADIUS.circle,
  },
});

export default styles;