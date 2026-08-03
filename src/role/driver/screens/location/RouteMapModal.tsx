import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  X,
  Navigation,
  Compass,
  MapPin,
  Clock,
  LocateFixed,
  Map as MapIcon,
} from 'lucide-react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';
import { AppText } from '../../../../components';
import { useCurrentLocation } from '../../../../hooks/useCurrentLocation';

const { width, height } = Dimensions.get('window');

interface Coords {
  latitude: number;
  longitude: number;
}

interface RouteMapModalProps {
  visible: boolean;
  onClose: () => void;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupCoords?: Coords;
  deliveryCoords?: Coords;
}

const CustomMarker = ({
  color,
  icon: Icon,
  label,
}: {
  color: string;
  icon: any;
  label: string;
}) => (
  <View style={styles.markerContainer}>
    <View style={[styles.markerLabel, { backgroundColor: color }]}>
      <AppText style={styles.markerLabelText}>{label}</AppText>
    </View>
    <View style={[styles.markerIconCircle, { borderColor: color }]}>
      <Icon size={14} color={color} fill={color} fillOpacity={0.2} />
    </View>
    <View style={[styles.markerStem, { backgroundColor: color }]} />
  </View>
);

export const RouteMapModal: React.FC<RouteMapModalProps> = memo(
  ({
    visible,
    onClose,
    pickupLocation = 'Pickup',
    deliveryLocation = 'Delivery',
    pickupCoords,
    deliveryCoords,
  }) => {
    const mapRef = useRef<MapView | null>(null);
    const { getCurrentPosition, requestPermission } = useCurrentLocation();
    const [userCoords, setUserCoords] = useState<Coords | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapType, setMapType] = useState<'standard' | 'satellite'>(
      'standard',
    );

    // Track metrics for both legs
    const [metrics, setMetrics] = useState({
      leg1: { distance: 0, duration: 0 },
      leg2: { distance: 0, duration: 0 },
    });

    const fetchUserLocation = useCallback(async () => {
      const granted = await requestPermission();
      if (granted) {
        try {
          const pos = await getCurrentPosition();
          setUserCoords(pos);
        } catch (e) {
          console.log('Location error', e);
        }
      }
    }, [getCurrentPosition, requestPermission]);

    const handleFitAll = useCallback(() => {
      if (mapRef.current) {
        const points = [];
        if (userCoords) points.push(userCoords);
        if (pickupCoords) points.push(pickupCoords);
        if (deliveryCoords) points.push(deliveryCoords);

        if (points.length > 0) {
          mapRef.current.fitToCoordinates(points, {
            edgePadding: { top: 120, right: 60, bottom: 320, left: 60 },
            animated: true,
          });
        }
      }
    }, [userCoords, pickupCoords, deliveryCoords]);

    useEffect(() => {
      if (visible) {
        fetchUserLocation();
        setTimeout(handleFitAll, 1500);
      }
    }, [visible, userCoords?.latitude, handleFitAll, fetchUserLocation]);

    // Combined totals
    const totalDistance = (
      metrics.leg1.distance + metrics.leg2.distance
    ).toFixed(1);
    const totalDuration = Math.ceil(
      metrics.leg1.duration + metrics.leg2.duration,
    );

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType={mapType}
            showsUserLocation={false}
            showsCompass={false}
          >
            {userCoords && pickupCoords && deliveryCoords && (
              <>
                {/* LEG 1: DRIVER -> PICKUP (BLUE) */}
                <MapViewDirections
                  origin={userCoords}
                  destination={pickupCoords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor="#3B82F6"
                  onReady={result => {
                    setMetrics(prev => ({
                      ...prev,
                      leg1: {
                        distance: result?.distance,
                        duration: result?.duration,
                      },
                    }));
                  }}
                />

                {/* LEG 2: PICKUP -> DROP (EMERALD) */}
                <MapViewDirections
                  origin={pickupCoords}
                  destination={deliveryCoords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor="#10B981"
                  onReady={result => {
                    setMetrics(prev => ({
                      ...prev,
                      leg2: {
                        distance: result?.distance,
                        duration: result?.duration,
                      },
                    }));
                    setLoading(false);
                  }}
                />
              </>
            )}

            {userCoords && (
              <Marker coordinate={userCoords}>
                <CustomMarker color="#3B82F6" icon={Navigation} label="You" />
              </Marker>
            )}

            {pickupCoords && (
              <Marker coordinate={pickupCoords}>
                <CustomMarker color="#A37F3D" icon={MapPin} label="Pickup" />
              </Marker>
            )}

            {deliveryCoords && (
              <Marker coordinate={deliveryCoords}>
                <CustomMarker color="#10B981" icon={MapPin} label="Delivery" />
              </Marker>
            )}
          </MapView>

          {/* HEADER OVERLAY */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <X size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.routeHeaderInfo}>
              <AppText style={styles.headerTitle}>Premium Route</AppText>
              <View style={styles.liveIndicator}>
                <View style={styles.pulseDot} />
                <AppText style={styles.liveText}>ROAD ACTIVE</AppText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() =>
                setMapType(mapType === 'standard' ? 'satellite' : 'standard')
              }
            >
              <MapIcon size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* SIDE CONTROLS */}
          <View style={styles.sideControls}>
            <TouchableOpacity style={styles.circleBtn} onPress={handleFitAll}>
              <LocateFixed size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* FLOATING TOTAL TRIP CARD */}
          <View style={styles.bottomCardWrapper}>
            <View style={styles.tripCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Navigation size={18} color="#3B82F6" />
                  <View style={styles.metricTextContent}>
                    <AppText style={styles.metricLabel}>Total Distance</AppText>
                    <AppText style={styles.metricValue}>
                      {totalDistance} km
                    </AppText>
                  </View>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Clock size={18} color="#10B981" />
                  <View style={styles.metricTextContent}>
                    <AppText style={styles.metricLabel}>Total ETA</AppText>
                    <AppText style={styles.metricValue}>
                      {totalDuration} mins
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.addressSection}>
                <View style={styles.addressRow}>
                  <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {pickupLocation}
                  </AppText>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.addressRow}>
                  <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {deliveryLocation}
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.goldPrimary} />
              <AppText style={styles.loadingText}>Syncing Leg data?...</AppText>
            </View>
          )}
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  map: { ...StyleSheet.absoluteFillObject },
  markerContainer: { alignItems: 'center' },
  markerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 2,
    elevation: 4,
  },
  markerLabelText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 10,
  },
  markerIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  markerStem: { width: 2, height: 4 },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  routeHeaderInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  sideControls: { position: 'absolute', right: 20, top: height * 0.25 },
  bottomCardWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  tripCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metricTextContent: { gap: 2 },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  metricDivider: { width: 1, height: 30, backgroundColor: COLORS.divider },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 18 },
  addressSection: { gap: 10 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  verticalLine: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.divider,
    marginLeft: 3.5,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
});
