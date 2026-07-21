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