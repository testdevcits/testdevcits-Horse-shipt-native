import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { View, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Navigation, MapPin } from 'lucide-react-native';
import { COLORS } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';
import { AppText } from '../../../../../components';
import { useCurrentLocation } from '../../../../../hooks/useCurrentLocation';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import styles from './RouteMapModal.Styles';

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

    const handleZoomIn = useCallback(() => {
      if (mapRef.current) {
        mapRef.current
          .getCamera()
          .then(camera => {
            if (camera) {
              camera.zoom = (camera.zoom || 12) + 1.2;
              mapRef.current?.animateCamera(camera, { duration: 300 });
            }
          })
          .catch(err => {
            console.warn('Zoom In error:', err);
          });
      }
    }, []);

    const handleZoomOut = useCallback(() => {
      if (mapRef.current) {
        mapRef.current
          .getCamera()
          .then(camera => {
            if (camera) {
              camera.zoom = Math.max((camera.zoom || 12) - 1.2, 1);
              mapRef.current?.animateCamera(camera, { duration: 300 });
            }
          })
          .catch(err => {
            console.warn('Zoom Out error:', err);
          });
      }
    }, []);

    useEffect(() => {
      if (visible) {
        fetchUserLocation();
        const timer = setTimeout(handleFitAll, 1000);
        return () => clearTimeout(timer);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

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
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType={mapType}
            showsUserLocation={false}
            showsCompass={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomTapEnabled={true}
          >
            {userCoords && pickupCoords && deliveryCoords && (
              <>
                {/* LEG 1: DRIVER -> PICKUP (BLUE) */}
                <MapViewDirections
                  origin={userCoords}
                  destination={pickupCoords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor={COLORS.info}
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
                  strokeColor={COLORS.success}
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
                <CustomMarker
                  color={COLORS.info}
                  icon={Navigation}
                  label="You"
                />
              </Marker>
            )}

            {pickupCoords && (
              <Marker coordinate={pickupCoords}>
                <CustomMarker
                  color={COLORS.goldDark}
                  icon={MapPin}
                  label="Pickup"
                />
              </Marker>
            )}

            {deliveryCoords && (
              <Marker coordinate={deliveryCoords}>
                <CustomMarker
                  color={COLORS.success}
                  icon={MapPin}
                  label="Delivery"
                />
              </Marker>
            )}
          </MapView>

          {/* HEADER OVERLAY */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <AppIcon name={'X'} size={22} color={COLORS.textPrimary} />
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
              <AppIcon name={'Map'} size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* SIDE CONTROLS */}
          <View style={styles.sideControls}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={handleFitAll}
              activeOpacity={0.8}
            >
              <AppIcon
                name={'LocateFixed'}
                size={20}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, { marginTop: 10 }]}
              onPress={handleZoomIn}
              activeOpacity={0.8}
            >
              <AppIcon name={'Plus'} size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, { marginTop: 10 }]}
              onPress={handleZoomOut}
              activeOpacity={0.8}
            >
              <AppIcon name={'Minus'} size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* FLOATING TOTAL TRIP CARD */}
          <View style={styles.bottomCardWrapper}>
            <View style={styles.tripCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <AppIcon name={'Navigation'} size={18} color={COLORS.info} />
                  <View style={styles.metricTextContent}>
                    <AppText style={styles.metricLabel}>Total Distance</AppText>
                    <AppText style={styles.metricValue}>
                      {totalDistance} km
                    </AppText>
                  </View>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <AppIcon name={'Clock'} size={18} color={COLORS.success} />
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
                  <View
                    style={[styles.dot, { backgroundColor: COLORS.info }]}
                  />
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {pickupLocation}
                  </AppText>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.addressRow}>
                  <View
                    style={[styles.dot, { backgroundColor: COLORS.success }]}
                  />
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {deliveryLocation}
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <AppText style={styles.loadingText}>
                Finding the best route..
              </AppText>
            </View>
          )}
        </View>
      </Modal>
    );
  },
);
