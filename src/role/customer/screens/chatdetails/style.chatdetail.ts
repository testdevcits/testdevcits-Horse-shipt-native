import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBFC' },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...Platform.select({ ios: { paddingTop: 50 } }),
  },
  headerInfo: { flex: 1, marginLeft: SPACING.md },
  headerName: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.textPrimary },
  headerSub: { fontSize: 11, color: COLORS.goldPrimary, fontFamily: FONTS.bold },
  
  // List
  listContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.lg },
  
  // Bubbles
  bubbleWrapper: { marginBottom: SPACING.md, maxWidth: '80%' },
  myBubbleWrapper: { alignSelf: 'flex-end' },
  otherBubbleWrapper: { alignSelf: 'flex-start' },
  
  bubble: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  myBubble: { backgroundColor: COLORS.goldPrimary, borderBottomRightRadius: 2 },
  otherBubble: { backgroundColor: COLORS.white, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.divider },
  
  messageText: { fontSize: 14, lineHeight: 20, fontFamily: FONTS.medium },
  myMessageText: { color: COLORS.white },
  otherMessageText: { color: COLORS.textPrimary },
  
  timeText: { fontSize: 9, marginTop: 4, alignSelf: 'flex-end', opacity: 0.7 },
  myTimeText: { color: 'rgba(255,255,255,0.8)' },
  otherTimeText: { color: COLORS.textLight },

  // Media
  mediaImage: { width: 220, height: 150, borderRadius: RADIUS.md, marginBottom: 4 },

  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
  },
  inputField: {
    flex: 1,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.sm,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;