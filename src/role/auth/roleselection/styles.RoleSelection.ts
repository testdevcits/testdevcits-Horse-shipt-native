import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from "../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headerImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.28 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -RADIUS.xl,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
  },

  // Logo Styles
  logoIcon: { width: 80, height: 80, marginTop: -32, alignSelf: 'center' },

  scrollContent: { paddingTop: SPACING.md, paddingBottom: 40 },
  headerTextSection: { alignItems: 'center', marginBottom: SPACING.lg },
  title: {
    fontSize: FONT_SIZE.heading,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },

  // Card Styles
  cardsContainer: { gap: SPACING.sm, marginBottom: SPACING.lg },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    // Premium Shadow for active card
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  roleTextContainer: { flex: 1, marginLeft: SPACING.md },
  roleTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  roleDesc: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Custom Radio UI
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: COLORS.white },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },

  textWhite: { color: COLORS.white },
  textLightGold: { color: COLORS.goldLightBg },

  continueBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  footer: { marginTop: SPACING.lg, alignItems: 'center' },
  footerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  contactLink: { color: COLORS.primary, fontFamily: FONTS.bold },
});


export default styles;