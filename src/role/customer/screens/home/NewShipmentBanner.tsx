import React, { memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { Truck } from 'lucide-react-native';

import { AppText } from '../../../../components';
import imageIndex from '../../../../assets/images/imageIndex';
import COLORS from '../../../../constants/colors';
import { FONTS } from '../../../../constants/fonts';
import {
  SCREEN_WIDTH,
  SPACING,
  RADIUS,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../constants/dimensions';

interface NewShipmentBannerProps {
  onPress: () => void;
}

const NewShipmentBanner: React.FC<NewShipmentBannerProps> = ({ onPress }) => {
  return (
    <ImageBackground
      source={imageIndex.Banner}
      style={styles.banner}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.content}>
        <Truck
          size={ICON_SIZE.xl}
          color={COLORS.primaryLight}
          strokeWidth={2.5}
        />

        <AppText style={styles.title}>Start a new</AppText>

        <AppText style={styles.highlight}>Shipment</AppText>

        <AppText style={styles.description}>
          Book trusted horse transport in just
          {'\n'}a few steps.
        </AppText>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Start new shipment"
        >
          <AppText style={styles.buttonText}>Start new shipment</AppText>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
    minHeight: 216,
    width: SCREEN_WIDTH - SPACING.lg,
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grey700,
  },

  image: {
    borderRadius: RADIUS.md,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay20,
  },

  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'flex-start',
  },

  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    lineHeight: FONT_SIZE.xl * 1.2,
  },

  highlight: {
    color: COLORS.primaryLight,
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    lineHeight: FONT_SIZE.xl * 1.2,
  },

  description: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    lineHeight: FONT_SIZE.md * 1.4,
    marginTop: SPACING.xxs,
    marginBottom: SPACING.sm,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semiBold,
  },
});

export default memo(NewShipmentBanner);
