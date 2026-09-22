import { View, Text, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import styles from './ShipmentLocationModal.styles';
import AppIcon from '../../app_icon/AppIcon';
import AppText from '../AppText';
import { COLORS } from '../../../constants';

interface InterfaceShipmentLocationFooter {
  handleOpenExternalMaps: () => void;
  onClose: () => void;
}

const ShipmentLocationFooter = ({
  handleOpenExternalMaps,
  onClose,
}: InterfaceShipmentLocationFooter) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={handleOpenExternalMaps}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Get Directions"
        accessibilityHint="Opens external map application for directions"
      >
        <AppIcon
          name={'Navigation'}
          size={18}
          color={COLORS.primary}
          strokeWidth={2.2}
          style={{ marginRight: 8 }}
        />
        <AppText style={styles.mapButtonText}>Get Directions</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closePrimaryBtn}
        onPress={onClose}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <AppText style={styles.closePrimaryText}>Close</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(ShipmentLocationFooter);
