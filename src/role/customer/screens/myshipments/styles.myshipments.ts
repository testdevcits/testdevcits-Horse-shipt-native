import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tabScroll: { paddingHorizontal: SPACING.md, paddingVertical: 12 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: { backgroundColor: COLORS.goldPrimary },
  tabText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: { color: COLORS.white },
  countBadge: {
    backgroundColor: COLORS.grey200,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 6,
  },
  activeCountBadge: { backgroundColor: 'rgba(255,255,255,0.3)' },
  countText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  activeCountText: { color: COLORS.white },
  list: { padding: SPACING.md, paddingBottom: 120 },
});

export default styles