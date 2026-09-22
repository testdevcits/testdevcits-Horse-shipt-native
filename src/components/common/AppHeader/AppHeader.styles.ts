import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SIZES,
} from '../../../constants';

const styles = StyleSheet.create({
  header: {
    height: SPACING.massive,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    // backgroundColor: COLORS.surface,
    borderBottomWidth: SIZES.borderWidthThin,
    borderBottomColor: COLORS.divider,
  },
  leftContainer: {
    flex: 0.15,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 0.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  iconBtn: {
    padding: SPACING.xs2,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: COLORS.error,
    minWidth: RADIUS.lg,
    height: RADIUS.lg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.mini,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    lineHeight: SPACING.md,
  },
  profileBtn: {
    marginLeft: SPACING.xs,
    padding: SPACING.xs,
  },
});

export default styles;
