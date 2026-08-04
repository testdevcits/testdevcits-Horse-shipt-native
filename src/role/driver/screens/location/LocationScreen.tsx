// src/screens/location/LocationScreen.tsx
import React, { useState, useEffect } from 'react';
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

// Import permission helper and auto location service
import {
  requestLocationPermission,
  requestBackgroundLocationPermission,
  openDeviceSettings,
} from '../../../../utils/permissionHelper';
import {
  startAutoTracking,
  stopAutoTracking,
  isAutoTrackingActive,
  getStoredAutoTrackingState,
} from '../../../../services/autoLocationService';
import driverService from '../../../../api/services/driverService';
import styles from './styles.location';
import { RouteMapModal } from './RouteMapModal';

const LocationScreen = () => {
  const { driver, activeShipment, loading } = useDriverMe();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isAutoTracking, setIsAutoTracking] = useState(false);
  const [liveCoords, setLiveCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Sync auto tracking state on mount
  useEffect(() => {
    const checkState = async () => {
      const isRunning = isAutoTrackingActive();
      const isStored = await getStoredAutoTrackingState();
      if (isRunning || isStored) {
        setIsAutoTracking(true);
      }
    };
    checkState();
  }, []);

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

  const fallbackLat =
    activeShipment?.shipment?.currentLocation?.latitude ?? 22.7378479;
  const fallbackLng =
    activeShipment?.shipment?.currentLocation?.longitude ?? 75.8882395;
  const displayLat = liveCoords ? liveCoords.lat : fallbackLat;
  const displayLng = liveCoords ? liveCoords.lng : fallbackLng;

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isVisible: false }));
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
      async position => {
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
              description: `Success! Live position (Lat: ${latitude.toFixed(
                5,
              )}, Lng: ${longitude.toFixed(5)}) has been shared with dispatch.`,
              type: 'success',
              confirmText: 'Got It',
              cancelText: 'Close',
              onConfirm: closeModal,
            });
            setMapVisible(true);
          }
        } catch (apiError: any) {
          setModalConfig({
            isVisible: true,
            title: 'Sync Failed',
            description:
              apiError?.message || 'Failed to transmit coordinates to server.',
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
      error => {
        setModalConfig({
          isVisible: true,
          title: 'GPS Signal Lock Failed',
          description:
            error.message ||
            'Could not acquire active position markers from device hardware.',
          type: 'danger',
          confirmText: 'OK',
          cancelText: 'Close',
          onConfirm: closeModal,
        });
        setIsUpdating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleToggleAutoTrack = async () => {
    const nextState = !isAutoTracking;

    if (nextState) {
      // Mandate background location permission before starting auto-tracking
      const hasPermission = await requestBackgroundLocationPermission(
        (title, message) => {
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
        },
      );

      if (!hasPermission) {
        return;
      }

      const started = await startAutoTracking();
      if (!started) {
        setModalConfig({
          isVisible: true,
          title: 'Auto-Track Error',
          description: 'Could not start background tracking service.',
          type: 'danger',
          confirmText: 'OK',
          cancelText: 'Close',
          onConfirm: closeModal,
        });
        return;
      }

      setIsAutoTracking(true);

      setModalConfig({
        isVisible: true,
        title: 'Auto-Track Active',
        description:
          'Background location tracking is now active. Coordinates are updated every 5 seconds while app is open and every 10 seconds when backgrounded or closed.',
        type: 'success',
        confirmText: 'Got It',
        cancelText: 'Close',
        onConfirm: closeModal,
      });
    } else {
      await stopAutoTracking();
      setIsAutoTracking(false);

      setModalConfig({
        isVisible: true,
        title: 'Auto-Track Paused',
        description: 'Background location tracking has been safely stopped.',
        type: 'warning',
        confirmText: 'Got It',
        cancelText: 'Close',
        onConfirm: closeModal,
      });
    }
  };

  const [mapVisible, setMapVisible] = useState(false);



  if (loading && !driver) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
                <AppText style={styles.cardHeaderTitle}>
                  Location Tracking
                </AppText>
                <AppText style={styles.cardHeaderSubtitle}>
                  Update and open your live map
                </AppText>
              </View>
            </View>

            <View style={styles.highlightInfoBox}>
              <AppText style={styles.highlightLabel}>DRIVER</AppText>
              <AppText style={styles.driverName}>
                {driver?.name || 'Test Driver'}
              </AppText>
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
                  <Compass
                    size={18}
                    color={COLORS.white}
                    style={styles.btnIcon}
                  />
                  <AppText style={styles.buttonText}>
                    Update My Location
                  </AppText>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goldButton,
                isAutoTracking && styles.autoTrackActiveButton,
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
        isVisible={modalConfig?.isVisible}
        onClose={closeModal}
        onConfirm={modalConfig?.onConfirm}
        title={modalConfig?.title}
        description={modalConfig?.description}
        type={modalConfig?.type}
        confirmText={modalConfig?.confirmText}
        cancelText={modalConfig?.cancelText}
      />

      {/* Put the Modal instance directly at the root of the screen component */}
      <RouteMapModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        pickupLocation={activeShipment?.shipment?.pickupLocation}
        deliveryLocation={activeShipment?.shipment?.deliveryLocation}
        pickupCoords={activeShipment?.shipment?.pickupCoords}
        deliveryCoords={activeShipment?.shipment?.deliveryCoords}
      />
    </View>
  );
};

export default LocationScreen;
