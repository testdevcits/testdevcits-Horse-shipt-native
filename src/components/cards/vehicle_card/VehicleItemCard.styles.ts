import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  // Vehicle Card
  vehicleCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: COLORS.grey100,
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  statusPending: {
    backgroundColor: COLORS.goldLightBg,
  },
  statusPendingText: {
    color: COLORS.warning,
  },
  statusApproved: {
    backgroundColor: COLORS.greenLightBg,
  },
  statusApprovedText: {
    color: COLORS.greenSuccess,
  },
  statusRejected: {
    backgroundColor: COLORS.grey100,
  },
  statusRejectedText: {
    color: COLORS.error,
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
  },
  cardContent: {
    padding: SPACING.md,
  },
  vehicleNum: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  vehicleType: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  // 2x2 Grid Specs
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  specBox: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  specBoxTextCol: {
    flex: 1,
  },
  specLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  specValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },

  // Assigned Driver Box
  assignedDriverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  assignedDriverTextCol: {
    flex: 1,
  },
  assignedDriverTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.greenSuccess,
  },
  assignedDriverName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.secondaryDark,
  },

  // Warning Box
  driverWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  warningTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.warning,
  },
  warningSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.warning,
    marginTop: 1,
  },

  // Notes Box
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  notesTextCol: {
    flex: 1,
  },
  notesTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  notesText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },

  // Action Pills
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  actionPillExtraStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
});

export default styles;
