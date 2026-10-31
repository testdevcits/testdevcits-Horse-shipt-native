import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../../../constants';

const styles = StyleSheet.create({
  // Quote Card
  quoteCard: {
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
    height: 280,
    width: '100%',
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  horseBanner: {
    width: '100%',
    height: '100%',
  },
  statusPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  badgeInTransit: {
    backgroundColor: COLORS.greenLightBg,
  },
  badgeInTransitText: {
    color: COLORS.greenSuccess,
  },
  badgeAssigned: {
    backgroundColor: COLORS.goldLightBg,
  },
  badgeAssignedText: {
    color: COLORS.warning,
  },
  badgeDelivered: {
    backgroundColor: COLORS.grey100,
  },
  badgeDeliveredText: {
    color: COLORS.info,
  },
  badgeCancelled: {
    backgroundColor: COLORS.grey100,
  },
  badgeCancelledText: {
    color: COLORS.error,
  },
  statusPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
  },
  cardBody: {
    padding: SPACING.md,
  },
  shipmentCode: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  cardSubText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  priceLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  priceValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // Specs 2x2 Grid
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
  specTextCol: {
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

  // Notes Box
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    flex: 1,
    lineHeight: 18,
  },

  // Cancel Notice Container
  cancelNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  cancelNoticeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    flex: 1,
  },

  // Action Buttons
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  viewContractBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    gap: 6,
  },
  viewContractBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    gap: 6,
  },
  deleteBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
  },

  // Vehicle Assignment Styles
  assignedVehicleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  assignedVehicleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
    flex: 1,
    lineHeight: 18,
  },
  assignVehicleBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    gap: 6,
  },
  assignVehicleBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
  },
  assignedVehicleCard: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 6,
  },
  vehicleTitleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  vehicleInfoGrid: {
    gap: 4,
  },
  vehicleDetailText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldDarkText,
    lineHeight: 16,
  },
  boldLabel: {
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
});
export default styles;
