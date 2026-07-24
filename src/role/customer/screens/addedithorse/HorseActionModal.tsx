import React, { memo } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';

interface HorseActionModalProps {
  visible: boolean;
  title?: string;
  description?: string;
}

const HorseActionModal = ({
  visible,
  title = 'Adding Horse',
  description = 'Adding your horse... Please wait while we save the details.',
}: HorseActionModalProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent // Ensures backdrop covers the whole screen on Android
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 1. Horse Silhouette Image */}
          <View style={styles.imageContainer}>
            <Image
              source={imageIndex.racinghorse} // Replace with your actual path
              style={styles.horseImage}
              resizeMode="contain"
            />
          </View>

          {/* 2. Title */}
          <AppText style={styles.title}>{title}</AppText>

          {/* 3. Description */}
          <AppText style={styles.description}>{description}</AppText>

          {/* 4. Optional: Loading Indicator for better UX */}
          <ActivityIndicator
            color={COLORS.goldPrimary}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed backdrop
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 24, // Matches the large rounded corners in the image
    padding: SPACING.xxxl,
    alignItems: 'center',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  imageContainer: {
    marginBottom: SPACING.xl,
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horseImage: {
    width: 180,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: '#333333',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
  },
});

// Use React.memo to ensure the modal only re-renders if 'visible' or text changes
export default memo(HorseActionModal);
