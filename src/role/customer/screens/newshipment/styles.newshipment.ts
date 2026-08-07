import { StyleSheet, Dimensions } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from "../../../../constants";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },


  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 6
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.grey200,
    marginBottom: 6,
  },
  stepBarActive: { backgroundColor: COLORS.primary },
  stepBarCurrent: { backgroundColor: COLORS.primary, height: 4 },
  stepLabelText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey400,
    textAlign: 'center',
  },
  stepLabelTextActive: {
    color: COLORS.grey700,
    fontFamily: FONTS.semiBold,
  },
  stepLabelTextCurrent: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  content: { flex: 1, padding: SPACING.lg },

  // Form Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.xl
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.goldDarkText,
    marginBottom: SPACING.sm
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey300,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.grey100,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },

  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: SPACING.md
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnPrev: { backgroundColor: COLORS.grey100 },
  btnNext: { backgroundColor: COLORS.primary },
  btnText: { fontFamily: FONTS.bold, color: COLORS.white },
  btnTextPrev: { color: COLORS.textSecondary },

  // Summary styles
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md
  }
});

export default styles;