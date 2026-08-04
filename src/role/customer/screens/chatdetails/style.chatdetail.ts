import { StyleSheet, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING, FONTS, FONT_SIZE } from '../../../../constants';

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
  headerAvatar: { width: 36, height: 36, borderRadius: 18, marginLeft: SPACING.xs },
  headerInfo: { flex: 1, marginLeft: SPACING.sm },
  headerTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.md, color: COLORS.textPrimary },
  headerSubtitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontFamily: FONTS.regular },

  // Message List
  listContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },

  // Bubble Layout
  messageWrapper: { marginBottom: SPACING.md, width: '100%' },
  myWrapper: { alignItems: 'flex-end' },
  otherWrapper: { alignItems: 'flex-start' },

  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  senderName: { fontFamily: FONTS.bold, fontSize: FONT_SIZE.xs, color: COLORS.textPrimary },
  timestamp: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, fontFamily: FONTS.regular },

  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    maxWidth: '82%',
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: RADIUS.xs,
  },
  otherBubble: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: RADIUS.xs,
  },

  messageText: { fontSize: FONT_SIZE.sm, lineHeight: 18, fontFamily: FONTS.regular },
  myText: { color: COLORS.white },
  otherText: { color: COLORS.textPrimary },

  mediaImage: {
    width: 200,
    height: 140,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  mediaImageFallback: {
    width: 200,
    height: 140,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: 6,
  },
  mediaImageErrorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // Footer / Input Area
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.sm,
    gap: SPACING.xs,
  },
  inputBox: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: '#F8FAFC',
  },
  textInput: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  squareActionBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
  },
  disabledSendBtn: {
    opacity: 0.5,
    backgroundColor: COLORS.black || '#000000',
  },

  draftPreviewContainer: {
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  draftImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  draftImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.sm,
  },
  cancelDraftBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.error,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  // Locked Chat Container
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.grey100,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingBottom: Platform.OS === 'ios' ? 28 : SPACING.md,
  },
  lockedText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
    textAlign: 'center',
  },
});

export default styles;