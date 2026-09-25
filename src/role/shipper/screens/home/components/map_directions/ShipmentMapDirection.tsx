import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// Import your constants
import { COLORS } from '../../../../../../constants';
import { AppText } from '../../../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../../../config/constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import styles from './styles.MapDirection';

// Note: Replace with your actual Google Maps API Key

const ShipmentMapDirection = ({ route, navigation }: any) => {
  // Use the params provided in your JSON
  const { shipmentData } = route.params;

  console.log(' shipmentData   ', shipmentData);

  const [time, setTime] = useState<any>(undefined);

  const mapRef = useRef<MapView>(null);
  const [_isMapReady, setIsMapReady] = useState(false);

  // Zoom to fit both markers on mount
  const fitToRoute = () => {
    mapRef.current?.fitToCoordinates(
      [shipmentData?.pickupCoords, shipmentData?.deliveryCoords],
      {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      },
    );
  };

  return (
    <View style={styles.container}>

      {/* Map Implementation */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...shipmentData?.pickupCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        userLocationAnnotationTitle="My Location"
        showsMyLocationButton={false}
        onMapReady={() => {
          setIsMapReady(true);
          fitToRoute();
        }}
      >
        {/* Pickup Marker */}
        <Marker coordinate={shipmentData?.pickupCoords} title="Pickup">
          <View
            style={[
              styles.markerContainer,
              { backgroundColor: COLORS.greenSuccess },
            ]}
          >
            <AppIcon name="PackageCheck" size={16} color={COLORS.white} />
          </View>
        </Marker>

        {/* Delivery Marker */}
        <Marker coordinate={shipmentData?.deliveryCoords} title="Delivery">
          <View
            style={[
              styles.markerContainer,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <AppIcon name="MapPin" size={16} color={COLORS.white} />
          </View>
        </Marker>

        {/* Route Directions */}
        <MapViewDirections
          origin={shipmentData?.pickupCoords}
          destination={shipmentData?.deliveryCoords}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor={COLORS.primary}
          optimizeWaypoints={true}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`);
            setTime(result?.duration);
            console.log(`Duration: ${result.duration} min.`);
          }}
        />
      </MapView>

      {/* Floating Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <AppIcon name="ChevronLeft" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <AppText style={styles.headerTitle}>
              {shipmentData?.shipmentCode}
            </AppText>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <AppText style={styles.statusText}>Open for Offers</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={fitToRoute}>
        <AppIcon name="Target" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Bottom Info Card */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandle} />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <AppIcon name="Route" size={20} color={COLORS.primary} />
            <View style={styles.statTextContent}>
              <AppText style={styles.statLabel}>Distance</AppText>
              <AppText style={styles.statValue}>
                {shipmentData?.estimatedDistance.km} km
              </AppText>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AppIcon name="Clock" size={20} color={COLORS.primary} />
            <View style={styles.statTextContent}>
              <AppText style={styles.statLabel}>Est. Time</AppText>
              <AppText style={styles.statValue}>
                {/* {shipmentData?.estimatedDuration} hrs */}

                {time && `Duration: ${time} min.`}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <View style={styles.dotContainer}>
              <View
                style={[styles.dot, { backgroundColor: COLORS.greenSuccess }]}
              />
              <View style={styles.line} />
            </View>
            <View style={styles.addressTextWrapper}>
              <AppText style={styles.addressLabel}>Pickup</AppText>
              <AppText style={styles.addressText} numberOfLines={1}>
                {shipmentData?.pickupLocation}
              </AppText>
            </View>
          </View>

          <View style={[styles.addressRow, { marginTop: 10 }]}>
            <View style={styles.dotContainer}>
              <AppIcon name="MapPin" size={16} color={COLORS.primary} />
            </View>
            <View style={styles.addressTextWrapper}>
              <AppText style={styles.addressLabel}>Delivery</AppText>
              <AppText style={styles.addressText} numberOfLines={1}>
                {shipmentData?.deliveryLocation}
              </AppText>
            </View>
          </View>
        </View>

        {/* <TouchableOpacity style={styles.actionButton}>
                    <Navigation size={20} color={COLORS.white} />
                    <AppText style={styles.actionButtonText}>View Offer Details</AppText>
                </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ShipmentMapDirection;
