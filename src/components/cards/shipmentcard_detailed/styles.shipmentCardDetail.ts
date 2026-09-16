import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.xs,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  image: {
    width: '32%',
    height: '100%',
    backgroundColor: COLORS.grey100,
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    lineHeight: 16,
    paddingRight: SPACING.xs,
  },
  exportBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: 2,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  badge: {
    borderWidth: 1,
    backgroundColor: COLORS.transparent,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    borderRadius: RADIUS.round,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey700,
  },

  /* Timeline Styles */
  timelineContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.grey50,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
  },
  dashedLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.grey300,
    marginVertical: 2,
  },
  truckCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  deleteIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.redLightBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.redBorder,
  },
});

export default styles;
