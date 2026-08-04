import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../constants';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollPadding: { paddingBottom: SPACING.xxxl },

  // Header Info
  headerInfo: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  shipmentId: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  statusBadge: {
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
  },
  listedText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
    marginTop: SPACING.xs,
  },

  // Tabs
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginTop: SPACING.xs,
  },
  tabButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  tabBadge: {
    backgroundColor: '#F3EBD8',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 1,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: '#DCCEB2',
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
});

export default styles;