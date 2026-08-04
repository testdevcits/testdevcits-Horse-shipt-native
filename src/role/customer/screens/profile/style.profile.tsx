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
  tab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  activeTabText: { color: COLORS.primary, fontFamily: FONTS.semiBold },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: SPACING.md },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: COLORS.grey100,
  },
  avatar: { width: '100%', height: '100%' },
  placeholderAvatar: { justifyContent: 'center', alignItems: 'center' },
  editPictureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  editPictureText: {
    marginLeft: 5,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
  },
  statsCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: FONTS.regular,
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
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
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
  infoList: { marginTop: SPACING.xs },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grey200,
  },
  infoLabel: {
    width: 80,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
  },
  infoValue: { flex: 1, color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  reviewList: { flexDirection: 'row' },

  showMoreBtn: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showMoreText: { color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});


export default styles