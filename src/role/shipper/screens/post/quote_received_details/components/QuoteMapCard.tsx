import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { COLORS, ICON_SIZE } from '../../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../../config/constants';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import AppText from '../../../../../../components/common/AppText';
import styles from '../styles.QuoteReceivedDetails';

interface QuoteMapCardProps {
  mapRef: React.RefObject<MapView | null>;
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  pLat: number;
  pLng: number;
  dLat: number;
  dLng: number;
  fitToRoute: () => void;
  handleDirectionsReady: (result: any) => void;
  calculatedDistance: string | null;
  calculatedDuration: string | null;
  haversine: {
    formattedKm: string;
    formattedMiles: string;
    timeStr: string;
  };
}

export const QuoteMapCard: React.FC<QuoteMapCardProps> = memo(
  ({
    mapRef,
    mapRegion,
    pLat,
    pLng,
    dLat,
    dLng,
    fitToRoute,
    handleDirectionsReady,
    calculatedDistance,
    calculatedDuration,
    haversine,
  }) => {
    return (
      <View style={styles.mapCardContainer}>
        <View style={styles.mapHeaderRow}>
          <View style={styles.mapHeaderInfo}>
            <AppIcon name="Route" size={ICON_SIZE.sm} color={COLORS.primary} />
            <AppText style={styles.mapHeaderTitle}>
              Interactive Route & Distance
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.recenterBtn}
            onPress={fitToRoute}
            activeOpacity={0.8}
          >
            <AppIcon name="LocateFixed" size={14} color={COLORS.primary} />
            <AppText style={styles.recenterText}>Fit Route</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef as any}
            provider={PROVIDER_GOOGLE}
            style={styles.mapView}
            initialRegion={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            onMapReady={fitToRoute}
          >
            <Marker
              coordinate={{ latitude: pLat, longitude: pLng }}
              title="Pickup Location"
            >
              <View
                style={[
                  styles.markerBadge,
                  { backgroundColor: COLORS.greenSuccess },
                ]}
              >
                <AppIcon name="PackageCheck" size={14} color={COLORS.white} />
              </View>
            </Marker>

            <Marker
              coordinate={{ latitude: dLat, longitude: dLng }}
              title="Delivery Location"
            >
              <View
                style={[
                  styles.markerBadge,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <AppIcon name="MapPin" size={14} color={COLORS.white} />
              </View>
            </Marker>

            <MapViewDirections
              origin={{ latitude: pLat, longitude: pLng }}
              destination={{ latitude: dLat, longitude: dLng }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor={COLORS.primary}
              optimizeWaypoints={true}
              onReady={handleDirectionsReady}
            />
          </MapView>

          {/* Distance & Duration Live Overlay Card */}
          <View style={styles.mapStatsCard}>
            <View style={styles.mapStatItem}>
              <AppIcon name="Navigation" size={16} color={COLORS.primary} />
              <View style={styles.mapStatContent}>
                <AppText style={styles.mapStatLabel}>
                  ESTIMATED DISTANCE
                </AppText>
                <AppText style={styles.mapStatVal}>
                  {calculatedDistance ||
                    `${haversine.formattedKm} (${haversine.formattedMiles})`}
                </AppText>
              </View>
            </View>

            <View style={styles.mapStatDivider} />

            <View style={styles.mapStatItem}>
              <AppIcon name="Clock" size={16} color={COLORS.primary} />
              <View style={styles.mapStatContent}>
                <AppText style={styles.mapStatLabel}>
                  ESTIMATED DURATION
                </AppText>
                <AppText style={styles.mapStatVal}>
                  {calculatedDuration || haversine.timeStr}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  },
);
