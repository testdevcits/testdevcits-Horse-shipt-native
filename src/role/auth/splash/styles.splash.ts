import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS } from "../../../constants";

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
    left: 20,
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
    borderRadius: 2,
  },
  truckContainer: {
    marginLeft: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  titleText: {
    fontFamily: FONTS.bold, // Applied DM Sans Bold
    fontSize: 28,
    color: COLORS.textSecondary,
    letterSpacing: 4,
  },
  subtitleText: {
    fontFamily: FONTS.semiBold, // Applied DM Sans Semi-Bold
    fontSize: FONT_SIZE.sm,

    color: COLORS.primary,
    letterSpacing: 3,
    marginTop: 4,
  },
  loader: {
    marginTop: 50,
  },
});

export default styles