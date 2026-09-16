import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emojiContainer: { marginBottom: SPACING.md },
  question: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  starRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm2,
    marginBottom: SPACING.xl,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeChipText: { color: COLORS.white },
  input: {
    width: '100%',
    minHeight: 100,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    width: '100%',
    justifyContent: 'center',
  },
  photoBtnText: { color: COLORS.primary, fontFamily: FONTS.bold },
});

export default styles;
