import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    backgroundColor: COLORS.white, 
    paddingHorizontal: SPACING.lg, 
    gap: SPACING.sm, // Reduced gap for a tighter look
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  screenTitle: { 
    fontSize: 24, 
    fontFamily: FONTS.medium, 
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  
  // Container for the dropdown to prevent full-width stretching
  filterContainer: {
    alignSelf: 'flex-start',
    width: 140, // Fixed width to match the "Unread" box design
     
    marginTop:0
     
  },

  // Style override for the AppSelect component
  miniSelect: {
    height: 38, // Small height to match the HorseShipt design
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
    marginBottom: -10, // Remove the default bottom margin
  },

  list: { paddingBottom: 100 },
});

export default styles;