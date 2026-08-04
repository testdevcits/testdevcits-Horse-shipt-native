import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONTS } from "../../../constants";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headerImage: { width: SCREEN_WIDTH },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  backBtn: { padding: 20, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  keyboardView: { flex: 1, marginTop: -RADIUS.xl * 2 },
  contentCard: {
    flex: 1, // Crucial for 85% height logic
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  logoOuterRing: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(163, 127, 61, 0.20)',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
    marginTop: -45, borderWidth: 1, borderColor: COLORS.goldBorder, zIndex: 10,
  },
  logoInnerRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  logoIcon: { width: 40, height: 40, tintColor: COLORS.goldDarkText },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 40, flexGrow: 1 },
  textHeader: { marginBottom: SPACING.xl, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: FONTS.bold, color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: 10 },
  form: { gap: SPACING.sm },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
});