import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../../constants';

const styles = StyleSheet.create({
  tabSection: {
    gap: SPACING.md,
  },
  shipmentRowCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs || 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  shipmentRowIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs || 8,
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipmentRowContent: {
    flex: 1,
  },
  shipmentRowTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  shipmentRowSub: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    marginTop: 2,
  },
});

export default styles;
