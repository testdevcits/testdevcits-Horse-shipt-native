import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONTS } from "../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headerImage: { width: SCREEN_WIDTH },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  backBtn: { padding: SPACING.lg, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  keyboardView: { flex: 1, marginTop: -RADIUS.xl * 2 },
  contentCard: {
    flex: 1, backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5, borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, elevation: 10,
  },
  logoOuterRing: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(163, 127, 61, 0.20)',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: -45,
    borderWidth: 1, borderColor: COLORS.goldBorder, zIndex: 10,
  },
  logoInnerRing: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary,
  },
  logoIcon: { width: 40, height: 40, tintColor: COLORS.goldDarkText },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 40, flexGrow: 1 },
  textHeader: { marginBottom: SPACING.xl, alignItems: 'center' },
  title: { fontSize: 30, fontFamily: FONTS.bold, color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  // OTP UI
  otpWrapper: { marginTop: SPACING.lg },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  boxesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: {
    width: (SCREEN_WIDTH - 100) / 6, height: 55, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.divider, backgroundColor: COLORS.grey50,
    justifyContent: 'center', alignItems: 'center'
  },
  activeBox: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: COLORS.white },
  filledBox: { borderColor: COLORS.grey400, backgroundColor: COLORS.white },
  errorBox: { borderColor: COLORS.error },
  otpText: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },

  errorText: { color: COLORS.error, fontSize: 13, fontFamily: FONTS.medium, marginTop: 12, textAlign: 'center' },

  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl, gap: 6 },
  resendLabel: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  resendLink: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.primary },

  submitBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: RADIUS.md, marginTop: SPACING.xl },
});
export default styles