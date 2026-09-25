// src/screens/home/HomeScreen.tsx
import React, { lazy, Suspense,   } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

// Imported design systems & components
import { useDriverMe } from '../../../../../hooks/useDriverMe';
import { AppText, Button, DriverHeader, HomeSkeleton } from '../../../../../components';
import styles from './styles.home';
import { COLORS, SPACING } from '../../../../../constants';
import VahicleInfoCard from '../vahicle_infocard/VahicleInfoCard';
import ActiveShipment from '../active_shipment/ActiveShipment';
import HorseInformation from '../horse_information/HorseInformation';
import { RouteMapModal } from '../../location/route_map_modal/RouteMapModal';
import AppButton from '../../../../../components/common/Button/AppButton';
import AppIcon from '../../../../../components/app_icon/AppIcon';
 import useHome from './useHome';

const HomeScreen = ({ navigation }: any) => {
  const ConfirmationModal = lazy(
    () =>
      import(
        '../../../../../components/common/ConfirmationModal/ConfirmationModal'
      ),
  );
  const LocationPermissionModal = lazy(
    () =>
      import(
        '../../../../../components/common/LocationPermissionModal/LocationPermissionModal'
      ),
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



  const {
    isVehicleCollapsed,
    setIsVehicleCollapsed,
    isMapModalVisible,
    setIsMapModalVisible,
    mapVisible,
    setMapVisible,
    onStartTrip,
  } = useHome({ activeShipment, handleStartTrip })

  // Collapsible accordion state for the Assigned Vehicle card [1]


  if (loading && !driver) {
    return <HomeSkeleton />;
  }

  // Parse location short names (e.g. "New Mexico, USA" -> "New Mexico") [1]
  const getShortLocation = (fullName?: string) => {
    if (!fullName) return 'N/A';
    return fullName?.split(',')[0].trim();
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
      {
        isMapModalVisible &&
        <Suspense fallback={null}>
          <ConfirmationModal
            isVisible={isMapModalVisible}
            onClose={() => setIsMapModalVisible(false)}
            onConfirm={() => {
              setIsMapModalVisible(false);
              setMapVisible(true);
            }}
            title="Routing Map"
            description={`This command launches GPS navigation for your route:\n\n${activeShipment?.shipment?.pickupLocation} ➔ ${activeShipment?.shipment?.deliveryLocation}`}
            confirmText="Start Nav"
            cancelText="Close"
            type="info"
          />
        </Suspense>

      }

      {mapVisible && (
        <RouteMapModal
          visible={mapVisible}
          onClose={() => {
            setMapVisible(false);
            setIsMapModalVisible(false);
          }}
          pickupLocation={activeShipment?.shipment?.pickupLocation}
          deliveryLocation={activeShipment?.shipment?.deliveryLocation}
          pickupCoords={activeShipment?.shipment?.pickupCoords}
          deliveryCoords={activeShipment?.shipment?.deliveryCoords}
        />
      )}

      {/* Custom Professional Location Permission Modal */}
      {
        isLocationPermissionModalVisible &&
        <Suspense fallback={null}>
          <LocationPermissionModal
            isVisible={isLocationPermissionModalVisible}
            onClose={closeLocationPermissionModal}
            title={locationModalTitle}
            message={locationModalMessage}
          />
        </Suspense>
      }
    </View>
  );
};

export default HomeScreen;
