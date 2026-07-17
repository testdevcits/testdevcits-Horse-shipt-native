import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, SPACING } from "../../../constants";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // #F8FAFC
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark + '10', // Soft primary tint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primaryDark,
    marginLeft: 6,
    letterSpacing: 1,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.primaryDark,
    lineHeight: 38,
  },
  descriptionText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginVertical: 12,
  },
  forgotPasswordText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  signInButton: {
    marginTop: 16,
    // backgroundColor: COLORS.buttonPrimary,
    height: 52,
    borderRadius: 8,
  },
  footerContainer: {
    marginTop: 48,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surface, // Clean contrast container
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  footerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  footerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  signupfooterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.goldPrimary, // Using your brand gold color
  },
});
export default styles