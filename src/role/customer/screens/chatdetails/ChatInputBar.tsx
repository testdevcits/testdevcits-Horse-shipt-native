import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { memo } from 'react';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from '../../../../constants';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { AppText, Input } from '../../../../components';

const ChatInputBar = ({
  isLocked,
  inputText,
  setInputText,
  setShowPhotoSheet,
  showPhotoSheet,
  canSend,
  sending,
  handleSend,
}: any) => {
  return isLocked ? (
    <View style={styles.lockedContainer}>
      <AppIcon
        name={'Lock'}
        size={18}
        color={COLORS.grey500}
        style={{ marginRight: 8 }}
      />
      <AppText style={styles.lockedText}>
        Chat is locked because this shipment is completed.
      </AppText>
    </View>
  ) : (
    <View style={styles.footer}>
      <View style={{ flex: 1 }}>
        <Input
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={3}
          inputContainerStyle={{ height: 100 }}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <TouchableOpacity
        onPress={() => setShowPhotoSheet(!showPhotoSheet)}
        style={styles.squareActionBtn}
        activeOpacity={0.7}
      >
        <AppIcon
          name={'Upload'}
          size={ICON_SIZE.sm}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.squareActionBtn,
          styles.sendBtn,
          (!canSend || sending) && styles.disabledSendBtn,
        ]}
        onPress={handleSend}
        disabled={sending || !canSend}
        activeOpacity={0.8}
      >
        {sending ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <AppIcon name={'Send'} size={ICON_SIZE.sm} color={COLORS.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(ChatInputBar);
const styles = StyleSheet.create({
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
    borderColor: COLORS.slate200,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.slate50,
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
    backgroundColor: COLORS.divider,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
  },
  disabledSendBtn: {
    opacity: 0.5,
    backgroundColor: COLORS.black,
  },
});
