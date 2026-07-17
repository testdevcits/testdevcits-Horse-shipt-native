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
  Compass
} from 'lucide-react-native';

// Imported design systems & components
import { useDriverMe } from '../../../../hooks/useDriverMe';
 import AppText from '../../../../components/common/AppText';
import DriverHeader from '../../../../components/common/DriverHeader';
import ConfirmationModal from '../../../../components/common/ConfirmationModal';
import { Button } from '../../../../components';
import styles from './styles.home';
import { COLORS } from '../../../../constants';

 

const HomeScreen = ({navigation}) => {
  const { driver, vehicle, activeShipment, loading, refresh} = useDriverMe();

  // Collapsible accordion state for the Assigned Vehicle card [1]
  const [isVehicleCollapsed, setIsVehicleCollapsed] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

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
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.goldPrimary} />
          }
        >
          {activeShipment ? (
            <>
              {/* CURRENT SHIPMENT MANIFEST */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <AppText style={styles.cardHeaderTitle}>Current Shipment</AppText>
                </View>

                <View style={styles.cardBody}>
                  {/* Active Route Box */}
                  <View style={styles.routeHeaderBox}>
                    <AppText style={styles.routeLabel}>ACTIVE ROUTE</AppText>
                    <AppText style={styles.routePlaces}>
                      {getShortLocation(activeShipment.shipment.pickupLocation)} ➔ {getShortLocation(activeShipment.shipment.deliveryLocation)}
                    </AppText>
                    
                    <View style={styles.horseCountBadge}>
                      <Truck size={14} color={COLORS.goldPrimary} style={styles.badgeIcon} />
                      <AppText style={styles.horseCountText}>
                        {activeShipment.shipment.numberOfHorses} Horse Shipment
                      </AppText>
                    </View>
                  </View>

                  {/* Trip Status Row */}
                  <View style={styles.tripStatusRow}>
                    <AppText style={styles.tripStatusLabel}>Trip Status</AppText>
                    <View style={styles.statusIndicatorRow}>
                      <View style={styles.greenActiveDot} />
                      <AppText style={styles.greenActiveText}>
                        {activeShipment.tripStatus === 'inTransit' ? 'IN TRANSIT' : activeShipment.tripStatus.toUpperCase()}
                      </AppText>
                    </View>
                  </View>

                  {/* Pickup Block */}
                  <View style={styles.stopCard}>
                    <View style={styles.stopIconContainer}>
                      <MapPin size={18} color={COLORS.white} />
                    </View>
                    <View style={styles.stopDetails}>
                      <AppText style={styles.stopLabel}>PICKUP</AppText>
                      <AppText style={styles.stopLocation}>{activeShipment.shipment.pickupLocation}</AppText>
                      <View style={styles.stopMetaRow}>
                        <Calendar size={13} color={COLORS.textLight} />
                        <AppText style={styles.stopMetaText}>N/A</AppText>
                        <Clock size={13} color={COLORS.textLight} style={styles.metaSpacing} />
                      </View>
                    </View>
                  </View>

                  {/* Dashed Connecting Line */}
                  <View style={styles.connectorWrapper}>
                    <View style={styles.dashedLine} />
                    <View style={styles.dashedCenterDot} />
                    <View style={styles.dashedLine} />
                  </View>

                  {/* Delivery Block */}
                  <View style={styles.stopCard}>
                    <View style={styles.stopIconContainer}>
                      <MapPin size={18} color={COLORS.white} />
                    </View>
                    <View style={styles.stopDetails}>
                      <AppText style={styles.stopLabel}>DELIVERY</AppText>
                      <AppText style={styles.stopLocation}>{activeShipment.shipment.deliveryLocation}</AppText>
                      <View style={styles.stopMetaRow}>
                        <Calendar size={13} color={COLORS.textLight} />
                        <AppText style={styles.stopMetaText}>N/A</AppText>
                        <Clock size={13} color={COLORS.textLight} style={styles.metaSpacing} />
                      </View>
                    </View>
                  </View>

                </View>
              </View>

              {/* HORSES INFORMATION */}
              {activeShipment.shipment.horses?.length > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <AppText style={styles.cardHeaderTitle}>
                      🐴 Horses ({activeShipment.shipment.numberOfHorses})
                    </AppText>
                  </View>
                  <View style={styles.cardBody}>
                    {activeShipment.shipment.horses.map((horse, idx) => (
                      <View key={idx} style={styles.horseDetailsWrapper}>
                        {/* Horse Image */}
                        {horse.photo?.url ? (
                          <Image resizeMode="stretch" source={{ uri: horse.photo.url }} style={styles.horseImage} />
                        ) : (
                          <View style={styles.horseImageFallback} />
                        )}

                        {/* Horse Grid details */}
                        <View style={styles.horseGrid}>
                          <View style={styles.gridCell}>
                            <AppText style={styles.gridLabel}>REGISTERED</AppText>
                            <AppText style={styles.gridValue}>{horse.registeredName}</AppText>
                          </View>
                          <View style={styles.gridCell}>
                            <AppText style={styles.gridLabel}>BARN</AppText>
                            <AppText style={styles.gridValue}>{horse.barnName}</AppText>
                          </View>
                          <View style={styles.gridCell}>
                            <AppText style={styles.gridLabel}>BREED</AppText>
                            <AppText style={styles.gridValue}>{horse.breed}</AppText>
                          </View>
                          <View style={styles.gridCell}>
                            <AppText style={styles.gridLabel}>SEX</AppText>
                            <AppText style={styles.gridValue}>{horse.sex}</AppText>
                          </View>
                        </View>
                      </View>
                    ))}

                    {/* Shipment Notes Container */}
                    {activeShipment.notes && (
                      <View style={styles.notesBox}>
                        <AppText style={styles.notesBoxLabel}>NOTES</AppText>
                        <AppText style={styles.notesBoxText}>{activeShipment.notes}</AppText>
                      </View>
                    )}

                    {/* Navigation Trigger Button */}
                    <TouchableOpacity 
                      style={styles.goldButton}
                      activeOpacity={0.8}
                      onPress={() => setIsMapModalVisible(true)}
                    >
                      <Map size={18} color={COLORS.white} style={styles.btnIcon} />
                      <AppText style={styles.goldButtonText}>View Route on Map</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyText}>No active manifests or shipments assigned.</AppText>
              <TouchableOpacity style={styles.refreshBtn} onPress={refresh}>
                <RotateCw size={16} color={COLORS.white} />
                <AppText style={styles.refreshBtnText}>Check for Dispatch</AppText>
              </TouchableOpacity>
            </View>
          )}

          {/* ASSIGNED VEHICLE ACCORDION BLOCK */}
          {vehicle && (
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.accordionHeader}
                activeOpacity={0.9}
                onPress={() => setIsVehicleCollapsed(!isVehicleCollapsed)}
              >
                <AppText style={styles.cardHeaderTitle}>Assigned Vehicle</AppText>
                {isVehicleCollapsed ? (
                  <ChevronDown size={20} color={COLORS.goldDarkText} />
                ) : (
                  <ChevronUp size={20} color={COLORS.goldDarkText} />
                )}
              </TouchableOpacity>

              {!isVehicleCollapsed && (
                <View style={styles.cardBody}>
                  {/* Truck Cover Image with tag */}
                  <View style={styles.vehicleImageContainer}>
                    {vehicle.images?.[0]?.url ? (
                      <Image   source={{ uri: vehicle.images[0].url }} style={styles.vehicleImage} />
                    ) : (
                      <View style={styles.vehicleImageFallback} />
                    )}
                    <View style={styles.tagBadge}>
                      <AppText style={styles.tagBadgeText}>TRUCK</AppText>
                    </View>
                  </View>

                  {/* Vehicle Number & Status */}
                  <View style={styles.vehicleMetaRow}>
                    <View style={styles.flexOne}>
                      <AppText style={styles.vehicleNum}>{vehicle.vehicleNumber}</AppText>
                      <AppText style={styles.vehicleSubDetails}>
                        {vehicle.transportType} • {vehicle.trailerType}
                      </AppText>
                    </View>
                    <View style={styles.readyBadge}>
                      <AppText style={styles.readyBadgeText}>READY</AppText>
                    </View>
                  </View>

                  {/* Grid layout parameters */}
                  <View style={styles.vehicleGrid}>
                    <View style={styles.vehicleGridCell}>
                      <AppText style={styles.vLabel}>TRAILER</AppText>
                      <AppText style={styles.vValue} numberOfLines={1}>{vehicle.trailerType}</AppText>
                    </View>
                    <View style={styles.vehicleGridCell}>
                      <AppText style={styles.vLabel}>STALLS</AppText>
                      <AppText style={styles.vValue}>{vehicle.numberOfStalls}</AppText>
                    </View>
                    <View style={styles.vehicleGridCell}>
                      <AppText style={styles.vLabel}>STALL SIZE</AppText>
                      <AppText style={styles.vValue}>{vehicle.stallSize}</AppText>
                    </View>
                    <View style={styles.vehicleGridCell}>
                      <AppText style={styles.vLabel}>TRANSPORT</AppText>
                      <AppText style={styles.vValue}>{vehicle.transportType}</AppText>
                    </View>
                  </View>

                  {/* Vehicle Notes Box */}
                  {vehicle.notes && (
                    <View style={styles.notesBox}>
                      <AppText style={styles.notesBoxLabel}>VEHICLE NOTES</AppText>
                      <AppText style={styles.notesBoxText}>{vehicle.notes.trim()}</AppText>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

        </ScrollView>
         <Button title='Complete Shipment' onPress={()=>navigation.navigate("DeliveryVerification",{shipment:activeShipment})}/>
      </View>

      {/* Confirmation Modal Slot */}
      <ConfirmationModal
        isVisible={isMapModalVisible}
        onClose={() => setIsMapModalVisible(false)}
        onConfirm={() => setIsMapModalVisible(false)}
        title="Routing Map"
        description={`This command launches GPS navigation for your route:\n\n${activeShipment?.shipment?.pickupLocation} ➔ ${activeShipment?.shipment?.deliveryLocation}`}
        confirmText="Start Nav"
        cancelText="Close"
        type="info"
      />
    </View>
  );
};

export default HomeScreen;

 