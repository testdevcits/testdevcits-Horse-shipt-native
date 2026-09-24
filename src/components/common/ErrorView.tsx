import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, { memo } from 'react';
import AppText from './AppText';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
  ICON_SIZE,
} from '../../constants';
import AppIcon, { IconName } from '../app_icon/AppIcon';

export interface ErrorViewProps {
  title?: string;
  subtitle?: string;
  message?: string; // backwards compatibility
  icon?: IconName;
  statusCode?: number | string;
  onRetry?: () => void;
  retryText?: string;
  isRetrying?: boolean;
  onBack?: () => void;
  backText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const ErrorView = ({
  title,
  subtitle,
  message,
  icon,
  statusCode,
  onRetry,
  retryText = 'Try Again',
  isRetrying = false,
  onBack,
  backText = 'Go Back',
  containerStyle,
}: ErrorViewProps) => {
  const is500 = statusCode === 500 || statusCode === '500';

  const displayTitle =
    title ||
    (is500 ? 'Server Under Maintenance' : 'Oops! Something went wrong');

  const displaySubtitle =
    subtitle ||
    message ||
    (is500
      ? 'Our servers are experiencing temporary issues (500 Error). Please try again in a few moments.'
      : 'An unexpected error occurred while loading data. Please check your connection and try again.');

  const displayIcon: IconName =
    icon || (is500 ? 'AlertTriangle' : 'AlertCircle');

  const badgeText = statusCode
    ? `HTTP ${statusCode} ${is500 ? 'SERVER ERROR' : 'ERROR'}`
    : is500
    ? '500 SERVER ERROR'
    : null;

  return (
    <View style={[styles.centerContainer, containerStyle]}>
      {/* Icon Wrapper with glowing circle background */}
      <View style={styles.iconCircleOuter}>
        <View style={styles.iconCircleInner}>
          <AppIcon
            name={displayIcon}
            size={ICON_SIZE.giant || 38}
            color={COLORS.error}
          />
        </View>
      </View>

      {/* HTTP Status Code Pill */}
      {badgeText && (
        <View style={styles.badgeContainer}>
          <View style={styles.badgeDot} />
          <AppText style={styles.badgeText}>{badgeText}</AppText>
        </View>
      )}

      {/* Title */}
      <AppText style={styles.errorTitle}>{displayTitle}</AppText>

      {/* Subtitle / Message */}
      <AppText style={styles.errorMessage}>{displaySubtitle}</AppText>

      {/* Action Buttons Row */}
      <View style={styles.actionsContainer}>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            disabled={isRetrying}
            activeOpacity={0.8}
          >
            {isRetrying ? (
              <ActivityIndicator
                size="small"
                color={COLORS.white}
                style={{ marginRight: SPACING.xs }}
              />
            ) : (
              <AppIcon
                name={'RefreshCcw'}
                size={ICON_SIZE.xs}
                color={COLORS.white}
                style={{ marginRight: SPACING.xs }}
              />
            )}
            <AppText style={styles.retryText}>{retryText}</AppText>
          </TouchableOpacity>
        )}

        {onBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <AppIcon
              name={'ChevronLeft'}
              size={ICON_SIZE.sm}
              color={COLORS.textPrimary}
              style={{ marginRight: SPACING.xs }}
            />
            <AppText style={styles.backText}>{backText}</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(ErrorView);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.giant,
    backgroundColor: COLORS.background,
  },
  iconCircleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircleInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    marginBottom: SPACING.sm,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    marginRight: SPACING.xs,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    letterSpacing: 0.5,
  },
  errorTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xxl || 20,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md || 14,
    lineHeight: 22,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
    maxWidth: 320,
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.sm,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.round,
    minWidth: 160,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    minWidth: 140,
  },
  backText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
  },
});

