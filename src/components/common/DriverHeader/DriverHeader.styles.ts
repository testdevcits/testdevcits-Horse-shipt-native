import { Platform, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 8,
    elevation: 3,
    margin: 16,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    ...Platform.select({
      android: {
        paddingTop: SPACING.md,
      },
    }),
    borderRadius: 20,
  },
  leftContainer: {
    position: 'relative',
    marginRight: SPACING.sm2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 14,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  monogramText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.greenActive,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: -2,
    right: -2,
    zIndex: 10,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs2,
  },
  driverName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.slate900,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  statusBadgeOnline: {
    backgroundColor: COLORS.greenLightBg,
    borderColor: COLORS.greenBorder,
  },
  statusBadgeOffline: {
    backgroundColor: COLORS.grey100,
    borderColor: COLORS.grey200,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    letterSpacing: 0.5,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  captainShieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  verifiedCaptainTag: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
});
export default styles;
