import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from "../../../constants";


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },

  // Custom Blue Dot Marker
  blueDotContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueDotPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.4)',
  },
  blueDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 5,
  },

  // Search UI
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.lg,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 45 : 10,
  },
  backButton: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  leftSearchIcon: { paddingLeft: 15 },

  // Custom Search List Items
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.divider,
  },
  searchIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.grey50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchRowTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },
  searchRowSub: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.grey500,
    marginTop: 2,
  },

  // Tools
  mapTools: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 50,
    gap: SPACING.md,
  },
  toolBtn: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  primaryTool: { backgroundColor: COLORS.grey900 },
});
export default styles