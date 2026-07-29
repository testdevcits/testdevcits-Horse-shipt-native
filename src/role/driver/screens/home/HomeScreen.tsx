// src/screens/home/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  Map,
  RotateCw,
  Compass,
} from 'lucide-react-native';

// Imported design systems & components
import { useDriverMe } from '../../../../hooks/useDriverMe';
import AppText from '../../../../components/common/AppText';
import DriverHeader from '../../../../components/common/DriverHeader';
import ConfirmationModal from '../../../../components/common/ConfirmationModal';
import { Button } from '../../../../components';
import styles from './styles.home';
import { COLORS, SPACING } from '../../../../constants';
import Toast from 'react-native-toast-message';
import VahicleInfoCard from './VahicleInfoCard';
import ActiveShipment from './ActiveShipment';
import HorseInformation from './HorseInformation';
import { RouteMapModal } from '../location/RouteMapModal';

const HomeScreen = ({ navigation }: any) => {
  const {
    driver,
    vehicle,
    activeShipment,
    loading,
    refresh,
    handleStartTrip,
    startTripLoading,
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
        <ActivityIndicator size="large" color={COLORS.goldPrimary} />
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
          statusText={driver?.driverStatus || 'ON TRIP'}
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
              tintColor={COLORS.goldPrimary}
            />
          }
        >
          {activeShipment ? (
            <>
              {/* CURRENT SHIPMENT MANIFEST */}
              <ActiveShipment
                activeShipment={activeShipment}
                getShortLocation={getShortLocation}
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
              <AppText style={styles.emptyText}>
                No active manifests or shipments assigned.
              </AppText>
              <TouchableOpacity style={styles.refreshBtn} onPress={refresh}>
                <RotateCw size={16} color={COLORS.white} />
                <AppText style={styles.refreshBtnText}>
                  Check for Dispatch
                </AppText>
              </TouchableOpacity>
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
        ) : activeShipment?.tripStatus === 'inTransit'  || activeShipment?.tripStatus === 'started' ? (
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
    </View>
  );
};

export default HomeScreen;
