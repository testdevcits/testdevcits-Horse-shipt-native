import React, { memo } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';
import styles from '../styles.shipperhome';

interface RouteMapSectionProps {
  selectedMapShipment: any;
  mapRef: React.RefObject<MapView | null>;
  getRegionForShipment: (shipment: any) => any;
  onNavigateMapDirection: () => void;
  onCloseMap: () => void;
}

export const RouteMapSection: React.FC<RouteMapSectionProps> = memo(({
  selectedMapShipment,
  mapRef,
  getRegionForShipment,
  onNavigateMapDirection,
  onCloseMap,
}) => {
  if (!selectedMapShipment) return null;

  return (
    <View style={styles.routeMapCard}>
      <View style={styles.routeMapHeader}>
        <View>
          <AppText style={styles.routeMapTitle}>Shipment Route Map</AppText>
          <AppText style={styles.routeMapShipmentCode}>
            {selectedMapShipment?.shipmentCode}
          </AppText>
        </View>
        <Pressable
          onPress={onNavigateMapDirection}
          style={styles.viewInFullScreenBtn}
        >
          <AppText style={styles.viewInFullScreenBtnText}>
            View in Full Map
          </AppText>
        </Pressable>
      </View>

      {/* Map Preview Container */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={getRegionForShipment(selectedMapShipment)}
          showsUserLocation
        >
          {selectedMapShipment?.pickupCoords && (
            <Marker
              coordinate={{
                latitude:
                  selectedMapShipment?.pickupCoords?.lat ||
                  selectedMapShipment?.pickupCoords?.latitude ||
                  22.745,
                longitude:
                  selectedMapShipment?.pickupCoords?.lng ||
                  selectedMapShipment?.pickupCoords?.longitude ||
                  75.892,
              }}
              title="Pickup"
              description={selectedMapShipment?.pickupLocation}
            >
              <View style={styles.markerCircleGreen}>
                <AppIcon name={'MapPin'} size={14} color={COLORS.white} />
              </View>
            </Marker>
          )}

          {selectedMapShipment?.deliveryCoords && (
            <Marker
              coordinate={{
                latitude:
                  selectedMapShipment?.deliveryCoords?.lat ||
                  selectedMapShipment?.deliveryCoords?.latitude ||
                  23.838,
                longitude:
                  selectedMapShipment?.deliveryCoords?.lng ||
                  selectedMapShipment?.deliveryCoords?.longitude ||
                  78.737,
              }}
              title="Delivery"
              description={selectedMapShipment?.deliveryLocation}
            >
              <View style={styles.markerCircleRed}>
                <AppIcon name={'MapPin'} size={14} color={COLORS.white} />
              </View>
            </Marker>
          )}

          {selectedMapShipment?.pickupCoords &&
            selectedMapShipment?.deliveryCoords && (
              <>
                <MapViewDirections
                  origin={{
                    latitude:
                      selectedMapShipment?.pickupCoords?.lat ||
                      selectedMapShipment?.pickupCoords?.latitude ||
                      22.745,
                    longitude:
                      selectedMapShipment?.pickupCoords?.lng ||
                      selectedMapShipment?.pickupCoords?.longitude ||
                      75.892,
                  }}
                  destination={{
                    latitude:
                      selectedMapShipment?.deliveryCoords?.lat ||
                      selectedMapShipment?.deliveryCoords?.latitude ||
                      23.838,
                    longitude:
                      selectedMapShipment?.deliveryCoords?.lng ||
                      selectedMapShipment?.deliveryCoords?.longitude ||
                      78.737,
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={4}
                  strokeColor={COLORS.brandBrown || COLORS.primary}
                  lineDashPattern={[0]}
                  onError={err => console.log('MapViewDirections Error:', err)}
                />
                <Polyline
                  coordinates={[
                    {
                      latitude:
                        selectedMapShipment?.pickupCoords?.lat ||
                        selectedMapShipment?.pickupCoords?.latitude ||
                        22.745,
                      longitude:
                        selectedMapShipment?.pickupCoords?.lng ||
                        selectedMapShipment?.pickupCoords?.longitude ||
                        75.892,
                    },
                    {
                      latitude:
                        selectedMapShipment?.deliveryCoords?.lat ||
                        selectedMapShipment?.deliveryCoords?.latitude ||
                        23.838,
                      longitude:
                        selectedMapShipment?.deliveryCoords?.lng ||
                        selectedMapShipment?.deliveryCoords?.longitude ||
                        78.737,
                    },
                  ]}
                  strokeColor={COLORS.primary}
                  strokeWidth={3}
                  lineDashPattern={[6, 6]}
                />
              </>
            )}
        </MapView>
      </View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeMapBtn} onPress={onCloseMap}>
        <AppText style={styles.closeMapBtnText}>Close</AppText>
      </TouchableOpacity>
    </View>
  );
});

export default RouteMapSection;
