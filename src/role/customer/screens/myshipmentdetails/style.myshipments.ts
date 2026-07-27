import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollPadding: { paddingBottom: 40 },

  // Header
  headerInfo: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  shipmentId: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statusBadge: {
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.greenPrimary,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },

  // Tabs
  tabContainer: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: COLORS.goldPrimary },
  tabLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  tabLabelActive: { color: COLORS.goldPrimary, fontFamily: FONTS.bold },
  tabBadge: {
    backgroundColor: COLORS.grey200,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  tabBadgeActive: { backgroundColor: COLORS.goldLightBg },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Overview Tab
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: 12,
    marginVertical: SPACING.md,
  },
  subHeaderText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.lg,
    marginVertical: 8,
  },

  // Timeline Logic
  routeItem: { flexDirection: 'row', gap: 12 },
  routeInfo: { flex: 1 },
  routeTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  routeAddress: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  routeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  routeDate: { fontSize: 12, color: COLORS.textSecondary },
  routeTimeline: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
    marginLeft: 10,
    marginVertical: 4,
  },

  // Shipper Card Actions
  shipperProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperName: { flex: 1, fontSize: 14, fontFamily: FONTS.bold },
  iconBtn: {
    padding: 8,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: 20,
  },
  cardActionRow: { flexDirection: 'row', gap: 12 },
  btnOutline: {
    flex: 1,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  btnFilled: {
    flex: 1,
    padding: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldPrimary,
    alignItems: 'center',
  },
  btnFilledText: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.white },

  // Quotes Tab
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: 8,
  },
  listHeaderText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
  },
  quoteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  quoteProvider: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.grey200,
  },
  quoteName: { fontSize: 14, fontFamily: FONTS.bold },
  stars: { flexDirection: 'row' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceVal: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.textPrimary },

  // Find Shipper
  inviteTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  inviteSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  searchBtn: {
    backgroundColor: COLORS.goldPrimary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  searchBtnText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 14 },

  emptyWrap: { alignItems: 'center', padding: 60, gap: 12 },
  emptyText: { color: COLORS.textLight, textAlign: 'center' },
});

export default styles