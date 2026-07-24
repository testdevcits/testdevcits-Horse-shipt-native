import { StyleSheet, Platform } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../../../constants";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header Design
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...Platform.select({ ios: { paddingTop: 50 } }),
  },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, marginLeft: SPACING.xs },
  headerInfo: { flex: 1, marginLeft: SPACING.sm },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular },

  // Message List
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },

  // Bubble Layout
  messageWrapper: { marginBottom: SPACING.xl, width: '100%' },
  myWrapper: { alignItems: 'flex-start' }, // Images show "Me" bubbles are left-aligned too but with different color
  otherWrapper: { alignItems: 'flex-start' },

  bubbleHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 6,
    paddingHorizontal: 2
  },
  senderName: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.textPrimary },
  timestamp: { fontSize: 11, color: COLORS.textLight, fontFamily: FONTS.regular },

  bubble: {
    padding: SPACING.md,
    borderRadius: 8, // Square-ish corners like HorseShipt
    maxWidth: '90%',
  },
  myBubble: { backgroundColor: COLORS.goldPrimary }, // Tan/Gold Color
  otherBubble: { backgroundColor: '#F2F4F5' }, // Light Grey Color

  messageText: { fontSize: 14, lineHeight: 21, fontFamily: FONTS.regular },
  myText: { color: COLORS.white },
  otherText: { color: COLORS.textSecondary },

  mediaImage: { 
    width: 240, 
    height: 160, 
    borderRadius: 6, 
    marginBottom: SPACING.xs 
  },

  // Footer / Input Area
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
  },
  inputBox: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
  },
  textInput: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  squareActionBtn: {
    width: 46,
    height: 46,
    backgroundColor: '#F2F4F5',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  sendBtn: {
    backgroundColor: COLORS.goldPrimary,
  },



   draftPreviewContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  draftImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.md,
    position: 'relative',
    // Give shadow to separate from background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  draftImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
  },
  cancelDraftBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error, // Your red color
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default styles;