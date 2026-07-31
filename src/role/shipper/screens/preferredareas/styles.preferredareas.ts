import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },

  // HEADER & DESCRIPTION SECTION
  headerSection: {
    marginBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl || 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  headerSubText: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: SPACING.md,
  },

  // STEP / SLOT BADGES ROW
  slotsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    justifyContent: 'flex-end',
    marginBottom: SPACING.sm,
  },
  slotBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.xs || 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    minWidth: 62,
  },
  slotBadgeFilled: {
    backgroundColor: COLORS.goldPrimary || '#A06333',
    borderColor: COLORS.goldPrimary || '#A06333',
  },
  slotBadgeNum: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary || '#64748B',
  },
  slotBadgeNumFilled: {
    color: COLORS.white,
  },
  slotBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary || '#64748B',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  slotBadgeTextFilled: {
    color: COLORS.white,
  },

  // PROGRESS BAR & COUNTER
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.goldPrimary || '#A06333',
    borderRadius: 3,
  },
  areaCountText: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },

  // TOP ACTION BUTTONS BAR
  actionButtonsBar: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  addAreaBtn: {
    backgroundColor: COLORS.goldPrimary || '#A06333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs || 8,
    elevation: 2,
    shadowColor: COLORS.goldPrimary || '#A06333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addAreaBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  seeAllBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs || 8,
  },
  seeAllBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },

  // PREFERRED AREA CARD
  areaCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  areaCardHeader: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  indexBadge: {
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderWidth: 1,
    borderColor: COLORS.goldBorder || '#E6D7BD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs || 6,
  },
  indexBadgeText: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.bold,
    color: COLORS.goldPrimary || '#A06333',
  },
  locationTitle: {
    flex: 1,
    fontSize: FONT_SIZE.sm + 1 || 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    lineHeight: 20,
  },

  radiusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.round || 20,
    marginBottom: SPACING.md,
    marginLeft: 34,
  },
  radiusPillText: {
    fontSize: FONT_SIZE.xs || 11,
    fontFamily: FONTS.bold,
    color: '#D97706',
  },

  // COORD BOXES ROW
  coordsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  coordBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: RADIUS.xs || 6,
    padding: SPACING.sm,
  },
  coordLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary || '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coordVal: {
    fontSize: FONT_SIZE.xs || 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },

  exactPointNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.md,
  },
  exactPointNoteText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
  },

  // MAP PREVIEW
  mapContainer: {
    height: 180,
    borderRadius: RADIUS.sm || 8,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapView: {
    width: '100%',
    height: '100%',
  },

  // CARD ACTION BUTTONS
  cardActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  editCardBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs || 8,
  },
  editCardBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  deleteCardBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.xs || 8,
  },
  deleteCardBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: '#DC2626',
  },

  // EMPTY STATE
  emptyStateBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md || 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
    marginTop: SPACING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary || '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg || 20,
    borderTopRightRadius: RADIUS.lg || 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: FONT_SIZE.md + 2 || 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  modalBody: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.xs || 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : 2,
    backgroundColor: COLORS.white,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary || '#1E293B',
    paddingVertical: 8,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: SPACING.md,
  },

  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  presetChip: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.round || 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: COLORS.goldLightBg || '#FAF6EE',
    borderColor: COLORS.goldPrimary || '#A06333',
  },
  presetChipText: {
    fontSize: FONT_SIZE.xs || 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary || '#64748B',
  },
  presetChipTextActive: {
    color: COLORS.goldPrimary || '#A06333',
    fontFamily: FONTS.bold,
  },

  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: COLORS.white,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.xs || 8,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary || '#1E293B',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: COLORS.goldPrimary || '#A06333',
    borderRadius: RADIUS.xs || 8,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: FONT_SIZE.sm || 14,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default styles;
