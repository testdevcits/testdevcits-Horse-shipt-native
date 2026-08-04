import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  // Banner Header
  contractBannerHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  logoBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  bannerTextCol: {
    alignItems: 'flex-end',
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  shipmentCodeText: {
    color: COLORS.goldLightBg,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    marginTop: 1,
  },

  // WebView Container
  webViewContainer: {
    height: height * 0.52,
    backgroundColor: COLORS.grey50,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contractImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noContractText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },

  // Action Buttons
  actionContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey100,
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.sm,
    gap: 8,
  },
  downloadBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  laterBtn: {
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
  },
  laterBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
  },
});

export default styles;
