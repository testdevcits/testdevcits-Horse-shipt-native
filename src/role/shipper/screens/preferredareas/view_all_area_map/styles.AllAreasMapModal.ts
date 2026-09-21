import { Dimensions, StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../../constants';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // MODAL HEADER
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerTitleCol: {
    flex: 1,
    gap: 2,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  countPill: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldBorder,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  countPillText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  modalSubTitle: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  closeBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  // MAP VIEW & FLOATING CONTROLS
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.border,
    position: 'relative',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },

  floatingControlsContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    zIndex: 10,
  },
  floatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.whiteOverlay95,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 7,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  floatingBtnText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  floatingBtnIconOnly: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.whiteOverlay95,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // CUSTOM MARKERS
  customMarkerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  customMarkerPinFocused: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.amberPrimary,
    borderColor: COLORS.white,
    transform: [{ scale: 1.1 }],
  },
  customMarkerText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  customMarkerTextFocused: {
    fontSize: FONT_SIZE.md,
  },

  // BOTTOM DRAWER
  bottomDrawer: {
    height: height * 0.36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 2,
    paddingBottom: SPACING.xs,
  },
  drawerTitle: {
    fontSize: FONT_SIZE.xs + 2,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  selectAllToggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  selectAllToggleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // SEARCH BAR
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    height: 36,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    padding: 0,
  },

  // LIST SCROLL
  listScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.xs + 2,
  },

  // AREA ITEM CARD
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  areaCardFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.goldLightBg,
  },
  checkboxTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.textLight,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  indexBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadgeFocused: {
    backgroundColor: COLORS.primary,
  },
  indexBadgeText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  indexBadgeTextFocused: {
    color: COLORS.white,
  },

  areaDetailsCol: {
    flex: 1,
    gap: 2,
  },
  areaNameText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  radiusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  radiusPillText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  coordsText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // EMPTY STATE
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.xs,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
});
export default styles;
