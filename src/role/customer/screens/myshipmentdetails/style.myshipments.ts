import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../../../constants';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollPadding: { paddingBottom: 40 },

  // Header Info
  headerInfo: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipmentTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  shipmentId: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.grey700,
  },
  statusBadge: {
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.goldPrimary,
  },
  statusText: {
    color: COLORS.goldPrimary,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  listedText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.grey600,
    marginTop: 12,
  },

  // Tabs
  tabContainer: { 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.divider,
    marginTop: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { 
    borderBottomColor: COLORS.goldPrimary,
  },
  tabLabel: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  tabLabelActive: { 
    color: COLORS.goldPrimary, 
    fontFamily: FONTS.semiBold 
  },
  tabBadge: {
    backgroundColor: '#F3EBD8', // Light beige color from image
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCCEB2',
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
});

export default styles;