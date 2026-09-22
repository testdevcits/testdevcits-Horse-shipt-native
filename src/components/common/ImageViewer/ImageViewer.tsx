import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';

import { AlertCircle, X } from 'lucide-react-native';

import AppText from '../AppText';
import { COLORS, ICON_SIZE, SPACING } from '../../../constants';
import styles from './ImageViewer.styles';

type Props = {
  visible: boolean;
  image: string | ImageSourcePropType;
  onClose: () => void;
  title?: string;
};

const ImageViewer = ({ visible, image, onClose, title }: Props) => {
  const { width, height } = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Convert string URL / local image source
   * into React Native ImageSourcePropType.
   */
  const imageSource = useMemo<ImageSourcePropType>(() => {
    return typeof image === 'string' ? { uri: image } : image;
  }, [image]);

  /**
   * Reset image state whenever:
   * - modal opens
   * - image changes
   */
  useEffect(() => {
    if (visible) {
      setLoading(true);
      setHasError(false);
    }
  }, [visible, image]);

  /**
   * Close viewer.
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Image successfully loaded.
   */
  const handleLoad = useCallback(() => {
    setLoading(false);
    setHasError(false);
  }, []);

  /**
   * Image failed to load.
   */
  const handleError = useCallback(() => {
    setLoading(false);
    setHasError(true);
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title ? (
              <AppText style={styles.title} numberOfLines={1}>
                {title}
              </AppText>
            ) : null}
          </View>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close image viewer"
          >
            <X size={ICON_SIZE.md} color={COLORS.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Image Area */}
        <View style={styles.imageContainer}>
          {/* Loading */}
          {loading && !hasError ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.white} />
            </View>
          ) : null}

          {/* Error State */}
          {hasError ? (
            <View style={styles.errorContainer}>
              <View style={styles.errorIcon}>
                <AlertCircle
                  size={ICON_SIZE.xl}
                  color={COLORS.white}
                  strokeWidth={2}
                />
              </View>

              <AppText style={styles.errorTitle}>Unable to load image</AppText>

              <AppText style={styles.errorMessage}>
                Please check the image and try again.
              </AppText>

              <Pressable
                onPress={() => {
                  setHasError(false);
                  setLoading(true);
                }}
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
              >
                <AppText style={styles.retryText}>Retry</AppText>
              </Pressable>
            </View>
          ) : (
            <Image
              source={imageSource}
              style={[
                styles.image,
                {
                  width: width - SPACING.xxl,
                  height: height * 0.72,
                },
              ]}
              resizeMode="contain"
              onLoadStart={() => {
                setLoading(true);
                setHasError(false);
              }}
              onLoad={handleLoad}
              onError={handleError}
              fadeDuration={Platform.OS === 'android' ? 200 : undefined}
              accessibilityRole="image"
              accessibilityLabel={title || 'Preview image'}
            />
          )}
        </View>

        {/* Bottom Close Area */}
        <View style={styles.bottomContainer}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.doneButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Close image viewer"
          >
            <AppText style={styles.doneText}>Close</AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ImageViewer);
