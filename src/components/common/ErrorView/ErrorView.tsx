import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, { memo } from 'react';
import AppText from '../AppText';
import { COLORS, SPACING, ICON_SIZE } from '../../../constants';
import AppIcon, { IconName } from '../../app_icon/AppIcon';
import styles from './ErrorView.Styles';

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
