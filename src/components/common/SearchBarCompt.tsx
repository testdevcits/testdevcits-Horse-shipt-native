import React, { memo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, ICON_SIZE } from '../../constants';
import Input from './Input/Input';

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
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.grey400}
      selectionColor={COLORS.primary}
      autoCapitalize="none"
      autoCorrect={false}
      editable={editable}
      pointerEvents={pointerEvents}
      leftIcon={
        <Search size={ICON_SIZE.sm} color={COLORS.grey400} strokeWidth={2} />
      }
      rightIcon={
        value.length > 0 ? (
          <XCircle size={ICON_SIZE.sm} color={COLORS.grey300} fill={COLORS.grey100} />
        ) : undefined
      }
      onRightIconPress={handleClear}
      containerStyle={[{ marginBottom: 0 }, containerStyle]}
      inputContainerStyle={{
        height: 42,
        backgroundColor: COLORS.grey50,
        borderColor: COLORS.divider,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.md,
      }}
    />
  );
};

export default memo(SearchBarCompt);