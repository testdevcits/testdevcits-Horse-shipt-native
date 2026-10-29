import React, {
  useRef,
  useEffect,
  useState,
  memo,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { MapPin, Navigation2Icon } from 'lucide-react-native';
import { COLORS } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';
import { AppText } from '../../../../../components';
import { useCurrentLocation } from '../../../../../hooks/useCurrentLocation';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import styles from './RouteMapModal.Styles';
import CompassHeading from 'react-native-compass-heading';

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

const normalizeCoord = (coords?: Coords | null): Coords | null => {
  if (!coords) return null;
  const lat = Number(coords.latitude);
  const lng = Number(coords.longitude);
  const isValid =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;
  return isValid ? { latitude: lat, longitude: lng } : null;
};

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
    const [routeError, setRouteError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [mapType, setMapType] = useState<'standard' | 'satellite'>(
      'standard',
    );

    const pickupPoint = useMemo(
      () => normalizeCoord(pickupCoords),
      [pickupCoords],
    );
    const deliveryPoint = useMemo(
      () => normalizeCoord(deliveryCoords),
      [deliveryCoords],
    );
    const hasPickupCoords = !!pickupPoint;
    const hasDeliveryCoords = !!deliveryPoint;
    const hasBothCoords = hasPickupCoords && hasDeliveryCoords;
    const showCoordsAlert = !hasBothCoords || !!routeError;
    const hasAnyMapPoints =
      !!userCoords || hasPickupCoords || hasDeliveryCoords;

    // Track metrics for both legs
    const [metrics, setMetrics] = useState({
      leg1: { distance: 0, duration: 0 },
      leg2: { distance: 0, duration: 0 },
    });
    const [heading, setHeading] = useState<number | null>(null);
    const headingRef = useRef(0);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
      if (!visible) {
        return;
      }

      let isActive = true;
      headingRef.current = 0;
      lastUpdateRef.current = 0;
      setHeading(null);
      const startCompass = async () => {
        try {
          await CompassHeading.start(
            5,
            ({
              heading: newHeading,
              accuracy,
            }: {
              heading: number;
              accuracy: number;
            }) => {
              if (
                !isActive ||
                !Number.isFinite(newHeading) ||
                !Number.isFinite(accuracy) ||
                accuracy < 0
              ) {
                return;
              }

              const now = Date.now();
              if (now - lastUpdateRef.current < 100) {
                return;
              }
              lastUpdateRef.current = now;

              const normalizedHeading = ((newHeading % 360) + 360) % 360;
              const current = headingRef.current;
              const difference =
                ((normalizedHeading - current + 540) % 360) - 180;
              if (Math.abs(difference) < 3) {
                return;
              }

              const smoothedHeading =
                (current + difference * 0.15 + 360) % 360;
              headingRef.current = smoothedHeading;
              setHeading(smoothedHeading);
            },
          );
        } catch (error) {
          if (isActive) {
            console.warn('Could not read compass heading:', error);
          }
        }
      };

      startCompass().catch(error => {
        console.warn('Could not start compass heading:', error);
      });
      return () => {
        isActive = false;
        CompassHeading.stop().catch((error: unknown) => {
          console.warn('Could not stop compass heading:', error);
        });
      };
    }, [visible]);

    const fetchUserLocation = useCallback(async () => {
      try {
        const granted = await requestPermission();
        if (granted) {
          const pos = await getCurrentPosition();
          setUserCoords(pos);
        }
      } catch (error) {
        console.warn('Could not get driver location for route map:', error);
      }
    }, [getCurrentPosition, requestPermission]);

    const handleFitAll = useCallback(() => {
      const points: Coords[] = [];
      if (userCoords) points.push(userCoords);
      if (pickupPoint) points.push(pickupPoint);
      if (deliveryPoint) points.push(deliveryPoint);

      if (mapRef.current && mapReady && points.length > 0) {
        if (points.length === 1) {
          mapRef.current.animateToRegion(
            {
              ...points[0],
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            },
            300,
          );
        } else {
          mapRef.current.fitToCoordinates(points, {
            edgePadding: { top: 120, right: 60, bottom: 300, left: 60 },
            animated: true,
          });
        }
      }
    }, [userCoords, mapReady, pickupPoint, deliveryPoint]);

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
        setRouteError(null);
        setMetrics({
          leg1: { distance: 0, duration: 0 },
          leg2: { distance: 0, duration: 0 },
        });
        setUserCoords(null);
        setMapReady(false);
        setLoading(hasBothCoords);
        fetchUserLocation();
        if (!hasBothCoords) {
          return;
        }
      } else {
        setLoading(false);
        setRouteError(null);
      }
    }, [visible, hasBothCoords, fetchUserLocation]);

    useEffect(() => {
      if (visible && mapReady) {
        handleFitAll();
      }
    }, [visible, mapReady, userCoords, handleFitAll]);

    // Combined totals
    const totalDistance = (
      metrics.leg1.distance + metrics.leg2.distance
    ).toFixed(1);
    const totalDuration = Math.ceil(
      metrics.leg1.duration + metrics.leg2.duration,
    );
    const formatDuration = (totalMinutes: number): string => {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      if (hours === 0) return `${mins} mins`;
      if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} mins`;
    };

    const formattedDuration = formatDuration(totalDuration);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            onMapReady={() => setMapReady(true)}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType={mapType}
            showsUserLocation={false}
            showsCompass
            zoomEnabled={true}
            zoomControlEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
            zoomTapEnabled={true}
          >
            {hasBothCoords && (
              <>
                {/* LEG 1: DRIVER -> PICKUP (BLUE) */}
                {userCoords && (
                  <MapViewDirections
                    origin={userCoords}
                    destination={pickupPoint}
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
                    onError={errorMessage => {
                      console.warn(
                        'Driver to Pickup Directions error:',
                        errorMessage,
                      );
                    }}
                  />
                )}

                {/* LEG 2: PICKUP -> DROP (EMERALD) */}
                <MapViewDirections
                  origin={pickupPoint}
                  destination={deliveryPoint}
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
                  onError={errorMessage => {
                    console.warn(
                      'Pickup to Delivery Directions error:',
                      errorMessage,
                    );
                    setLoading(false);
                    setRouteError(
                      typeof errorMessage === 'string'
                        ? errorMessage
                        : 'Could not calculate route between pickup and delivery locations.',
                    );
                  }}
                />
              </>
            )}

            {userCoords && (
              <Marker
                coordinate={userCoords}
                anchor={{ x: 0.5, y: 0.68 }}
                tracksViewChanges
                zIndex={3}
              >
                <View style={styles.driverMarkerContainer}>
                  <View style={styles.driverMarkerLabel}>
                    <AppText style={styles.driverMarkerLabelText}>You</AppText>
                  </View>
                  <View style={styles.driverMarkerBadge}>
                    <Navigation2Icon
                      size={16}
                      color={COLORS.white}
                      fill={COLORS.white}
                      style={
                        heading === null
                          ? undefined
                          : { transform: [{ rotate: `${heading}deg` }] }
                      }
                    />
                  </View>
                </View>
              </Marker>
            )}

            {pickupPoint && (
              <Marker coordinate={pickupPoint}>
                <CustomMarker
                  color={COLORS.goldDark}
                  icon={MapPin}
                  label="Pickup"
                />
              </Marker>
            )}

            {deliveryPoint && (
              <Marker coordinate={deliveryPoint}>
                <CustomMarker
                  color={COLORS.success}
                  icon={MapPin}
                  label="Delivery"
                />
              </Marker>
            )}
          </MapView>

          {/* HEADER OVERLAY WITH BACK BUTTON */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={onClose}
              accessibilityLabel="Back"
              accessibilityRole="button"
            >
              <AppIcon
                name={'ArrowLeft'}
                size={20}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.routeHeaderInfo}>
              <AppText style={styles.headerTitle}>
                {showCoordsAlert ? 'Route Unavailable' : 'Trip Route'}
              </AppText>
              {!showCoordsAlert && (
                <View style={styles.liveIndicator}>
                  <View style={styles.pulseDot} />
                  <AppText style={styles.liveText}>ROUTE READY</AppText>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() =>
                setMapType(mapType === 'standard' ? 'satellite' : 'standard')
              }
              accessibilityRole="button"
              accessibilityLabel={
                mapType === 'standard'
                  ? 'Switch to satellite map'
                  : 'Switch to standard map'
              }
            >
              <AppIcon name={'Map'} size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* SIDE CONTROLS */}
          {hasAnyMapPoints && (
            <View style={styles.sideControls}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={handleFitAll}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Fit route on map"
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
                accessibilityRole="button"
                accessibilityLabel="Zoom in"
              >
                <AppIcon name={'Plus'} size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.circleBtn, { marginTop: 10 }]}
                onPress={handleZoomOut}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Zoom out"
              >
                <AppIcon name={'Minus'} size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          )}

          {/* FLOATING TOTAL TRIP CARD */}
          {hasBothCoords && !showCoordsAlert && (
            <View style={styles.bottomCardWrapper}>
              <View style={styles.tripCard}>
                <View style={styles.metricRow}>
                  <View style={styles.metricItem}>
                    <AppIcon
                      name={'Navigation'}
                      size={18}
                      color={COLORS.info}
                    />
                    <View style={styles.metricTextContent}>
                      <AppText style={styles.metricLabel}>
                        Total Distance
                      </AppText>
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
                        {formattedDuration}
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
          )}

          {/* CUSTOM ALERT BOX WHEN COORDS NOT FOUND OR ROUTE FAILS */}
          {showCoordsAlert && (
            <View style={styles.alertBackdrop} pointerEvents="box-none">
              <View style={styles.alertCard}>
                <View style={styles.alertIconBadge}>
                  <AppIcon
                    name={'AlertTriangle'}
                    size={28}
                    color={COLORS.warning}
                  />
                </View>

                <AppText style={styles.alertTitle}>
                  {routeError ? 'Route Not Found' : 'Coordinates Not Found'}
                </AppText>

                <AppText style={styles.alertDescription}>
                  {routeError
                    ? 'Could not calculate driving directions between pickup and delivery. Please contact dispatch.'
                    : !hasPickupCoords && !hasDeliveryCoords
                    ? 'Both pickup and delivery coordinates could not be found for this shipment. Please contact dispatch.'
                    : !hasPickupCoords
                    ? 'Pickup coordinates could not be found for this shipment. Please contact dispatch.'
                    : 'Delivery coordinates could not be found for this shipment. Please contact dispatch.'}
                </AppText>

                <TouchableOpacity
                  style={styles.alertBackButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <AppIcon name={'ArrowLeft'} size={18} color={COLORS.white} />
                  <AppText style={styles.alertBackButtonText}>Go Back</AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading && !showCoordsAlert && (
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
