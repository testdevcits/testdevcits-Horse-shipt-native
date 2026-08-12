import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, SCREEN_WIDTH, FONTS, FONT_SIZE, SIZES } from "../../../constants";

const styles = StyleSheet.create({
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

  logoIcon: { width: 90, height: 90, marginTop: -45, alignSelf: "center" },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: SPACING.giant, flexGrow: 1 },
  textHeader: { marginBottom: SPACING.xl, alignItems: 'center' },
  title: {
    fontSize: FONT_SIZE.display, fontFamily: FONTS.bold,
    color: COLORS.textPrimary, marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md, fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: SPACING.xl, paddingHorizontal: SPACING.md,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidthThin,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  captchaLeft: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: SPACING.xxl, height: SPACING.xxl, borderRadius: RADIUS.xs,
    borderWidth: SIZES.borderWidthThick, borderColor: '#C1C1C1',
    marginRight: SPACING.md, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center'
  },
  checkboxActive: { borderColor: COLORS.primary },
  checkInner: { width: SPACING.md, height: SPACING.md, backgroundColor: COLORS.primary, borderRadius: RADIUS.xxs },
  captchaText: { fontSize: FONT_SIZE.md, fontFamily: FONTS.medium, color: COLORS.textPrimary },
  recaptchaLogo: { width: RADIUS.pill, height: RADIUS.pill },
  submitBtn: { backgroundColor: COLORS.primary, height: SIZES.headerHeight, borderRadius: RADIUS.md },
});

export default styles;