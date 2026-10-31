import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AppText from '../../../../../components/common/AppText';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';
import styles from '../styles.shipmentdetails';

interface Props {
  mapRegion: any;
  pickupLat?: number;
  pickupLng?: number;
  pickupLoc: string;
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryLoc: string;
  currentLat?: number;
  currentLng?: number;
  lastUpdated?: string | null;
  vehicleType: string;
}

export const DriverTripMapCard: React.FC<Props> = React.memo(
  ({
    mapRegion,
    pickupLat,
    pickupLng,
    pickupLoc,
    deliveryLat,
    deliveryLng,
    deliveryLoc,
    currentLat,
    currentLng,
    lastUpdated,
    vehicleType,
  }) => {
    return (
      <View style={styles.mapCard}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={mapRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        >
          {/* Origin Marker */}
          {pickupLat != null && pickupLng != null && (
            <Marker
              coordinate={{ latitude: pickupLat, longitude: pickupLng }}
              title="Origin"
              description={pickupLoc}
            >
              <View style={styles.markerCircleGreen}>
                <AppIcon name="MapPin" size={14} color={COLORS.white} />
              </View>
            </Marker>
          )}

          {/* Destination Marker */}
          {deliveryLat != null && deliveryLng != null && (
            <Marker
              coordinate={{ latitude: deliveryLat, longitude: deliveryLng }}
              title="Destination"
              description={deliveryLoc}
            >
              <View style={styles.markerCircleRed}>
                <AppIcon name="MapPin" size={14} color={COLORS.white} />
              </View>
            </Marker>
          )}

          {/* Current GPS Telemetry Marker */}
          {currentLat != null && currentLng != null && (
            <Marker
              coordinate={{ latitude: currentLat, longitude: currentLng }}
              title="Rig Current Position"
              description={`Updated: ${lastUpdated || 'Active'}`}
            >
              <View style={styles.markerCircleBlue}>
                <AppIcon name="Truck" size={14} color={COLORS.white} />
              </View>
            </Marker>
          )}

          {/* Polyline Route Directions */}
          {pickupLat != null &&
            pickupLng != null &&
            deliveryLat != null &&
            deliveryLng != null && (
              <MapViewDirections
                origin={{ latitude: pickupLat, longitude: pickupLng }}
                destination={{ latitude: deliveryLat, longitude: deliveryLng }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3.5}
                strokeColor={COLORS.primary}
                lineDashPattern={[0]}
                onError={err => console.log('MapViewDirections error:', err)}
              />
            )}
        </MapView>

        <View style={styles.mapHeaderOverlay}>
          <View style={styles.haulerBadge}>
            <AppIcon name="Truck" size={14} color={COLORS.slate900} />
            <AppText style={styles.haulerText}>{vehicleType}</AppText>
          </View>
        </View>

        {/* Telemetry Ping Floating Bar */}
        {currentLat != null && currentLng != null && (
          <View style={styles.telemetryPingBox}>
            <View style={styles.pingLeft}>
              <View style={styles.pingIconCircle}>
                <AppIcon name="Radio" size={16} color="#0284C7" />
              </View>
              <View>
                <AppText style={styles.pingLabel}>GPS TELEMETRY</AppText>
                <AppText style={styles.pingCoords}>
                  {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
                </AppText>
              </View>
            </View>

            {lastUpdated && (
              <View style={styles.pingRight}>
                <AppText style={styles.pingVerifiedTag}>
                  Verified Location
                </AppText>
                <AppText style={styles.pingDate}>{lastUpdated}</AppText>
              </View>
            )}
          </View>
        )}
      </View>
    );
  },
);
