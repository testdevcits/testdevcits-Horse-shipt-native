import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
  },
  badgeNotConnectedBg: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldBorder,
  },
  badgeNotConnectedText: {
    color: COLORS.warning,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
  },
  badgeConnectedBg: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
  },
  badgeConnectedText: {
    color: COLORS.greenSuccess,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
  },
  cardSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },

  // Info Callout Box
  infoCalloutBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCalloutText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // Form Section
  formSection: {
    marginTop: SPACING.xs,
  },
  inputTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 2,
    marginBottom: SPACING.xs,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  linkIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  openBtn: {
    padding: 6,
  },

});

export default styles;
