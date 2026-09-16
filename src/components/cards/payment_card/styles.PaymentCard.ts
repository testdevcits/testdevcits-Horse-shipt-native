import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface || COLORS.white,
    borderRadius: RADIUS.md, // Smaller radius for smaller text
    padding: SPACING.sm + 2, // Slightly tighter padding (approx 10px)
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  iconBg: {
    width: 30, // Reduced from 36
    height: 30, // Reduced from 36
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.goldLightBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  brandText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm, // Down from md
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: FONT_SIZE.xs, // Down from sm-1
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md, // Down from lg
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm, // Reduced spacing
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  location: {
    flex: 1,
    fontSize: FONT_SIZE.xs, // Down from sm
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  arrow: {
    marginHorizontal: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.grey50,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  statusText: {
    fontSize: FONT_SIZE.xs - 1, // Scaled down further for the badge
    fontFamily: FONTS.bold,
    color: COLORS.success,
    textTransform: 'uppercase',
  },
});
export default styles;
