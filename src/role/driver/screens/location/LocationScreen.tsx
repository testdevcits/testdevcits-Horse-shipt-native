

// src/screens/location/LocationScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,

} from 'react-native';
import { Map, Compass, Zap } from 'lucide-react-native';
import Geolocation from 'react-native-geolocation-service';

import { COLORS, FONTS } from '../../../../constants';
import AppText from '../../../../components/common/AppText';
import DriverHeader from '../../../../components/common/DriverHeader';
import ConfirmationModal from '../../../../components/common/ConfirmationModal';
import { useDriverMe } from '../../../../hooks/useDriverMe';

// Import our new helper methods
import { requestLocationPermission, openDeviceSettings } from '../../../../utils/permissionHelper';
import driverService from '../../../../api/services/driverService';
import { RouteMapModal } from './RouteMapModal';
import styles from './styles.location';



const LocationScreen = () => {
  const { driver, activeShipment, loading } = useDriverMe();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isAutoTracking, setIsAutoTracking] = useState(false);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Modal Configuration State
  const [modalConfig, setModalConfig] = useState({
    isVisible: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'danger' | 'info' | 'warning',
    confirmText: 'Got It',
    cancelText: 'Close',
    onConfirm: () => { },
  });

  const fallbackLat = activeShipment?.shipment?.currentLocation?.latitude ?? 22.7378479;
  const fallbackLng = activeShipment?.shipment?.currentLocation?.longitude ?? 75.8882395;
  const displayLat = liveCoords ? liveCoords.lat : fallbackLat;
  const displayLng = liveCoords ? liveCoords.lng : fallbackLng;

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isVisible: false }));
  };

  // Live Sync handler using helper
  const handleUpdateLocation = async () => {
    setIsUpdating(true);

    // Pass callback to configure modal details if permission is blocked in OS
    const hasPermission = await requestLocationPermission((title, message) => {
      setModalConfig({
        isVisible: true,
        title,
        description: message,
        type: 'warning',
        confirmText: 'Configure', // Action button to settings
        cancelText: 'Cancel',
        onConfirm: () => {
          closeModal();
          openDeviceSettings(); // Open system app settings directly
        },
      });
    });

    if (!hasPermission) {
      setIsUpdating(false);
      return;
    }

    // Permission granted, query geolocation hardware
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        setLiveCoords({ lat: latitude, lng: longitude });

        try {
          const response = await driverService.updateLocation({
            lat: latitude,
            lng: longitude,
            speed: speed ?? 0,
            heading: heading ?? 0,
          });

          if (response.success) {
            setModalConfig({
              isVisible: true,
              title: 'Location Synced',
              description: `Success! Live position (Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}) has been shared with dispatch.`,
              type: 'success',
              confirmText: 'Got It',
              cancelText: 'Close',
              onConfirm: closeModal,
            });
            setMapVisible(true)
          }
        } catch (apiError: any) {
          setModalConfig({
            isVisible: true,
            title: 'Sync Failed',
            description: apiError?.message || 'Failed to transmit coordinates to server.',
            type: 'danger',
            confirmText: 'Retry',
            cancelText: 'Close',
            onConfirm: () => {
              closeModal();
              handleUpdateLocation();
            },
          });
        } finally {
          setIsUpdating(false);
        }
      },
      (error) => {
        setModalConfig({
          isVisible: true,
          title: 'GPS Signal Lock Failed',
          description: error.message || 'Could not acquire active position markers from device hardware.',
          type: 'danger',
          confirmText: 'OK',
          cancelText: 'Close',
          onConfirm: closeModal,
        });
        setIsUpdating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleToggleAutoTrack = async () => {
    const nextState = !isAutoTracking;

    if (nextState) {
      // Run quick check when initiating auto tracking
      const hasPermission = await requestLocationPermission((title, message) => {
        setModalConfig({
          isVisible: true,
          title,
          description: message,
          type: 'warning',
          confirmText: 'Configure',
          cancelText: 'Cancel',
          onConfirm: () => {
            closeModal();
            openDeviceSettings();
          },
        });
      });
      if (!hasPermission) return;
    }

    setIsAutoTracking(nextState);

    setModalConfig({
      isVisible: true,
      title: nextState ? 'Auto-Track Active' : 'Auto-Track Paused',
      description: nextState
        ? 'Your background GPS stream is now active. Dispatchers will receive automatic position updates every 60 seconds.'
        : 'Background coordinates stream has been safely paused.',
      type: nextState ? 'success' : 'warning',
      confirmText: 'Got It',
      cancelText: 'Close',
      onConfirm: closeModal,
    });
  };


  const [mapVisible, setMapVisible] = useState(false);

  // Mock locations for example
  const shipmentSample = {
    pickupLocation: "New Mexico, USA",
    deliveryLocation: "Washington, DC, USA",
    pickupCoords: { latitude: 34.9727305, longitude: -105.0323635 },
    deliveryCoords: { latitude: 38.9072873, longitude: -77.0369274 },
  };

  if (loading && !driver) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.goldPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.screenWrapper}>
        <DriverHeader
          name={driver?.name || 'Test Driver'}
          statusText={driver?.driverStatus || 'ON TRIP'}
          profileImageUrl={driver?.profileImage?.url}
          isOnline={driver?.isActive !== false}
        />

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trackingCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.mapIconContainer}>
                <Map size={22} color={COLORS.white} />
              </View>
              <View style={styles.headerTextWrapper}>
                <AppText style={styles.cardHeaderTitle}>Location Tracking</AppText>
                <AppText style={styles.cardHeaderSubtitle}>Update and open your live map</AppText>
              </View>
            </View>

            <View style={styles.highlightInfoBox}>
              <AppText style={styles.highlightLabel}>DRIVER</AppText>
              <AppText style={styles.driverName}>{driver?.name || 'Test Driver'}</AppText>
              <AppText style={styles.coordinateText}>
                Lat {displayLat.toFixed(5)}, Lng {displayLng.toFixed(5)}
              </AppText>
            </View>

            <TouchableOpacity
              style={styles.goldButton}
              onPress={handleUpdateLocation}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Compass size={18} color={COLORS.white} style={styles.btnIcon} />
                  <AppText style={styles.buttonText}>Update My Location</AppText>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goldButton,
                isAutoTracking && styles.autoTrackActiveButton
              ]}
              onPress={handleToggleAutoTrack}
              activeOpacity={0.8}
            >
              <Zap size={18} color={COLORS.white} style={styles.btnIcon} />
              <AppText style={styles.buttonText}>
                {isAutoTracking ? 'Stop Auto-Track' : 'Start Auto-Track'}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <AppText style={styles.tipLabel}>TIP</AppText>
            <AppText style={styles.tipDescription}>
              Tap update to sync your current position and open the route map.
            </AppText>
          </View>
        </ScrollView>
      </View>

      <ConfirmationModal
        isVisible={modalConfig.isVisible}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />


      {/* Put the Modal instance directly at the root of the screen component */}
      <RouteMapModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        pickupLocation={shipmentSample.pickupLocation}
        deliveryLocation={shipmentSample.deliveryLocation}
        pickupCoords={shipmentSample.pickupCoords}
        deliveryCoords={shipmentSample.deliveryCoords}
      />
    </View>
  );
};

export default LocationScreen;
