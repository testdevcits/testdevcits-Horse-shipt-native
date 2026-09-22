import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../constants';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    width: SIZES.iconHeaderBg,
    height: SIZES.iconHeaderBg,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.brandBrownLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  badgeIcon: {
    position: 'absolute',
    bottom: -SPACING.xxs,
    right: -SPACING.xxs,
    backgroundColor: COLORS.brandBrown,
    borderRadius: RADIUS.sm2,
    padding: SPACING.xxs,
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grey600,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
  },
  instructionBox: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: SIZES.borderWidthThin,
    borderColor: COLORS.border,
    width: '100%',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  instructionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.grey700,
    flex: 1,
    lineHeight: 18,
    fontFamily: FONTS.medium,
  },
  boldText: {
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.grey100,
  },
  confirmButton: {
    backgroundColor: COLORS.brandBrown,
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  confirmText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default styles;
