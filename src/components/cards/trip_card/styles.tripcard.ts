import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS, FONT_SIZE } from '../../../constants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    padding: 14,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manifestTag: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate700,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  statusChipTransit: {
    backgroundColor: COLORS.amberLightBg,
    borderColor: COLORS.amberBorder,
  },
  statusChipCompleted: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
  },
  statusChipPending: {
    backgroundColor: COLORS.goldCreamBg,
    borderColor: COLORS.goldBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.greenPrimary,
  },
  statusDotTransit: {
    backgroundColor: COLORS.amberPrimary,
  },
  statusDotCompleted: {
    backgroundColor: COLORS.greenPrimary,
  },
  statusDotPending: {
    backgroundColor: COLORS.amberPrimary,
  },
  statusChipText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.greenPrimary,
    textTransform: 'capitalize',
  },
  statusChipTextTransit: {
    color: COLORS.goldDarkText,
  },
  statusChipTextCompleted: {
    color: COLORS.greenPrimary,
  },
  statusChipTextPending: {
    color: COLORS.goldDarkText,
  },
  priceBadge: {
    backgroundColor: COLORS.blueLightBg,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  priceAmountText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.bluePrimary,
  },
  priceStatusText: {
    fontFamily: FONTS.medium,
    fontSize: 9,
    color: COLORS.slate500,
    textTransform: 'uppercase',
  },

  // Route Section
  routeContainer: {
    backgroundColor: COLORS.slate50,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingTop: 2,
  },
  routeDotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.emeraldPrimary,
  },
  routeLineVertical: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.slate300,
    marginVertical: 2,
  },
  routeContent: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate900,
  },
  routeCoords: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.slate500,
    marginTop: 1,
  },

  // Horse Preview Row
  horseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldCreamBg,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    marginBottom: 10,
    gap: 10,
  },
  horseAvatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  horseDetails: {
    flex: 1,
  },
  horseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horseName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate900,
  },
  stallBadge: {
    backgroundColor: COLORS.goldPrimary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stallBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.white,
  },
  horseSubtext: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.slate600,
    marginTop: 2,
  },

  // Footer Vehicle & Notes Banner
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  vehicleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.slate700,
  },
  notesBanner: {
    backgroundColor: COLORS.amberLightBg,
    borderWidth: 1,
    borderColor: COLORS.amberBorder,
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notesText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.goldDarkText,
    flex: 1,
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
