import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { ToastConfig, BaseToastProps } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';

const { width } = Dimensions.get('window');

/**
 * Base Component for all Toast Types
 * Ensures consistent layout, shadows, and spacing
 */
const CustomToastBase = ({
  text1,
  text2,
  icon: Icon,
  color
}: {
  text1?: string;
  text2?: string;
  icon: any;
  color: string
}) => (
  <View style={[styles.container, { borderLeftColor: color }]}>
    {/* Icon Section with subtle background tint */}
    <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
      <Icon size={20} color={color} strokeWidth={2.5} />
    </View>

    {/* Text Content Section */}
    <View style={styles.content}>
      {text1 && (
        <AppText style={styles.title} numberOfLines={1}>
          {text1}
        </AppText>
      )}
      {text2 && (
        <AppText style={styles.message} numberOfLines={2}>
          {text2}
        </AppText>
      )}
    </View>

    {/* Right Accent (Subtle divider) */}
    <View style={styles.rightPadding} />
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props: BaseToastProps) => (
    <CustomToastBase
      text1={props.text1}
      text2={props.text2}
      icon={CheckCircle2}
      color={COLORS.success}
    />
  ),
  error: (props: BaseToastProps) => (
    <CustomToastBase
      text1={props.text1}
      text2={props.text2}
      icon={AlertCircle}
      color={COLORS.error}
    />
  ),
  info: (props: BaseToastProps) => (
    <CustomToastBase
      text1={props.text1}
      text2={props.text2}
      icon={Info}
      color={COLORS.primary}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    minHeight: 65,
    width: width * 0.92, // Standard responsive width for mobile
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderLeftWidth: 5,

    // Premium Shadow (Stripe Style)
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 10,

    // Safety margin for Top positioning
    marginTop: Platform.OS === 'ios' ? 0 : 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  message: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,

    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  rightPadding: {
    width: 10,
  }
});