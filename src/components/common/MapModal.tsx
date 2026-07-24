import React, { memo } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  distance?: string;
  pickupCoords?: { latitude: number; longitude: number };
  deliveryCoords?: { latitude: number; longitude: number };
}

const MapModal = ({
  visible,
  onClose,
  distance = '200 miles',
  pickupCoords,
  deliveryCoords,
}: MapModalProps) => {
  // Default coordinates if none provided (for demo)
  const pickup = pickupCoords || { latitude: 41.282, longitude: -73.918 };
  const delivery = deliveryCoords || { latitude: 41.671, longitude: -72.949 };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <AppText style={styles.title}>Map view</AppText>

            <View style={styles.distanceContainer}>
              <AppText style={styles.distanceLabel}>Estimated distance</AppText>
              <AppText style={styles.distanceValue}>{distance}</AppText>
            </View>
          </View>

          {/* Map Section */}
          <View style={styles.mapWrapper}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: (pickup.latitude + delivery.latitude) / 2,
                longitude: (pickup.longitude + delivery.longitude) / 2,
                latitudeDelta:
                  Math.abs(pickup.latitude - delivery.latitude) * 2,
                longitudeDelta:
                  Math.abs(pickup.longitude - delivery.longitude) * 2,
              }}
              scrollEnabled={false} // Matches the "Static view" look in your image
            >
              <Marker coordinate={pickup} pinColor={COLORS.goldPrimary} />
              <Marker coordinate={delivery} pinColor={COLORS.error} />

              <Polyline
                coordinates={[pickup, delivery]}
                strokeColor={COLORS.info} // Blue line like image
                strokeWidth={3}
              />
            </MapView>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <AppText style={styles.closeBtnText}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl, // Match the large corners in image
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  distanceContainer: {
    marginBottom: SPACING.sm,
  },
  distanceLabel: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  mapWrapper: {
    height: 300,
    width: '100%',
    borderRadius: RADIUS.md,
    overflow: 'hidden', // Ensures map doesn't bleed over rounded corners
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtn: {
    backgroundColor: '#F2F4F5', // Light grey background like image
    height: 52,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  closeBtnText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

export default memo(MapModal);
