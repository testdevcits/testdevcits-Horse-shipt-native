import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "../../../../constants";


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:  COLORS.background,
  },
  trackingCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextWrapper: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  cardHeaderSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.lightGrey,
    marginTop: 2,
  },
  highlightInfoBox: {
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  highlightLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  driverName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  coordinateText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.grey400,
  },
  goldButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldPrimary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  autoTrackActiveButton: {
    backgroundColor: '#374151',
  },
  btnIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.white,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: 8,
    padding: 16,
  },
  tipLabel: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.goldPrimary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tipDescription: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.lightGrey,
    lineHeight: 18,
  },
});

export default styles