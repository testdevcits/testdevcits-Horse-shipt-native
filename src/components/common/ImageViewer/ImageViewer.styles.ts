import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SIZES,
  SPACING,
} from '../../../constants';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
  },

  header: {
    minHeight: 60,

    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: SPACING.md,
  },

  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },

  closeButton: {
    width: SIZES.controlBtn,
    height: SIZES.controlBtn,

    borderRadius: RADIUS.circle,

    backgroundColor: 'rgba(255, 255, 255, 0.14)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
  },

  imageContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: SPACING.md,
  },

  image: {
    alignSelf: 'center',
  },

  loader: {
    position: 'absolute',

    zIndex: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    width: '85%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  errorIcon: {
    width: SIZES.avatarLg,
    height: SIZES.avatarLg,

    borderRadius: RADIUS.circle,

    backgroundColor: 'rgba(255, 255, 255, 0.12)',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: SPACING.md,
  },

  errorTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',

    textAlign: 'center',

    marginBottom: SPACING.xs,
  },

  errorMessage: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: FONT_SIZE.sm,

    textAlign: 'center',

    marginBottom: SPACING.lg,
  },

  retryButton: {
    minWidth: 100,
    minHeight: SIZES.iconActionBtn,

    paddingHorizontal: SPACING.lg,

    borderRadius: RADIUS.pill,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',
  },

  retryButtonPressed: {
    opacity: 0.8,
  },

  retryText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },

  bottomContainer: {
    minHeight: 70,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },

  doneButton: {
    minHeight: SIZES.iconActionBtn,

    paddingHorizontal: SPACING.xl,

    borderRadius: RADIUS.pill,

    backgroundColor: 'rgba(255, 255, 255, 0.12)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  doneButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },

  doneText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});

export default styles;
