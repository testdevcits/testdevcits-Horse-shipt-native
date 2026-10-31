import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../../../../config/constants';
import { AppText } from '../../../../../../components';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../constants';
import styles from '../styles.shippershipmentdetails';

interface ShipmentDetailMapCardProps {
  shipment: any;
  isMapVisible: boolean;
  setIsMapVisible: (val: boolean) => void;
  pLat: number;
  pLng: number;
  dLat: number;
  dLng: number;
  mapRegion: any;
  navigation: any;
}

export const ShipmentDetailMapCard: React.FC<ShipmentDetailMapCardProps> = ({
  shipment,
  isMapVisible,
  setIsMapVisible,
  pLat,
  pLng,
  dLat,
  dLng,
  mapRegion,
}) => {
  if (!isMapVisible) return null;

  return (
    <View style={styles.routeMapCard}>
      <AppText style={styles.cardHeaderTitle}>Shipment Route Map</AppText>
      <AppText style={styles.cardHeaderSub}>{shipment?.shipmentCode}</AppText>

      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={mapRegion}
        >
          <Marker
            coordinate={{ latitude: pLat, longitude: pLng }}
            title="Pickup Location"
            description={shipment?.pickupLocation}
          >
            <View style={styles.markerCircleGreen}>
              <AppIcon name="MapPin" size={14} color={COLORS.white} />
            </View>
          </Marker>

          <Marker
            coordinate={{ latitude: dLat, longitude: dLng }}
            title="Delivery Location"
            description={shipment?.deliveryLocation}
          >
            <View style={styles.markerCircleRed}>
              <AppIcon name="MapPin" size={14} color={COLORS.white} />
            </View>
          </Marker>

          <MapViewDirections
            origin={{ latitude: pLat, longitude: pLng }}
            destination={{ latitude: dLat, longitude: dLng }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor={COLORS.brandBrown}
            lineDashPattern={[0]}
            onError={err => console.log('MapViewDirections Error:', err)}
          />
        </MapView>
      </View>

      <TouchableOpacity
        style={styles.closeMapBtn}
        onPress={() => setIsMapVisible(false)}
      >
        <AppText style={styles.closeMapBtnText}>Close Map</AppText>
      </TouchableOpacity>
    </View>
  );
};
