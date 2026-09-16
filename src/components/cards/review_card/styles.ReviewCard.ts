import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: SPACING.md,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey100,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.amberLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipperInfo: {
    justifyContent: 'center',
  },
  shipperName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  shipperSubText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: SPACING.xs2,
  },
  ratingNumberText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.amberWarning,
    marginLeft: SPACING.xs,
  },
  reviewText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    lineHeight: SPACING.xl,
    marginVertical: SPACING.xs2,
  },
  shipmentBox: {
    backgroundColor: COLORS.slate50,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm2,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: 6,
  },
  shipmentCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shipmentCodeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  routeContainer: {
    gap: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.slate700,
  },
});

export default styles;
