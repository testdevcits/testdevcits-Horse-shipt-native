// src/screens/notifications/notifications.styles.ts
import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerPillContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pillTrack: {
    flexDirection: 'row',
    backgroundColor: COLORS.grey100,
    borderRadius: RADIUS.round,
    padding: 4,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.round,
  },
  activePill: {
    backgroundColor: COLORS.goldPrimary,
    elevation: 2,
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pillText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.grey600,
  },
  activePillText: {
    color: COLORS.white,
  },
  // Selection Ribbon
  ribbon: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.goldBorder,
  },
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  selectionCount: {
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    fontSize: 14,
  },
  ribbonActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  // Card Styling
  list: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadCard: {
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.goldLightBg,
  },
  selectedCard: {
    borderColor: COLORS.goldPrimary,
    backgroundColor: '#FAF6EE',
  },
  checkContainer: {
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  cardBody: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.goldPrimary,
    marginTop: 6,
  },
  cardMsg: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 11,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
  },
});

export default styles;

// import { StyleSheet, Platform } from 'react-native';
// import { COLORS, RADIUS, SPACING, FONTS } from '../../../constants';

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.white },
//   tabWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//     gap: 12,
//   },
//   segmentedControl: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: COLORS.grey100,
//     borderRadius: RADIUS.md,
//     padding: 4,
//   },
//   tabBtn: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: 'center',
//     borderRadius: RADIUS.sm,
//   },
//   tabBtnActive: {
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//   },
//   tabLabel: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.grey500 },
//   tabLabelActive: { color: COLORS.textPrimary, fontFamily: FONTS.bold },
//   searchBtn: {
//     padding: 8,
//     backgroundColor: COLORS.grey100,
//     borderRadius: RADIUS.md,
//   },

//   sectionHeader: {
//     paddingHorizontal: SPACING.lg,
//     paddingTop: SPACING.lg,
//     paddingBottom: SPACING.sm,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontFamily: FONTS.bold,
//     color: COLORS.textLight,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },

//   listPadding: { paddingBottom: 100 },
//   card: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: SPACING.lg,
//     paddingVertical: SPACING.md,
//   },
//   unreadCard: { backgroundColor: '#F9FAFB' },
//   selectedCard: { backgroundColor: COLORS.goldLightBg },
//   cardInner: { flexDirection: 'row', alignItems: 'center' },

//   selectionCircle: { marginRight: SPACING.md },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     borderWidth: 2,
//     borderColor: COLORS.grey300,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: COLORS.goldPrimary,
//     borderColor: COLORS.goldPrimary,
//   },

//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   contentContainer: { flex: 1, marginLeft: SPACING.md },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   title: { fontSize: 15, color: COLORS.textPrimary, fontFamily: FONTS.medium },
//   boldText: { fontFamily: FONTS.bold },
//   message: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
//   time: { fontSize: 11, color: COLORS.textLight },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.goldPrimary,
//     marginLeft: 8,
//   },

//   swipeContainer: { width: 80, flexDirection: 'row' },
//   swipeAction: { flex: 1, alignItems: 'center', justifyContent: 'center' },

//   floatingToolbar: {
//     position: 'absolute',
//     bottom: 30,
//     left: 20,
//     right: 20,
//     backgroundColor: COLORS.grey900,
//     borderRadius: RADIUS.round,
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     zIndex: 100,
//     ...Platform.select({
//       ios: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
//     }),
//   },
//   toolbarClose: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   toolbarText: { color: COLORS.white, fontFamily: FONTS.bold },
//   toolbarActions: { flexDirection: 'row', gap: 20 },
//   actionIcon: { padding: 4 },
// });

// export default styles;
