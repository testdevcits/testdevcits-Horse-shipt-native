import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  // Horizontal scroll area padding
  tabScrollContent: {
    paddingHorizontal: SPACING.lg, // Keeps starting chips aligned perfectly with your cards
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm, // Gap between pill-shaped chips
  },
  // Pill-shaped chip container
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    gap: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate600,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  badge: {
    backgroundColor: COLORS.slate100,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.slate600,
  },
  badgeTextActive: {
    color: COLORS.white,
  },
  cardSpacing: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
});

export default styles;
