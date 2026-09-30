import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import AppText from '../AppText';
import { FONT_SIZE, FONTS } from '../../../constants';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  activeColor?: string;
  inActiveColor?: string;
  thumbColor?: string;
  showLabels?: boolean;
  onText?: string;
  offText?: string;
  disabled?: boolean;
  style?: ViewStyle;
  width?: number;
  height?: number;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  activeColor = '#10B981', // Green color from design
  inActiveColor = '#E2E8F0',
  thumbColor = '#FFFFFF',
  showLabels = true,
  onText = 'ON',
  offText = 'OFF',
  disabled = false,
  style,
  width = 60,
  height = 30,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const toggle = () => {
    if (disabled) return;
    onValueChange(!value);
  };

  const padding = 3;
  const thumbSize = height - padding * 2;
  const translateXMax = width - thumbSize - padding * 2;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, translateXMax],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inActiveColor, activeColor],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggle}
      disabled={disabled}
      style={[style, disabled && { opacity: 0.6 }]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor,
          },
        ]}
      >
        {showLabels && (
          <>
            <AppText
              style={[
                styles.labelText,
                styles.onText,
                { opacity: value ? 1 : 0, fontSize: height * 0.35 },
              ]}
              numberOfLines={1}
            >
              {onText}
            </AppText>
            <AppText
              style={[
                styles.labelText,
                styles.offText,
                { opacity: value ? 0 : 1, fontSize: height * 0.35 },
              ]}
              numberOfLines={1}
            >
              {offText}
            </AppText>
          </>
        )}

        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    left: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  labelText: {
    position: 'absolute',
    letterSpacing: 0.5,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs
  },
  onText: {
    left: 10,
    color: '#FFFFFF',
  },
  offText: {
    right: 8,
    color: '#94A3B8',
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs
  },
});

export default CustomSwitch;
