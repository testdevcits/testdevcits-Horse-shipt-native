import React, { useCallback, useMemo, useRef, useEffect, memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, ICON_SIZE } from '../../../constants';
import AppText from '../AppText';
import AppIcon from '../../app_icon/AppIcon';
import styles from './PhotoSourceSheet.styles';

// Using your provided constants

interface Props {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onRemove?: () => void;
  hasImage?: boolean;
}

const PhotoSourceSheet = ({
  visible,
  onClose,
  onCamera,
  onGallery,
  onRemove,
  hasImage,
}: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // Handle open/close based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  // Snap points (height of the sheet)
  const snapPoints = useMemo(() => (hasImage ? ['40%'] : ['32%']), [hasImage]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsAtIndex={-1}
        appearsAtIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handlePress = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom + SPACING.md }]}
      >
        <AppText style={styles.title}>Profile Photo</AppText>

        <View style={styles.optionsContainer}>
          {/* Camera Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handlePress(onCamera)}
          >
            <AppIcon
              name={'Camera'}
              size={ICON_SIZE.md}
              color={COLORS.textPrimary}
            />
            <AppText style={styles.optionText}>Take Photo</AppText>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Gallery Option */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => handlePress(onGallery)}
          >
            <AppIcon
              name={'Image'}
              size={ICON_SIZE.md}
              color={COLORS.textPrimary}
            />
            <AppText style={styles.optionText}>Choose from Gallery</AppText>
          </TouchableOpacity>

          {/* Remove Option (Only if hasImage is true) */}
          {hasImage && onRemove && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.option}
                onPress={() => handlePress(onRemove)}
              >
                <AppIcon
                  name={'Trash2'}
                  size={ICON_SIZE.md}
                  color={COLORS.error}
                />
                <AppText style={[styles.optionText, { color: COLORS.error }]}>
                  Remove Current Photo
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <AppText style={styles.cancelText}>Cancel</AppText>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default memo(PhotoSourceSheet);
