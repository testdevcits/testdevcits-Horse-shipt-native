import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING, FONT_SIZE, RADIUS } from '../../../constants/dimensions';
import { FONTS } from '../../../constants/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopRightRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  /* Profile Header */
  profileHeaderContainer: {
    backgroundColor: COLORS.background || '#FAF9F6',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100 || '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 28,
    height: 28,
    marginRight: SPACING.xs,
  },
  logoText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    letterSpacing: -0.5,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg || '#FFFBEB',
    paddingHorizontal: SPACING.sm2,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#FDE68A',
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
    letterSpacing: 0.6,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: COLORS.brandBrown,
  },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
  },
  userInfoCol: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.xs,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  userEmailText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  /* Drawer Scroll & Items */
  drawerScroll: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    letterSpacing: 1.1,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm2,
    paddingHorizontal: SPACING.md,
    marginBottom: 2,
    borderRadius: RADIUS.md,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: COLORS.goldLightBg || '#FFFBEB',
  },
  activeLeftBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.brandBrown,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm2,
  },
  iconContainerActive: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs,
  },
  menuImage: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey800,
  },
  menuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: SPACING.xs,
  },

  /* Submenu */
  subMenuContainer: {
    backgroundColor: '#FAFAF9',
    borderRadius: RADIUS.sm,
    marginHorizontal: SPACING.xs,
    marginVertical: 2,
    paddingVertical: 2,
  },
  subMenuItem: {
    paddingVertical: SPACING.xs + 2,
    paddingLeft: SPACING.xl + 18,
    paddingRight: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subMenuItemActive: {
    backgroundColor: '#F5F5F4',
    borderRadius: RADIUS.xs,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.grey400,
    marginRight: SPACING.sm,
  },
  bulletDotActive: {
    backgroundColor: COLORS.brandBrown,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subMenuLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  subMenuLabelActive: {
    color: COLORS.brandBrown,
    fontFamily: FONTS.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider || '#F1F5F9',
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },

  /* Footer & Logout */
  footerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider || '#F1F5F9',
    backgroundColor: COLORS.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.redLightBg,
  },
  logoutIconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.redLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logoutText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },
  versionText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

export default styles;
