import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Welcome Header
  welcomeHeader: {
    marginBottom: SPACING.md,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  welcomeSub: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statTextCol: {
    flex: 1,
  },
  statTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statCount: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginTop: 4,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // New Opportunities Card
  opportunitiesCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldPrimary,
  },
  sectionSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  // Filter Row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  filterLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginRight: 4,
  },
  filterPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterPillActive: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldPrimary,
  },
  filterPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.goldDarkText,
    fontFamily: FONTS.bold,
  },
  filterIconBtn: {
    padding: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },

  // View Toggle Row
  viewToggleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  viewToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    gap: 6,
  },
  viewToggleBtnActive: {
    backgroundColor: COLORS.goldPrimary,
  },
  viewToggleBtnInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldPrimary,
  },
  viewToggleBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldPrimary,
  },
  viewToggleBtnTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  // Current Shipments Section
  currentShipmentsSection: {
    gap: SPACING.sm,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Shipment Card
  shipmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    gap: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: SPACING.xs,
  },
  cardImageContainer: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    backgroundColor: COLORS.grey100,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  cardInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  horseTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  horseSpecs: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  shipmentCode: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginVertical: 3,
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  infoMetaText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },

  // Right Action & Timeline Col
  cardRightCol: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  externalActionBtn: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCol: {
    alignItems: 'center',
    gap: 2,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.grey300,
  },
  timelineDashedLine: {
    width: 1,
    height: 10,
    backgroundColor: COLORS.grey200,
  },
  timelineTruckNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.greenLightBg,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // MAP VIEW MODE STYLES
  mapModeContainer: {
    gap: SPACING.md,
  },
  mapShipmentsListCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  mapSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
  },
  mapSectionSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },

  // Map Selection Table
  mapSelectionTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  mapSelectItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
  },
  mapSelectItemRowActive: {
    backgroundColor: COLORS.goldLightBg,
  },
  mapPinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapSelectTextCol: {
    flex: 1,
  },
  mapSelectLocationTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  mapSelectShipmentCode: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginTop: 1,
  },
  mapSelectDeliverySub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapSelectActionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Route Map Card
  routeMapCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  routeMapTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  routeMapShipmentCode: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  mapWrapper: {
    height: 320,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  mapView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerCircleGreen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.greenActive,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  markerCircleRed: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  closeMapBtn: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
  },
  closeMapBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
  },
});

export default styles;
