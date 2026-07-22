// import { StyleSheet } from "react-native";
// import { COLORS, FONT_SIZE, FONTS, SPACING } from "../../../constants";

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background, // #F8FAFC
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//     justifyContent: 'center',
//   },
//   headerContainer: {
//     alignItems: 'flex-start',
//     marginBottom: 32,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.primaryDark + '10', // Soft primary tint
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 16,
//   },
//   badgeText: {
//     fontFamily: FONTS.bold,
//     fontSize: 10,
//     color: COLORS.primaryDark,
//     marginLeft: 6,
//     letterSpacing: 1,
//   },
//   welcomeText: {
//     fontFamily: FONTS.bold,
//     fontSize: 32,
//     color: COLORS.primaryDark,
//     lineHeight: 38,
//   },
//   descriptionText: {
//     fontFamily: FONTS.regular,
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginTop: 8,
//     lineHeight: 20,
//   },
//   formContainer: {
//     width: '100%',
//   },
//   forgotPasswordContainer: {
//     alignSelf: 'flex-end',
//     marginVertical: 12,
//   },
//   forgotPasswordText: {
//     fontFamily: FONTS.semiBold,
//     fontSize: 14,
//     color: COLORS.primary,
//   },
//   signInButton: {
//     marginTop: 16,
//     // backgroundColor: COLORS.buttonPrimary,
//     height: 52,
//     borderRadius: 8,
//   },
//   footerContainer: {
//     marginTop: 48,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: COLORS.surface, // Clean contrast container
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     alignItems: 'center',
//   },
//   footerTitle: {
//     fontFamily: FONTS.semiBold,
//     fontSize: 13,
//     color: COLORS.textPrimary,
//     marginBottom: 4,
//   },
//   footerSubtitle: {
//     fontFamily: FONTS.regular,
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   signupfooterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: SPACING.xxl,
//     marginBottom: SPACING.lg,
//   },
//   footerText: {
//     fontSize: FONT_SIZE.md,
//     color: COLORS.textSecondary,
//   },
//   footerLink: {
//     fontSize: FONT_SIZE.md,
//     fontFamily: FONTS.semiBold,
//     color: COLORS.goldPrimary, // Using your brand gold color
//   },
// });
// export default styles




import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONTS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    // height is controlled dynamically in the component (e.g., SCREEN_HEIGHT * 0.45 or 0.20)
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)', // Slightly darker for better contrast
  },
  keyboardView: {
    flex: 1,
    marginTop: -RADIUS.xl * 2, // Creates the overlap effect
  },
  contentCard: {
    flex: 1, // Crucial: Allows card to take up 85% height when header shrinks
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    // High-end soft shadow for the card
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  // Logo Seal Styles (Overlapping the top edge)

  logoIcon: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: -45,
    // Note: removed negative margin from here, handled by OuterRing
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexGrow: 1,
  },
  textHeader: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold, // Used proper constant
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium, // Used proper constant
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  // Form Helpers
  utilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6, // Softer rounded corners look more modern
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    marginRight: 10,
    backgroundColor: COLORS.white,
    // Essential for centering the Lucide Icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.goldPrimary,
    borderColor: COLORS.goldPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5, // Larger touch target
  },
  utilText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold, // Matching your premium look
    color: COLORS.textPrimary,
  },
  signInBtn: {
    marginTop: SPACING.lg,
    // Custom Shadow for Button

  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  footerLink: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});

export default styles;