import { StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../../constants'; // Adjust paths

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay50, // Dim background
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  calendarCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    // Professional Shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});
export default styles;
