import React, { useState } from 'react';
import {
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import styles from './Input.styles';
import { COLORS } from '../../../constants';
import AppText from '../AppText';
import { Eye, EyeOff } from 'lucide-react-native';

import { StyleProp, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

const Input = ({
  label,
  error,
  isPassword = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled,
  secureTextEntry,
  containerStyle,
  inputContainerStyle,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isSecure =
    secureTextEntry !== undefined
      ? secureTextEntry
      : isPassword
      ? !showPassword
      : false;

  const renderRightIcon = () => {
    if (rightIcon) {
      if (onRightIconPress) {
        return (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={10}>
            {rightIcon}
          </TouchableOpacity>
        );
      }
      if (isPassword) {
        return (
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            hitSlop={10}>
            {rightIcon}
          </TouchableOpacity>
        );
      }
      return rightIcon;
    }

    if (isPassword) {
      return (
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)}
          hitSlop={10}>
          {showPassword ? (
            <EyeOff size={20} color={COLORS.textSecondary} />
          ) : (
            <Eye size={20} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}

      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          focused && styles.focusedBorder,
          error && styles.errorBorder,
          disabled && styles.disabledBorder,
        ]}>
        {leftIcon ? (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        ) : null}

        <TextInput
          {...props}
          style={[styles.input, props.style]}
          secureTextEntry={isSecure}
          placeholderTextColor={COLORS.textLight}
          allowFontScaling={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled && props.editable !== false}
        />

        {renderRightIcon()}
      </View>

      {!!error && <AppText style={styles.error}>{error}</AppText>}
    </View>
  );
};

export default Input;