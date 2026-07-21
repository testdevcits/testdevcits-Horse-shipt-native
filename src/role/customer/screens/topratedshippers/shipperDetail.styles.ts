import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../../constants";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  // Hero section
  heroContainer: { width: width, height: 350, backgroundColor: COLORS.black },
  heroImage: { width: '100%', height: '100%', opacity: 0.85 },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Content Info
  scrollContent: {
    marginTop: -RADIUS.xl,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.xl,
  },
  profileInfo: { paddingHorizontal: SPACING.lg, alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 24, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  locationText: { fontSize: 14, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  
  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.divider,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statLabel: { fontSize: 11, color: COLORS.textLight, fontFamily: FONTS.bold, textTransform: 'uppercase' },
  vDivider: { width: 1, height: 30, backgroundColor: COLORS.divider },

  // Sections
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  reviewCard: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.goldPrimary,
  },
  reviewText: { fontSize: 15, color: COLORS.goldDarkText, lineHeight: 24, fontStyle: 'italic' },
  googleLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md },
  googleLinkText: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.goldPrimary, textDecorationLine: 'underline' },
  
  serviceGrid: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  serviceItem: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    backgroundColor: COLORS.white, 
    padding: SPACING.md, 
    borderRadius: RADIUS.md, 
    borderWidth: 1, 
    borderColor: COLORS.divider 
  },
  serviceLabel: { fontSize: 12, fontFamily: FONTS.medium, color: COLORS.textSecondary },

  // Footer Actions
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  chatBtn: { width: 54, height: 54, borderRadius: RADIUS.md, backgroundColor: COLORS.goldLightBg, justifyContent: 'center', alignItems: 'center' },
  callBtn: { width: 54, height: 54, borderRadius: RADIUS.md, backgroundColor: COLORS.goldLightBg, justifyContent: 'center', alignItems: 'center' },
  bookBtn: { flex: 1, height: 54, borderRadius: RADIUS.md, backgroundColor: COLORS.goldPrimary, justifyContent: 'center', alignItems: 'center' },
  bookText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});

export default styles;