import React, { memo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;
  editable?: boolean;
  pointerEvents?: any;
}

const SearchBarCompt: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  containerStyle,
  onClear,
  editable,
  pointerEvents,
}) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Search size={ICON_SIZE.sm} color={COLORS.grey400} strokeWidth={2} />

      <TextInput
        allowFontScaling={false}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey400}
        selectionColor={COLORS.goldPrimary}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        editable={editable}
        pointerEvents={pointerEvents}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <XCircle size={ICON_SIZE.sm} color={COLORS.grey300} fill={COLORS.grey100} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SearchBarCompt);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    height: 42,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: SPACING.xs,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
});