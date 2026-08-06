import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Top Card
  topCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  topTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  topSub: {
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

  // 3 Tabs Container
  tabsWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    // marginTop: SPACING.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  badgePill: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.round,
  },
  badgePillText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // Sub Filter Status Pills
  subFilterWrapper: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  subFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  subFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  subFilterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subFilterText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: '#475569',
  },
  subFilterTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  subFilterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.round,
  },
  subFilterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  subFilterBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#475569',
  },
  subFilterBadgeTextActive: {
    color: COLORS.white,
  },

  // Standard Shipment Card Item
  shipmentCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  codeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#B45309',
    textTransform: 'uppercase',
  },

  // Customer & Horse Info
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  customerText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  horseTagText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },

  // Locations Timeline
  locationsBox: {
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.xs,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  dotPickup: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginTop: 4,
  },
  dotDelivery: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginTop: 4,
  },
  locCol: {
    flex: 1,
  },
  locLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  locAddress: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginTop: 1,
  },

  // Dates Row
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // Card Action Buttons
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  askBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#A06333',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  askBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  offerBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.xs,
    backgroundColor: '#A06333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Premium Redesign: My Shipments Card Styles
  myShipmentCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: SPACING.md,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  myHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  myCodeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#334155',
  },
  myBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  myBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  myBadgePillText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },

  // Route Graphic Row
  routeGraphicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  routeLocCol: {
    flex: 1,
  },
  locHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  locDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  routeLocLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeAddressText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  trackMiddle: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 4,
  },
  trackLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#CBD5E1',
  },
  trackTruckBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  // Meta Info Grid Box
  metaInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: SPACING.sm,
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#FDE68A',
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#92400E',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
    color: '#78350F',
    textTransform: "capitalize"
  },
  priceValue: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: '#059669',
  },

  // Action Buttons Row
  myActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 2,
  },
  viewContractBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#A06333',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewContractBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  trackShipmentBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: '#A06333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 1,
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  trackShipmentBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  reviewCustomerBtn: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    elevation: 1,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  reviewCustomerBtnText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Loader & Empty
  loaderContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default styles;
