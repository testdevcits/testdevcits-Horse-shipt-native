import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  X,
  Phone,
  MessageCircle,
  Share2,
  Navigation,
  LocateFixed,
  Info,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Truck,
} from 'lucide-react-native';
import { formatDate, formatFromNow } from '../../../../utils/helpers';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../../constants';
import { useTracking } from './useTracking';
import { AppText } from '../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';

const { width, height } = Dimensions.get('window');

const LiveTrackingScreen = ({ route, navigation }: any) => {
  const shipmentId = route.params?.shipmentId;
  const { data, loading } = useTracking(shipmentId);
  const mapRef = useRef<MapView>(null);

  // Safely extract coordinates
  const hasDriverCoords = Boolean(data?.driver?.lat && data?.driver?.lng);
  const hasPickupCoords = Boolean(data?.pickup?.lat && data?.pickup?.lng);
  const hasDeliveryCoords = Boolean(data?.delivery?.lat && data?.delivery?.lng);

  const pickupLat = data?.pickup?.lat || 22.96;
  const pickupLng = data?.pickup?.lng || 76.05;

  const deliveryLat = data?.delivery?.lat || 23.83;
  const deliveryLng = data?.delivery?.lng || 78.73;

  const driverLat = data?.driver?.lat;
  const driverLng = data?.driver?.lng;

  // Origin for route directions: Driver location if available, otherwise Pickup location
  const routeOrigin = hasDriverCoords
    ? { latitude: driverLat!, longitude: driverLng! }
    : { latitude: pickupLat, longitude: pickupLng };

  const routeDestination = {
    latitude: deliveryLat,
    longitude: deliveryLng,
  };

  // Auto-fit camera when coordinates change
  useEffect(() => {
    if (data && mapRef.current) {
      const coordsToFit: { latitude: number; longitude: number }[] = [];

      if (hasDriverCoords) {
        coordsToFit.push({ latitude: driverLat!, longitude: driverLng! });
      }
      if (hasPickupCoords) {
        coordsToFit.push({ latitude: pickupLat, longitude: pickupLng });
      }
      if (hasDeliveryCoords) {
        coordsToFit.push({ latitude: deliveryLat, longitude: deliveryLng });
      }

      if (coordsToFit.length >= 2) {
        mapRef.current.fitToCoordinates(coordsToFit, {
          edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
          animated: true,
        });
      }
    }
  }, [data, hasDriverCoords, hasPickupCoords, hasDeliveryCoords]);

  if (loading || !data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <AppText style={{ marginTop: 10 }}>Initializing Live Map...</AppText>
      </View>
    );
  }

  const rawTripStatus = data?.tripStatus || 'PENDING';
  const statusMap: Record<string, string> = {
    inTransit: 'In Transit',
    nearDestination: 'Near Destination',
    delivered: 'Delivered',
    enRouteToPickup: 'Heading to Pickup',
    pending: 'Pending Driver',
    assigned: 'Assigned',
  };
  const statusLabel = statusMap[rawTripStatus] || rawTripStatus;

  // Driver details safely extracted
  const driverObj = data?.driver as any;
  const driverName = driverObj?.name || 'Driver Not Assigned Yet';
  const driverUpdatedAt = driverObj?.updatedAt
    ? `Updated ${formatFromNow(driverObj.updatedAt)}`
    : 'Waiting for driver update';

  // ETA & Distance formatting
  const etaFormatted = data?.delivery?.etaMinutes
    ? formatDate(new Date(Date.now() + data?.delivery.etaMinutes * 60000), 'hh:mm A')
    : '--:--';
  const distanceKmText = data?.delivery?.distanceKm
    ? `${data?.delivery.distanceKm} km left`
    : 'Route calculated';

  return (
    <View style={styles.container}>
      {/* 1. MAP SECTION */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: hasDriverCoords ? driverLat! : pickupLat,
          longitude: hasDriverCoords ? driverLng! : pickupLng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {/* Road-following Polyline (Pickup to Delivery OR Driver to Delivery) */}
        {hasPickupCoords && hasDeliveryCoords && (
          <MapViewDirections
            origin={routeOrigin}
            destination={routeDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
          />
        )}

        {/* Pickup Marker */}
        {hasPickupCoords && (
          <Marker coordinate={{ latitude: pickupLat, longitude: pickupLng }}>
            <View style={styles.markerCircle}>
              <View style={[styles.dot, { backgroundColor: COLORS.grey400 }]} />
            </View>
          </Marker>
        )}

        {/* Delivery Marker */}
        {hasDeliveryCoords && (
          <Marker coordinate={{ latitude: deliveryLat, longitude: deliveryLng }}>
            <View style={styles.markerCircle}>
              <MapPin size={18} color={COLORS.error} fill={COLORS.white} />
            </View>
          </Marker>
        )}

        {/* LIVE DRIVER TRUCK MARKER (ONLY SHOW IF DRIVER OBJECT AND COORDS EXIST) */}
        {hasDriverCoords && (
          <Marker
            coordinate={{ latitude: driverLat!, longitude: driverLng! }}
            rotation={driverObj?.heading || 0}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.truckMarkerContainer}>
              <Truck size={24} color="#A06333" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* 2. TOP GLASSMORHISM HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <AppText style={styles.statusText}>
            {String(statusLabel).toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* 3. FLOATING MAP CONTROLS */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            if (mapRef.current) {
              const coords = [];
              if (hasDriverCoords) coords.push({ latitude: driverLat!, longitude: driverLng! });
              if (hasPickupCoords) coords.push({ latitude: pickupLat, longitude: pickupLng });
              if (hasDeliveryCoords) coords.push({ latitude: deliveryLat, longitude: deliveryLng });

              if (coords.length > 0) {
                mapRef.current.fitToCoordinates(coords, {
                  edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
                  animated: true,
                });
              }
            }
          }}
        >
          <LocateFixed size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 4. DRIVER QUICK CARD */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: driverObj?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.driverAvatar}
          />
          <View style={{ flex: 1, paddingRight: 8 }}>
            <AppText style={styles.driverName}>{driverName}</AppText>
            <AppText style={styles.lastUpdated}>{driverUpdatedAt}</AppText>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
            <Phone size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
            <MessageCircle size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAction} activeOpacity={0.7}>
            <Share2 size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. BOTTOM TRACKING SHEET */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.etaContainer}>
          <View>
            <AppText style={styles.etaLabel}>Estimated Arrival</AppText>
            <AppText style={styles.etaTime}>{etaFormatted}</AppText>
          </View>
          <View style={styles.distanceBadge}>
            <Navigation size={14} color={COLORS.white} />
            <AppText style={styles.distanceText}>{distanceKmText}</AppText>
          </View>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelinePointActive}>
              <CheckCircle2 size={16} color={COLORS.primary} />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>Pickup Point</AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data?.pickup?.location || 'Pickup Location'}
              </AppText>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={styles.timelinePoint}>
              <Clock size={16} color={COLORS.grey400} />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>
                Delivery Destination
              </AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data?.delivery?.location || 'Delivery Destination'}
              </AppText>
            </View>
            <ChevronRight size={20} color={COLORS.grey300} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },

  // Marker styles
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Truck Marker Container
  truckMarkerContainer: {
    padding: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#A06333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  // Header styles
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    right: SPACING.md,
    top: Platform.OS === 'ios' ? 110 : 80,
    zIndex: 10,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Driver Card
  driverCard: {
    position: 'absolute',
    bottom: 220,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.grey100,
  },
  driverName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  iconAction: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.grey200,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  etaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  etaLabel: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  etaTime: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    gap: SPACING.xs,
  },
  distanceText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Timeline
  timeline: {
    paddingLeft: SPACING.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  timelinePointActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelinePoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  locationSub: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.grey200,
    marginLeft: 11,
    marginVertical: 2,
  },
});

export default LiveTrackingScreen;
