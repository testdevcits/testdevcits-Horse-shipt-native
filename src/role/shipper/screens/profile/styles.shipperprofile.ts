import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // TOP HORIZONTAL TAB BAR
  tabBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  tabBarScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.lg,
  },
  tabItem: {
    paddingVertical: SPACING.sm,
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.bold,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.goldPrimary,
    borderRadius: 2,
  },

  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // BANNER SECTION
  bannerWrapper: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
    backgroundColor: COLORS.grey100,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  editBannerBtn: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  editBannerText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },

  // AVATAR & EDIT PICTURE SECTION
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarCircleWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    marginBottom: SPACING.xs,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editPicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  editPicText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // STATS CARD
  statsCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: FONT_SIZE.title,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  ratingValRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.goldBorder,
    height: '80%',
    alignSelf: 'center',
  },

  tabSection: {
    gap: SPACING.md,
  },

  // TAB 1: PROFILE STYLES
  goldFilledBtn: {
    backgroundColor: COLORS.goldPrimary,
    borderRadius: RADIUS.xs,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  goldFilledBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoCardTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  iconEditBtn: {
    padding: SPACING.xs,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.grey100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  infoVal: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // REVIEWS SECTION
  reviewsSection: {
    marginTop: SPACING.xs,
  },
  reviewsSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  reviewsScroll: {
    gap: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  reviewCard: {
    width: 260,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  reviewText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  reviewerName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  showMoreBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.grey100,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
  showMoreBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // TAB 2: SHIPMENT STYLES
  featureCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  featureCardImg: {
    width: 130,
    height: 140,
    resizeMode: 'cover',
  },
  featureCardContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  featureSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  featureActionBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // TAB 3: PAYMENTS STYLES
  sectionHeaderTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  sectionHeaderSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  payoutAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  goldHorseIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutTextCol: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  payoutSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.xs,
  },
  verifiedCard: {
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  checkSquare: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  verifiedTextCol: {
    flex: 1,
  },
  verifiedTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
  },
  verifiedSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  calloutBanner: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.md,
  },
  calloutText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldPrimary,
    lineHeight: 18,
  },

  // TAB 4: SUBSCRIPTION STYLES
  subCardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  goldSquareIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderTextCol: {
    flex: 1,
  },
  subHeaderTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  subHeaderSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  redCrossCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redCrossText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontFamily: FONTS.bold,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginVertical: SPACING.sm,
  },
  greenOutlinePill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.greenActive,
    backgroundColor: COLORS.greenLightBg,
  },
  greenOutlinePillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.greenActive,
  },
  blueOutlinePill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.info,
    backgroundColor: COLORS.grey100,
  },
  blueOutlinePillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.info,
  },
  planDetailsBox: {
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.xs,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  planLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
  },
  planName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    marginTop: 4,
  },
  planPrice: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.goldPrimary,
    marginTop: 2,
  },
  subActiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.goldLightBg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.goldPrimary,
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.xs,
  },
  subActiveBannerText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
  },

  // BILLING HISTORY
  billingFilterRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  billingFilterPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.grey100,
  },
  billingFilterPillActive: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  billingFilterText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  billingFilterTextActive: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.bold,
  },
  transactionsTableContainer: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tableColHeader: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  tableCellText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  succeededPill: {
    borderWidth: 1,
    borderColor: COLORS.greenActive,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.greenLightBg,
  },
  succeededText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.greenActive,
  },

  // TAB 5: NOTIFICATION STYLES
  notificationsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: SPACING.md,
  },
  notifColHeadersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    paddingRight: 10,
    marginBottom: SPACING.xs,
  },
  notifChannelText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  notifItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  notifTextCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  notifItemTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  notifItemDesc: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifCheckboxesCol: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  notifCheckbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  notifCheckboxActive: {
    backgroundColor: COLORS.goldLightBg,
  },
});

export default styles;
