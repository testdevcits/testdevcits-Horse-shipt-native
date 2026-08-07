import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from '../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: SPACING.xxxl },

  // Header
  headerSection: { alignItems: 'center', marginBottom: SPACING.md },
  bannerImage: {
    width: width - SPACING.md * 2,
    height: 130,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  profileImageContainer: {
    marginTop: -36,
    padding: 3,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.round,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.grey100,
  },
  mainName: {
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey100,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, color: COLORS.grey900 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.grey500, fontFamily: FONTS.medium, marginTop: 2, textTransform: 'uppercase' },
  vDivider: { width: 1, height: 24, backgroundColor: COLORS.grey100 },

  // Content
  contentPadding: { paddingHorizontal: SPACING.md },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  locationLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: COLORS.grey700 },
  sectionTitleSmall: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, color: COLORS.grey800, marginBottom: SPACING.xs },
  descriptionText: { fontSize: FONT_SIZE.xs, color: COLORS.grey600, lineHeight: 18, fontFamily: FONTS.regular },

  // Sections Common
  section: { marginTop: SPACING.md },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    marginLeft: SPACING.md,
    marginBottom: SPACING.sm,
  },

  // Review Card
  horizontalScroll: { paddingLeft: SPACING.md, paddingRight: SPACING.xs },
  reviewCard: {
    width: width * 0.7,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.grey100,
    shadowColor: COLORS.black,
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  starRow: { flexDirection: 'row', gap: 2, marginBottom: SPACING.xs },
  reviewBody: { fontSize: FONT_SIZE.xs, color: COLORS.grey700, lineHeight: 16, fontFamily: FONTS.regular, minHeight: 48 },
  reviewFooter: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: SPACING.xs },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.grey50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerAvatar: { width: 28, height: 28, borderRadius: 14 },
  reviewerName: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, color: COLORS.grey800 },
  reviewDate: { fontSize: FONT_SIZE.xs, color: COLORS.grey400, fontFamily: FONTS.regular },

  // Shipment Card
  shipmentCard: {
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey100,
  },
  shipmentTitle: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, color: COLORS.grey800, marginBottom: SPACING.xs },

  // Empty states
  emptyContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Buttons
  showMoreBtn: {
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.grey50,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  showMoreText: { fontSize: FONT_SIZE.sm, color: COLORS.grey700, fontFamily: FONTS.bold },

  // Preferred Operating Areas
  areaCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  areaIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaContent: {
    flex: 1,
  },
  areaLocationName: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    lineHeight: 18,
  },
  radiusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  radiusText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.semiBold || FONTS.medium,
    color: COLORS.primary,
  },
});

export default styles;