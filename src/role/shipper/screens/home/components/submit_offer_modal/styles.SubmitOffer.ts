import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../../../constants';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay55,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
    gap: SPACING.sm,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },

  // Readonly Payment Bar
  paymentInfoRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.divider,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  paymentInfoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
    padding: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  paymentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentTextCol: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: FONT_SIZE.mini,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  paymentValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Scroll Content
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Sections
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Label Row
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  asterisk: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },

  // Price Input
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 46,
    backgroundColor: COLORS.white,
  },
  currencyPrefix: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  priceTextInput: {
    flex: 1,
    height: '100%',
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Standard Input
  standardInputContainer: {
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 46,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  standardTextInput: {
    width: '100%',
    height: '100%',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  captionText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginTop: 4,
  },
  focusedErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.redLightBg,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  focusedErrorText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.redLightBg,
  },

  // Textarea
  textAreaContainer: {
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  textAreaInput: {
    height: 90,
    textAlignVertical: 'top',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  // Dashed Contract File
  dashedFileContainer: {
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderStyle: 'dashed',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  fileTextCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  fileNameText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  fileCaptionText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chooseFileBtn: {
    borderWidth: 1,
    borderColor: COLORS.brandBrown,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.white,
  },
  chooseFileBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.brandBrown,
  },
  removeContractBtn: {
    marginTop: 4,
  },
  removeContractText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: COLORS.error,
  },

  // Signature
  sigSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  signatureWrapper: {
    height: 180,
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  sigFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  clearSigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearSigText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.bluePrimary,
  },
  capturedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capturedText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.greenActive,
  },

  // Footer Actions
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.brandBrown,
    backgroundColor: COLORS.slate50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.brandBrown,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.brandBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});


export default styles