

import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  X,
  Navigation,
  Clock,
  Layers,
  LocateFixed,
  MapPin,
  Package,
  Flag,
  Truck,
} from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, ICON_SIZE, SIZES } from '../../constants';
import AppText from './AppText';
import { GOOGLE_MAPS_APIKEY } from '../../config/constants';

const { height } = Dimensions.get('window');

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  shipmentData?: {
    pickupLocation?: string;
    deliveryLocation?: string;
    driverName?: string;
    status?: string;
    estimatedTime?: string;
  };
  distance?: string;
  pickupCoords?: { latitude: number; longitude: number };
  deliveryCoords?: { latitude: number; longitude: number };
  currentLocation?: { latitude: number; longitude: number };
}

const MapModal = ({
  visible,
  onClose,
  shipmentData,
  distance: initialDistance = 'Calculating...',
  pickupCoords,
  deliveryCoords,
  currentLocation,
}: MapModalProps) => {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>(
    'standard',
  );
  const [loading, setLoading] = useState(true);

  // Leg 1: Driver -> Pickup
  const [leg1Metrics, setLeg1Metrics] = useState({ distance: 0, duration: 0 });
  // Leg 2: Pickup -> Delivery
  const [leg2Metrics, setLeg2Metrics] = useState({ distance: 0, duration: 0 });

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const hasCurrentLocation = Boolean(
    currentLocation && currentLocation.latitude && currentLocation.longitude,
  );

  const pickup = pickupCoords || { latitude: 41.1544, longitude: -8.6498 };
  const delivery = deliveryCoords || { latitude: 41.671, longitude: -72.949 };

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible, pulseAnim]);

  const toggleMapType = () => {
    setMapType(prev => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  const centerMap = useCallback(() => {
    if (!mapRef.current) return;
    const points: { latitude: number; longitude: number }[] = [];
    if (hasCurrentLocation && currentLocation) {
      points.push(currentLocation);
    }
    if (pickup) points.push(pickup);
    if (delivery) points.push(delivery);

    if (points.length > 0) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 120, right: 60, bottom: 380, left: 60 },
        animated: true,
      });
    }
  }, [hasCurrentLocation, currentLocation, pickup, delivery]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        centerMap();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [visible, centerMap]);

  // Dynamic calculations
  const totalDistanceKm = hasCurrentLocation
    ? leg1Metrics.distance + leg2Metrics.distance
    : leg2Metrics.distance;

  const totalDurationMins = hasCurrentLocation
    ? leg1Metrics.duration + leg2Metrics.duration
    : leg2Metrics.duration;

  const displayDistance =
    totalDistanceKm > 0
      ? `${totalDistanceKm.toFixed(1)} km`
      : initialDistance;

  const displayDuration =
    totalDurationMins > 0
      ? `${Math.ceil(totalDurationMins)} mins`
      : shipmentData?.estimatedTime || '--';

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
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
          {/* LEG 1: DRIVER -> PICKUP (when currentLocation is available) */}
          {hasCurrentLocation && currentLocation && (
            <MapViewDirections
              origin={currentLocation}
              destination={pickup}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#3B82F6"
              lineDashPattern={[6, 4]}
              onReady={result => {
                setLeg1Metrics({
                  distance: result.distance,
                  duration: result.duration,
                });
                centerMap();
              }}
              onError={err => console.log('Leg 1 Directions Error:', err)}
            />
          )}

          {/* LEG 2: PICKUP -> DELIVERY */}
          <MapViewDirections
            origin={pickup}
            destination={delivery}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor={hasCurrentLocation ? '#10B981' : COLORS.primary}
            onReady={result => {
              setLeg2Metrics({
                distance: result.distance,
                duration: result.duration,
              });
              setLoading(false);
              centerMap();
            }}
            onError={err => {
              console.log('Leg 2 Directions Error:', err);
              setLoading(false);
            }}
          />

          {/* Driver Marker */}
          {hasCurrentLocation && currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Driver Location"
              description={shipmentData?.driverName || 'Driver Live Position'}
              zIndex={10}
            >
              <View style={styles.markerWrapper}>
                <Animated.View
                  style={[
                    styles.markerBadge,
                    {
                      backgroundColor: '#3B82F6',
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Truck size={12} color={COLORS.white} />
                  <AppText style={styles.markerBadgeText}>Driver</AppText>
                </Animated.View>
                <View style={[styles.markerPin, { backgroundColor: '#3B82F6' }]}>
                  <Truck size={18} color={COLORS.white} strokeWidth={2.5} />
                </View>
                <View
                  style={[
                    styles.markerPointer,
                    { borderTopColor: '#3B82F6' },
                  ]}
                />
              </View>
            </Marker>
          )}

          {/* Pickup Marker */}
          <Marker
            coordinate={pickup}
            title="Pickup Location"
            description={shipmentData?.pickupLocation || 'Pickup Location'}
            zIndex={5}
          >
            <View style={styles.markerWrapper}>
              <View
                style={[
                  styles.markerBadge,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Package size={12} color={COLORS.white} />
                <AppText style={styles.markerBadgeText}>Pickup</AppText>
              </View>
              <View
                style={[
                  styles.markerPin,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Package size={18} color={COLORS.white} strokeWidth={2.5} />
              </View>
              <View
                style={[
                  styles.markerPointer,
                  { borderTopColor: COLORS.primary },
                ]}
              />
            </View>
          </Marker>

          {/* Delivery Marker */}
          <Marker
            coordinate={delivery}
            title="Delivery Location"
            description={shipmentData?.deliveryLocation || 'Delivery Location'}
            zIndex={5}
          >
            <View style={styles.markerWrapper}>
              <View
                style={[styles.markerBadge, { backgroundColor: COLORS.error }]}
              >
                <Flag size={12} color={COLORS.white} />
                <AppText style={styles.markerBadgeText}>Delivery</AppText>
              </View>
              <View
                style={[styles.markerPin, { backgroundColor: COLORS.error }]}
              >
                <Flag size={18} color={COLORS.white} strokeWidth={2.5} />
              </View>
              <View
                style={[
                  styles.markerPointer,
                  { borderTopColor: COLORS.error },
                ]}
              />
            </View>
          </Marker>
        </MapView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <AppText style={styles.loadingText}>
              Calculating live route...
            </AppText>
          </View>
        )}

        {/* TOP CONTROLS */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <X size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.statusPill}>
            <View style={styles.liveDot} />
            <AppText style={styles.statusPillText}>
              {shipmentData?.status?.replace('_', ' ').toUpperCase() ||
                'IN TRANSIT'}
            </AppText>
          </View>
        </View>

        {/* SIDE CONTROLS */}
        <View style={styles.sideControls}>
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={toggleMapType}
            activeOpacity={0.8}
          >
            <Layers size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideBtn}
            onPress={centerMap}
            activeOpacity={0.8}
          >
            <LocateFixed size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* BOTTOM INFO CARD */}
        <View style={styles.infoCardWrapper}>
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.statBox}>
                <Navigation size={18} color={COLORS.primary} />
                <View>
                  <AppText style={styles.statLabel}>
                    {hasCurrentLocation ? 'Total Distance' : 'Road Distance'}
                  </AppText>
                  <AppText style={styles.statValue}>{displayDistance}</AppText>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Clock size={18} color={COLORS.primary} />
                <View>
                  <AppText style={styles.statLabel}>Est. Travel</AppText>
                  <AppText style={styles.statValue}>{displayDuration}</AppText>
                </View>
              </View>
            </View>

            {/* Address Route Timeline */}
            <View style={styles.addressSection}>
              {hasCurrentLocation && (
                <View style={styles.addressRow}>
                  <View style={styles.addressIconCol}>
                    <View
                      style={[styles.tinyDot, { backgroundColor: '#3B82F6' }]}
                    />
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.addressTextCol}>
                    <AppText style={styles.addressSubLabel}>
                      Driver Live Location
                    </AppText>
                    <AppText numberOfLines={1} style={styles.addressText}>
                      {shipmentData?.driverName || 'En Route to Pickup'}
                    </AppText>
                  </View>
                  {leg1Metrics.distance > 0 && (
                    <View style={styles.legChip}>
                      <AppText style={styles.legChipText}>
                        {leg1Metrics.distance.toFixed(1)} km
                      </AppText>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.addressRow}>
                <View style={styles.addressIconCol}>
                  <View
                    style={[
                      styles.tinyDot,
                      { backgroundColor: COLORS.primary },
                    ]}
                  />
                  <View style={styles.verticalLine} />
                </View>
                <View style={styles.addressTextCol}>
                  <AppText style={styles.addressSubLabel}>Pickup Location</AppText>
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {shipmentData?.pickupLocation || 'Not Available'}
                  </AppText>
                </View>
                {hasCurrentLocation && leg2Metrics.distance > 0 && (
                  <View style={styles.legChip}>
                    <AppText style={styles.legChipText}>
                      {leg2Metrics.distance.toFixed(1)} km
                    </AppText>
                  </View>
                )}
              </View>

              <View style={styles.addressRow}>
                <View style={styles.addressIconCol}>
                  <MapPin size={14} color={COLORS.error} />
                </View>
                <View style={styles.addressTextCol}>
                  <AppText style={styles.addressSubLabel}>Delivery Location</AppText>
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {shipmentData?.deliveryLocation || 'Not Available'}
                  </AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.trackBtn}
              activeOpacity={0.9}
            >
              <AppText style={styles.trackBtnText}>Close Map</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  map: { ...StyleSheet.absoluteFillObject },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  markerBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
  },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusPillText: {
    color: COLORS.white, fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold
  },
  sideControls: {
    position: 'absolute',
    right: SPACING.lg,
    top: height * 0.2,
    gap: 12,
  },
  sideBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCardWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statBox: { flexDirection: 'row', gap: SPACING.sm2, alignItems: 'center' },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  statDivider: { width: SIZES.borderWidthThin, height: '100%', backgroundColor: COLORS.divider },
  addressSection: { marginVertical: SPACING.lg, gap: SPACING.sm },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  addressIconCol: { width: SPACING.xl, alignItems: 'center' },
  tinyDot: { width: SPACING.sm, height: SPACING.sm, borderRadius: RADIUS.xs },
  verticalLine: {
    width: SIZES.borderWidthThick,
    height: SPACING.xxl,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.xxs,
  },
  addressTextCol: { flex: 1 },
  addressSubLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  legChip: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  legChipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
  },
  trackBtn: {
    backgroundColor: COLORS.primary,
    height: RADIUS.circle,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackBtnText: { color: COLORS.white, fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold },
});

export default memo(MapModal);

