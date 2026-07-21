import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, padding: SPACING.lg, gap: SPACING.md },
  screenTitle: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },
    filterWrapper: { backgroundColor: COLORS.white, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  filterTrack: { flexDirection: 'row', backgroundColor: COLORS.grey100, borderRadius: RADIUS.md, padding: 4 },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.sm },
  activeFilterBtn: { backgroundColor: COLORS.goldPrimary, shadowColor: COLORS.goldPrimary, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  filterText: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.grey600 },
  activeFilterText: { color: COLORS.white },
  list: { padding: SPACING.lg, paddingBottom: 100 },
});

export default styles;