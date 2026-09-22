
import { StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.xs,
    height: '100%',
  },
  triggerBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: SPACING.sm,
    marginRight: SPACING.xs,
  },
  flagText: {
    fontSize: FONT_SIZE.xl,
    marginRight: SPACING.xs,
  },
  codeText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay50,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  listContainer: {
    paddingVertical: SPACING.sm,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.xxs,
  },
  selectedRow: {
    backgroundColor: COLORS.primaryLight,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFlag: {
    fontSize: FONT_SIZE.title,
    marginRight: SPACING.sm,
  },
  countryName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  countryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
export default styles