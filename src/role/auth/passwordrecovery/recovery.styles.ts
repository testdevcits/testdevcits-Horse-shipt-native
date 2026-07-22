import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, SCREEN_HEIGHT, SCREEN_WIDTH, FONTS } from "../../../constants";

 const styles= StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headerImage: { width: SCREEN_WIDTH }, // Height set dynamically in component
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  keyboardView: { flex: 1, marginTop: -RADIUS.xl * 2 },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
  },
  
  logoIcon: { width: 90, height: 90,   marginTop: -45,alignSelf:"center" },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: 40, flexGrow: 1 },
  textHeader: { marginBottom: SPACING.xl, alignItems: 'center' },
  title: {
    fontSize: 28, fontFamily: FONTS.bold,
    color: COLORS.textPrimary,   marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14, fontFamily: FONTS.medium,
    color: COLORS.textSecondary, 
    lineHeight: 20, paddingHorizontal: SPACING.md,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  captchaLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 24, height: 24, borderRadius: 4,
    borderWidth: 2, borderColor: '#C1C1C1',
    marginRight: SPACING.md, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center'
  },
  checkboxActive: { borderColor: COLORS.goldPrimary },
  checkInner: { width: 12, height: 12, backgroundColor: COLORS.goldPrimary, borderRadius: 2 },
  captchaText: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  recaptchaLogo: { width: 30, height: 30 },
  submitBtn: { backgroundColor: COLORS.goldPrimary, height: 56, borderRadius: RADIUS.md },
});

export default styles