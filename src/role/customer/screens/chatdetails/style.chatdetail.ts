import { StyleSheet } from 'react-native';
import {
  COLORS,
  RADIUS,
  SPACING,
  FONTS,
  FONT_SIZE,
} from '../../../../constants';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
  senderName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontFamily: FONTS.regular,
  },

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
    backgroundColor: COLORS.divider,
    borderBottomLeftRadius: RADIUS.xs,
  },

  messageText: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },
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
    shadowColor: COLORS.black,
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
});

export default styles;
