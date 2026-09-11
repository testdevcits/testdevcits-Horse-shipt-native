import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  headerBannerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  topTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: '#0F172A',
  },
  topSub: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: '#64748B',
    marginBottom: SPACING.md,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#FFFBF5',
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E4D4',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.md + 2,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs - 1,
    fontFamily: FONTS.medium,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F0E4D4',
  },

  // Actions Bar Row
  actionsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  addDriverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A06333',
    paddingHorizontal: SPACING.md,
    height: 44,
    borderRadius: RADIUS.md,
    gap: 6,
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addDriverBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Filter Pills
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  filterPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#A06333',
    borderColor: '#A06333',
  },
  filterPillText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: '#64748B',
  },
  filterPillTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  // Empty State
  emptyWrap: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: '#0F172A',
    marginTop: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONTS.regular,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});

export default styles;
