import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from "../../../constants";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.57,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)', // Using a slight tint
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -RADIUS.xl * 2, // Smooth overlap
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    // Optional: Add shadow for depth
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginTop: -50, // Half of height to center on the edge
    borderRadius: RADIUS.md,
  },
  textSection: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZE.heading, // 32
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'left',
  },
  description: {
    fontSize: FONT_SIZE.md, // 16
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: SPACING.xxxl, // Using token (32) instead of 40 for consistency
    gap: SPACING.lg,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  loginText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.grey600,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: FONTS.bold, // Bold makes it look more clickable
  },
});

export default styles;