import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from "../../../../constants";


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.goldPrimary },
  tabText: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  activeTabText: { color: COLORS.goldPrimary, fontFamily: FONTS.semiBold },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: SPACING.xl },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: COLORS.grey100,
  },
  avatar: { width: '100%', height: '100%' },
  placeholderAvatar: { justifyContent: 'center', alignItems: 'center' },
  editPictureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  editPictureText: {
    marginLeft: 5,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  statsCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    height: '80%',
    alignSelf: 'center',
  },
  infoCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  editIconBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.grey50,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  infoList: { marginTop: SPACING.sm },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grey200,
  },
  infoLabel: {
    width: 70,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  infoValue: { flex: 1, color: COLORS.textPrimary, fontFamily: FONTS.medium },
  reviewList: { flexDirection: 'row' },

  showMoreBtn: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showMoreText: { color: COLORS.textPrimary, fontFamily: FONTS.medium },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});


export default styles