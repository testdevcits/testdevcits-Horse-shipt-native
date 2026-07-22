import { Platform, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING,SCREEN_WIDTH } from "../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  backgroundImage: { width: SCREEN_WIDTH }, // height is dynamic
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  backBtn: { padding: SPACING.lg, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  cardContainer: { flex: 1, marginTop: -RADIUS.xl * 2 },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
  },
   
  logoIcon: { width: 90, height: 90, marginTop: -45, alignSelf: "center" },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 40 },
  formContainer: { gap: SPACING.md },
  title: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: 4 },
  stepperContainer: { flexDirection: 'row', gap: 6, marginBottom: SPACING.lg },
  stepLine: { height: 4, width: 24, borderRadius: 2 },
  actionBtn: { backgroundColor: COLORS.goldPrimary, height: 54, borderRadius: RADIUS.md, marginTop: SPACING.lg },
  inputLabel: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginBottom: -8 },
  otpWrapper: { position: 'relative', marginTop: 8 },
  hiddenOtpInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  otpBoxContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: { width: 45, height: 50, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.divider, backgroundColor: COLORS.grey50, justifyContent: 'center', alignItems: 'center' },
  otpBoxFocused: { borderColor: COLORS.goldPrimary, backgroundColor: COLORS.white, borderWidth: 1.5 },
  otpBoxFilled: { borderColor: COLORS.grey300, backgroundColor: COLORS.white },
  otpText: { fontSize: 20, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  meterTrack: { height: 4, backgroundColor: COLORS.grey200, borderRadius: 2, marginTop: -4 },
  meterFill: { height: '100%', borderRadius: 2 },
  checklist: { gap: 8, marginTop: SPACING.sm },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  successIconWrapper: { alignItems: 'center', marginVertical: SPACING.xl },
  successIcon: { width: 80, height: 80, tintColor: COLORS.goldPrimary },
  successTitle: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 30 },
  successSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.md, paddingHorizontal: SPACING.lg },

  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    // Note: If using in Step 2 (OTP), center alignment looks more premium
    // textAlign: 'center', 
  },
  
  errorText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginTop: SPACING.xs,
    // Adds a slight margin to separate from the input/otp box
    marginLeft: 4, 
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    gap: 4, // Modern spacing
  },

  resendText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  resendLink: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    // Adds a subtle underline or decoration if you prefer, 
    // but bold gold is usually enough for premium apps
    textDecorationLine: 'none', 
  },
});

export default styles