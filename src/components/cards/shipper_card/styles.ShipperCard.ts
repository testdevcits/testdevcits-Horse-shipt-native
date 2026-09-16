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
  starIcon: { marginRight: 2 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, // Increased for modern look
    padding: SPACING.md,
    width: 280,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,

    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: COLORS.grey50,
    borderWidth: 2,
    borderColor: COLORS.grey100,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  favoriteBtn: {
    padding: 4,
  },
  content: {
    marginTop: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    letterSpacing: 0.3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  stars: {
    flexDirection: 'row',
    marginRight: SPACING.xs2,
  },
  ratingText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
  },
  reviewCount: {
    fontFamily: FONTS.regular,
    color: COLORS.grey500,
    fontSize: FONT_SIZE.sm,
  },
  divider: {
    height: SIZES.borderWidthThin,
    backgroundColor: COLORS.grey100,
    marginVertical: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
    marginLeft: SPACING.xs,
  },
  badge: {
    backgroundColor: COLORS.emeraldLightBg, // Light green
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs2,
  },
  badgeText: {
    fontSize: FONT_SIZE.xxs,
    fontFamily: FONTS.bold,
    color: COLORS.emeraldDark, // Dark green
    textTransform: 'uppercase',
  },
});

export default styles;
