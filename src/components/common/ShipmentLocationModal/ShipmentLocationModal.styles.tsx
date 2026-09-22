import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SIZES,
  SPACING,
} from '../../../constants';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl || 24,
    borderTopRightRadius: RADIUS.xxl || 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    maxHeight: '85%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  dragIndicator: {
    width: 38,
    height: 4,
    backgroundColor: COLORS.grey300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.goldLightBg || COLORS.warmCreamDark,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || COLORS.tanBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status Section
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round || 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs2 || 4,
    borderRadius: RADIUS.sm,
  },
  lockedBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mintLightBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs2 || 4,
    borderRadius: RADIUS.sm,
  },
  activeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.greenPrimary,
  },

  // Scroll Content
  scrollContent: {
    marginBottom: SPACING.md,
  },
  routeBox: {
    backgroundColor: COLORS.slate50 || COLORS.background,
    borderRadius: RADIUS.lg || 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.slate200 || COLORS.border,
  },

  // Location Sections
  locationSection: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  pinBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  locationTag: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.8,
    flex: 1,
  },
  copyIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xs,
    borderWidth: SIZES.borderWidthThin,
    borderColor: COLORS.grey200,
  },
  copyBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
    marginLeft: SPACING.xs,
  },
  addressBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: SIZES.borderWidthThin,
    borderColor: COLORS.grey200,
  },
  addressText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  // Connector Line
  connectorRow: {
    paddingVertical: SPACING.xs,
    alignItems: 'flex-start',
    paddingLeft: 12,
  },
  verticalLineContainer: {
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.goldBorder || COLORS.primaryLight,
  },
  connectorIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldLightBg || COLORS.warmCreamDark,
    borderWidth: 1,
    borderColor: COLORS.goldBorder || COLORS.tanBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
  },
  mapButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldLightBg || COLORS.warmCreamDark,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  closePrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closePrimaryText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default styles;
