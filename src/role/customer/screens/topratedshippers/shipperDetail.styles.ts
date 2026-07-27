import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from '../../../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: SPACING.xxl },

  // Header
  headerSection: { alignItems: 'center', marginBottom: SPACING.xl },
  bannerImage: {
    width: width - SPACING.lg * 2,
    height: 160,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md, // Adjusted for AppHeader
  },
  profileImageContainer: {
    marginTop: -45,
    padding: 4,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.round,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.grey100,
  },
  mainName: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey100,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.grey900 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, color: COLORS.grey500, fontFamily: FONTS.medium, marginTop: 4, textTransform: 'uppercase' },
  vDivider: { width: 1, height: 30, backgroundColor: COLORS.grey100 },

  // Content
  contentPadding: { paddingHorizontal: SPACING.lg },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.xl },
  locationLabel: { fontSize: 16, fontFamily: FONTS.medium, color: COLORS.grey700 },
  sectionTitleSmall: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.grey800, marginBottom: SPACING.xs },
  descriptionText: { fontSize: 14, color: COLORS.grey600, lineHeight: 22, fontFamily: FONTS.regular },

  // Sections Common
  section: { marginTop: SPACING.xl },
  sectionTitle: { 
    fontSize: 18, 
    fontFamily: FONTS.bold, 
    color: COLORS.grey900, 
    marginLeft: SPACING.lg,
    marginBottom: SPACING.md 
  },

  // Review Card
  horizontalScroll: { paddingLeft: SPACING.lg, paddingRight: SPACING.sm },
  reviewCard: {
    width: width * 0.75,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey100,
    shadowColor: COLORS.black,
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  starRow: { flexDirection: 'row', gap: 2, marginBottom: SPACING.sm },
  reviewBody: { fontSize: 13, color: COLORS.grey700, lineHeight: 20, fontFamily: FONTS.regular, minHeight: 60 },
  reviewFooter: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, gap: 10 },
  avatarPlaceholder: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: COLORS.grey50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  reviewerAvatar: { width: 32, height: 32, borderRadius: 16 },
  reviewerName: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.grey800 },
  reviewDate: { fontSize: 11, color: COLORS.grey400, fontFamily: FONTS.regular },

  // Shipment Card
  shipmentCard: {
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.grey100,
  },
  shipmentTitle: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.grey800, marginBottom: SPACING.xs },
  
  // Empty states
  emptyContainer: { 
    height: 180, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Buttons
  showMoreBtn: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.grey50,
    padding: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  showMoreText: { fontSize: 14, color: COLORS.grey700, fontFamily: FONTS.bold },
});

export default styles;