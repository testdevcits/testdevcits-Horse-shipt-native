// import { StyleSheet } from 'react-native';
// import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from '../../../constants';

import { Platform, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   headerPillContainer: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.divider,
//   },
//   pillTrack: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.grey100,
//     borderRadius: RADIUS.round,
//     padding: 3,
//   },
//   pillBtn: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: 'center',
//     borderRadius: RADIUS.round,
//   },
//   activePill: {
//     backgroundColor: COLORS.primary,
//     elevation: 2,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   pillText: {
//     fontSize: FONT_SIZE.xs,
//     fontFamily: FONTS.bold,
//     color: COLORS.grey600,
//   },
//   activePillText: {
//     color: COLORS.white,
//   },
//   // Selection Ribbon
//   ribbon: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.sm,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.goldBorder,
//   },
//   ribbonLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.sm,
//   },
//   selectionCount: {
//     fontFamily: FONTS.bold,
//     color: COLORS.primary,
//     fontSize: FONT_SIZE.sm,
//   },
//   ribbonActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.lg,
//   },
//   actionBtn: {
//     padding: 4,
//   },
//   // Card Styling
//   list: {
//     padding: SPACING.md,
//     paddingBottom: 100,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.md,
//     padding: SPACING.md,
//     marginBottom: SPACING.sm,
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 6,
//     elevation: 1,
//   },
//   unreadCard: {
//     borderColor: COLORS.goldBorder,
//     backgroundColor: COLORS.goldLightBg,
//   },
//   selectedCard: {
//     borderColor: COLORS.primary,
//     backgroundColor: '#FAF6EE',
//   },
//   checkContainer: {
//     justifyContent: 'center',
//     marginRight: SPACING.sm,
//   },
//   iconBox: {
//     width: 40,
//     height: 40,
//     borderRadius: RADIUS.sm,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   cardBody: {
//     flex: 1,
//     marginLeft: SPACING.sm,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   cardTitle: {
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.sm,
//     color: COLORS.textPrimary,
//     flex: 1,
//     marginRight: 6,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//   },
//   cardMsg: {
//     fontSize: FONT_SIZE.xs,
//     color: COLORS.textSecondary,
//     lineHeight: 18,
//     marginBottom: 6,
//     fontFamily: FONTS.regular,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTime: {
//     fontSize: FONT_SIZE.xs,
//     color: COLORS.textLight,
//     fontFamily: FONTS.medium,
//   },
// });

// export default styles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate50,
  },

  // HEADER RIGHT ACTION
  headerMarkReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerMarkReadText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.brandBrown,
  },

  // TOP FILTER & SUMMARY BAR
  filterBarContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  summaryRow: {
    marginBottom: SPACING.sm,
  },
  summaryText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
  },
  summaryHighlight: {
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },

  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.divider,
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  tabPillActive: {
    backgroundColor: COLORS.brandBrown,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  tabLabelActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  countBadge: {
    backgroundColor: COLORS.slate200,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.grey700,
  },
  countTextActive: {
    color: COLORS.white,
  },

  // LIST CONTAINER
  listContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },

  // NOTIFICATION CARDS
  notifCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 2,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  notifCardUnread: {
    backgroundColor: COLORS.goldLightBg,
    borderColor: COLORS.goldBorder,
  },
  notifCardRead: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.slate200,
  },
  notifCardSelected: {
    backgroundColor: COLORS.amberLightBg,
    borderColor: COLORS.brandBrown,
    borderWidth: 1.5,
  },

  unreadAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.brandBrown,
  },

  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {},
  checkboxUncheckedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.slate300,
    backgroundColor: COLORS.white,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notifTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
    flex: 1,
  },
  notifTitleUnread: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brandBrown,
  },
  notifMsg: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.grey400,
    marginTop: 6,
  },

  deleteIconButton: {
    padding: 6,
    borderRadius: RADIUS.xs,
  },

  // FLOATING BATCH ACTION BAR
  floatingActionBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.slate900,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  actionInfoCol: {
    flexDirection: 'column',
  },
  selectedCountText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  selectAllToggle: {
    marginTop: 2,
  },
  selectAllToggleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.slate400,
    textDecorationLine: 'underline',
  },

  batchActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batchMarkReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldDark,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.emeraldPrimary,
  },
  batchMarkReadText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldBorder,
  },
  batchDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redPrimary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.redPrimary,
  },
  batchDeleteText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.redBorder,
  },
  batchCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.slate700,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});

export default styles;
