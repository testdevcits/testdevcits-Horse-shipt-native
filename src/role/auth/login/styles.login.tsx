import { StyleSheet, Platform, StatusBar } from 'react-native';
import {
  COLORS,
  RADIUS,
  SPACING,
  SCREEN_WIDTH,
  FONTS,
  FONT_SIZE,
} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    // height is controlled dynamically in the component
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)', 
  },
  keyboardView: {
    flex: 1,
    marginTop: -RADIUS.xl * 2, // Overlap effect using tokens
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    paddingHorizontal: SPACING.xxl,
    // Premium soft shadow using system colors
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  logoIcon: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: -45, // Half of height to center on the edge
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxxl : SPACING.xl,
    flexGrow: 1,
  },
  textHeader: {
    marginBottom: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.heading, // 32
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  roleBadgeLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  roleBadgeValue: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FONT_SIZE.md, // 14
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  utilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm, // Using 8 from your constants for modern look
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.goldPrimary,
    borderColor: COLORS.goldPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs, // Increased touch target
  },
  utilText: {
    fontSize: FONT_SIZE.md, // 14
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  forgotText: {
    fontSize: FONT_SIZE.md, // 14
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  signInBtn: {
    marginTop: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl, // Replaced hardcoded 20
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm, // 12
    fontFamily: FONTS.regular,
  },
  footerLink: {
    color: COLORS.goldPrimary,
    fontFamily: FONTS.bold, // Bold for better CTA visibility
    fontSize: FONT_SIZE.sm, // 12
  },
  changeRoleBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 36),
    right: SPACING.lg,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.4)',
  },
  changeRoleText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginHorizontal: SPACING.xs,
    letterSpacing: 0.5,
  },
});

export default styles;