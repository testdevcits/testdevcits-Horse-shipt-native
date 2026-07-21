import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Search, XCircle } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;
}

const SearchBarCompt: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  containerStyle,
  onClear,
}) => {
  
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Search size={18} color={COLORS.grey400} strokeWidth={2} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey400}
        selectionColor={COLORS.goldPrimary}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />

      {value.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <XCircle size={18} color={COLORS.grey300} fill={COLORS.grey100} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBarCompt;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50, // Matches your grey50 constant
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: SPACING.sm,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 0, // Fixes vertical alignment on some Android versions
  },
});