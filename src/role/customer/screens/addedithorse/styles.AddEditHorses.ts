import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../constants';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.md },
  topHeader: { marginBottom: SPACING.sm },
  mainTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF6EE',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  infoTextContainer: { flex: 1, marginLeft: SPACING.sm },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  infoDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  form: { gap: SPACING.xs },

  sectionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginVertical: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  uploadBox: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadBoxText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    marginTop: 4,
  },
  photoPreviewBox: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderRadius: 12,
    padding: 4,
  },

  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.xs,
  },
  docTextWrap: {
    marginLeft: SPACING.xs,
    flex: 1,
  },
  docLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  docSubtext: {
    fontSize: FONT_SIZE.xs - 1,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  docUploadBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  docDeleteBtn: {
    padding: 6,
  },

  btnContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    height: 46,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    height: 46,
  },
  cancelBtnText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.sm,
  },
});

export default styles;
