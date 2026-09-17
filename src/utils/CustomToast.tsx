import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  LucideIcon,
} from 'lucide-react-native';

import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  SIZES,
} from '../constants';
import { AppText } from '../components';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface CustomToastProps {
  type?: ToastType;
  text1?: string;
  text2?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

interface ToastTheme {
  color: string;
  bgTint: string;
  icon: LucideIcon;
  borderAccent: string;
}

const TOAST_THEMES: Record<ToastType, ToastTheme> = {
  success: {
    color: COLORS.success,
    bgTint: `${COLORS.success}15`,
    icon: CheckCircle2,
    borderAccent: COLORS.success,
  },
  error: {
    color: COLORS.error,
    bgTint: `${COLORS.error}15`,
    icon: AlertCircle,
    borderAccent: COLORS.error,
  },
  warning: {
    color: COLORS.warning,
    bgTint: `${COLORS.warning}15`,
    icon: AlertTriangle,
    borderAccent: COLORS.warning,
  },
  info: {
    color: COLORS.info || COLORS.primary,
    bgTint: `${COLORS.info || COLORS.primary}15`,
    icon: Info,
    borderAccent: COLORS.info || COLORS.primary,
  },
};

const { width } = Dimensions.get('window');

const CustomToast: React.FC<CustomToastProps> = ({
  type = 'info',
  text1,
  text2,
  icon,
  onPress,
  onClose,
  showCloseButton = false,
  style,
  titleStyle,
  messageStyle,
}) => {
  const theme = TOAST_THEMES[type] || TOAST_THEMES.info;
  const IconComponent = icon || theme.icon;

  const ContentWrapper = onPress ? TouchableOpacity : View;

  return (
    <ContentWrapper
      style={[
        styles.container,
        { borderLeftColor: theme.borderAccent },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Icon Badge Container */}
      <View style={[styles.iconWrapper, { backgroundColor: theme.bgTint }]}>
        <IconComponent size={20} color={theme.color} strokeWidth={2.5} />
      </View>

      {/* Text Content */}
      <View style={styles.content}>
        {text1 ? (
          <AppText style={[styles.title, titleStyle]} numberOfLines={1}>
            {text1}
          </AppText>
        ) : null}
        {text2 ? (
          <AppText style={[styles.message, messageStyle]} numberOfLines={2}>
            {text2}
          </AppText>
        ) : null}
      </View>

      {/* Optional Close Button or End Margin */}
      {showCloseButton && onClose ? (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    minHeight: 64,
    backgroundColor: COLORS.surface || COLORS.white,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderLeftWidth: 5,
    alignSelf: 'center',

    // Professional Card Shadow
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,

    // Safe spacing for platform header overlays
    marginTop: Platform.OS === 'ios' ? 0 : 8,
  },

  iconWrapper: {
    width: SIZES.avatarMd,
    height: SIZES.avatarMd,
    borderRadius: RADIUS.circle || 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },

  message: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.lg,
  },

  closeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightSpacer: {
    width: SPACING.xs,
  },
});

export default CustomToast;