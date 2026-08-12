import { Platform, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING, SCREEN_WIDTH, FONT_SIZE, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  backgroundImage: { width: SCREEN_WIDTH }, // height is dynamic
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  backBtn: { padding: SPACING.lg, marginTop: Platform.OS === 'ios' ? SPACING.giant : SPACING.xl },
  cardContainer: { flex: 1, marginTop: -RADIUS.xl * 2 },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
  },

  logoIcon: { width: 90, height: 90, marginTop: -45, alignSelf: "center" },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: SPACING.giant },
  formContainer: { gap: SPACING.md },
  title: { fontSize: FONT_SIZE.title, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.xs },
  stepperContainer: { flexDirection: 'row', gap: SPACING.xs2, marginBottom: SPACING.lg },
  stepLine: { height: 4, width: 24, borderRadius: RADIUS.xxs },
  actionBtn: { backgroundColor: COLORS.primary, height: 54, borderRadius: RADIUS.md, marginTop: SPACING.lg },
  inputLabel: { fontFamily: FONTS.medium, fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginBottom: -8 },
  otpWrapper: { position: 'relative', marginTop: SPACING.sm },
  hiddenOtpInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  otpBoxContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: { width: 45, height: 50, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.divider, backgroundColor: COLORS.grey50, justifyContent: 'center', alignItems: 'center' },
  otpBoxFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.white, borderWidth: 1.5 },
  otpBoxFilled: { borderColor: COLORS.grey300, backgroundColor: COLORS.white },
  otpText: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  meterTrack: { height: 4, backgroundColor: COLORS.grey200, borderRadius: RADIUS.xxs, marginTop: -4 },
  meterFill: { height: '100%', borderRadius: RADIUS.xxs },
  checklist: { gap: SPACING.sm, marginTop: SPACING.sm },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  checkText: { fontSize: FONT_SIZE.md, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  successIconWrapper: { alignItems: 'center', marginVertical: SPACING.xl },
  successIcon: { width: 80, height: 80, tintColor: COLORS.primary },
  successTitle: { fontSize: FONT_SIZE.title, fontFamily: FONTS.bold, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 30 },
  successSub: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.md, paddingHorizontal: SPACING.lg },

  subtitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  errorText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.xs,
  },

  resendText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  resendLink: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textDecorationLine: 'none',
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  roleBadgeLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  roleBadgeValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  changeTextLink: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default styles