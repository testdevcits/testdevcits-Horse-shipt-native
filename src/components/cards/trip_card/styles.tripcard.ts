import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS, FONT_SIZE } from '../../../constants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeHeader: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  shipmentCodeTag: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate400,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.greenBadgeBg,
    borderColor: COLORS.greenBadgeBorder,
  },
  statusBadgeCompleted: {
    backgroundColor: COLORS.goldCreamBg,
    borderColor: COLORS.goldBorder,
  },
  statusBadgePending: {
    backgroundColor: COLORS.amberLightBg,
    borderColor: COLORS.amberBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: { backgroundColor: COLORS.greenBadgeText },
  completedDot: { backgroundColor: COLORS.primary },
  pendingDot: { backgroundColor: COLORS.amberPrimary },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    letterSpacing: 0.4,
  },
  statusActiveText: {
    color: COLORS.greenBadgeText,
  },
  statusCompletedText: {
    color: COLORS.goldDarkText,
  },
  statusPendingText: {
    color: COLORS.amberWarning,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.slate50,
    borderColor: COLORS.grey200,
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: SPACING.sm2,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nodeDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenActive,
  },
  nodeDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  locationText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate900,
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: SPACING.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate600,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: SPACING.sm2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
  },
});

export default styles;
