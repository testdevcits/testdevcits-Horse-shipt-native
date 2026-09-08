// src/screens/home/HomeScreen.tsx
import React, { lazy, Suspense, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { RotateCw } from 'lucide-react-native';

// Imported design systems & components
import { useDriverMe } from '../../../../hooks/useDriverMe';
import { AppText, Button, DriverHeader } from '../../../../components';
import styles from './styles.home';
import { COLORS, SPACING } from '../../../../constants';
import Toast from 'react-native-toast-message';
import VahicleInfoCard from './VahicleInfoCard';
import ActiveShipment from './ActiveShipment';
import HorseInformation from './HorseInformation';
import { RouteMapModal } from '../location/RouteMapModal';
import AppButton from '../../../../components/common/Button/AppButton';
import AppIcon from '../../../../components/AppIcon';

const HomeScreen = ({ navigation }: any) => {
  const ConfirmationModal = lazy(
    () => import('../../../../components/common/ConfirmationModal'),
  );
  const LocationPermissionModal = lazy(
    () => import('../../../../components/common/LocationPermissionModal'),
  );

  const {
    driver,
    vehicle,
    activeShipment,
    loading,
    refresh,
    handleStartTrip,
    startTripLoading,
    isLocationPermissionModalVisible,
    locationModalTitle,
    locationModalMessage,
    closeLocationPermissionModal,
  } = useDriverMe();

  // Collapsible accordion state for the Assigned Vehicle card [1]
  const [isVehicleCollapsed, setIsVehicleCollapsed] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const onStartTrip = async () => {
    if (!activeShipment?._id || !activeShipment?.shipment?._id) {
      Toast.show({
        type: 'error',
        text1: 'Unable to start trip',
        text2: 'Quote ID not found.',
      });
      return;
    }

    try {
      const response = await handleStartTrip(activeShipment?._id);

      Toast.show({
        type: 'success',
        text1: 'Trip Started',
        text2: response?.message || 'Trip started successfully.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Start Trip',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.',
      });

      console.error(error);
    }
  };

  if (loading && !driver) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Parse location short names (e.g. "New Mexico, USA" -> "New Mexico") [1]
  const getShortLocation = (fullName?: string) => {
    if (!fullName) return 'N/A';
    return fullName.split(',')[0].trim();
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.screenWrapper}>
        {/* 1. Shared Global Driver Header */}
        <DriverHeader
          name={driver?.name || 'Test Driver'}
          statusText={driver?.driverStatus || ''}
          profileImageUrl={driver?.profileImage?.url}
          isOnline={driver?.isActive !== false}
        />

        {/* 2. Scrollable Dashboard Manifest */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {activeShipment ? (
            <>
              {/* CURRENT SHIPMENT MANIFEST */}
              <ActiveShipment
                activeShipment={activeShipment}
                getShortLocation={getShortLocation}
                onLaunchMap={() => setIsMapModalVisible(true)}
              />

              {/* HORSES INFORMATION */}
              {activeShipment?.shipment?.horses?.length > 0 && (
                <HorseInformation
                  activeShipment={activeShipment}
                  setIsMapModalVisible={setIsMapModalVisible}
                />
              )}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBox}>
                <AppIcon name={'Radio'} size={24} color={COLORS.primary} />
              </View>
              <AppText style={styles.emptyTitle}>
                No active manifests assigned
              </AppText>
              <AppText style={styles.emptyText}>
                You are currently on standby for dispatch assignments. Tap below
                to check for new trip manifests.
              </AppText>

              <AppButton
                leftIcon={
                  <AppIcon name={'RotateCw'} size={16} color={COLORS.white} />
                }
                title="Check for Dispatch"
                onPress={refresh}
                buttonStyle={styles.refreshBtn}
              />
            </View>
          )}

          {/* ASSIGNED VEHICLE ACCORDION BLOCK */}
          {vehicle && (
            <VahicleInfoCard
              vehicle={vehicle}
              isVehicleCollapsed={isVehicleCollapsed}
              setIsVehicleCollapsed={setIsVehicleCollapsed}
            />
          )}
        </ScrollView>

        {activeShipment?.tripStatus === 'notStarted' ? (
          <Button
            title="Start trip"
            onPress={onStartTrip}
            isLoading={startTripLoading}
            buttonStyle={{ margin: SPACING.md }}
          />
        ) : activeShipment?.tripStatus === 'inTransit' ||
          activeShipment?.tripStatus === 'started' ? (
          <Button
            title="Complete Shipment"
            onPress={() =>
              navigation.navigate('DeliveryVerification', {
                shipment: activeShipment,
              })
            }
            buttonStyle={{ margin: SPACING.md }}
          />
        ) : null}
      </View>

      {/* Confirmation Modal Slot */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={isMapModalVisible}
          onClose={() => setIsMapModalVisible(!isMapModalVisible)}
          onConfirm={() => setMapVisible(!mapVisible)}
          title="Routing Map"
          description={`This command launches GPS navigation for your route:\n\n${activeShipment?.shipment?.pickupLocation} ➔ ${activeShipment?.shipment?.deliveryLocation}`}
          confirmText="Start Nav"
          cancelText="Close"
          type="info"
        />
      </Suspense>

      {mapVisible && (
        <RouteMapModal
          visible={mapVisible}
          onClose={() => {
            setMapVisible(!mapVisible), setIsMapModalVisible(false);
          }}
          pickupLocation={activeShipment?.shipment?.pickupLocation}
          deliveryLocation={activeShipment?.shipment?.deliveryLocation}
          pickupCoords={activeShipment?.shipment?.pickupCoords}
          deliveryCoords={activeShipment?.shipment?.deliveryCoords}
        />
      )}

      {/* Custom Professional Location Permission Modal */}
      <Suspense fallback={null}>
        <LocationPermissionModal
          isVisible={isLocationPermissionModalVisible}
          onClose={closeLocationPermissionModal}
          title={locationModalTitle}
          message={locationModalMessage}
        />
      </Suspense>
    </View>
  );
};

export default HomeScreen;
