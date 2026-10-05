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
  profileHeaderContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: SPACING.sm2,
    paddingVertical: SPACING.xxs + 2,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  roleBadgeText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 0.6,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
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
  drawerScroll: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
    color: COLORS.textLight,
    letterSpacing: 1,
    marginLeft: SPACING.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm2,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xxs,
    borderRadius: RADIUS.md,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: COLORS.goldLightBg,
  },
  activeLeftBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
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
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  menuLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  badgeContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: SPACING.xs,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
  },
  chevron: {
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  footerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
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
    backgroundColor: COLORS.redLightBg,
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
