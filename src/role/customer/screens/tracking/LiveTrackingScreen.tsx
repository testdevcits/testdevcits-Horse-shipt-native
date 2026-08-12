import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,

  ActivityIndicator,
  Linking,
  Share,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  X,

  Navigation,
  LocateFixed,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Truck,
  RefreshCw,
} from 'lucide-react-native';
import { formatDate, formatFromNow } from '../../../../utils/helpers';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SIZES, SPACING } from '../../../../constants';
import { useTracking } from './useTracking';
import { AppText } from '../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';
import imageIndex from '../../../../assets/images/imageIndex';


const LiveTrackingScreen = ({ route, navigation }: any) => {
  const shipmentId = route.params?.shipmentId;
  const { data, loading, refreshing, refetch } = useTracking(shipmentId);
  const mapRef = useRef<MapView>(null);
  const [routeDirectionData, setRouteDirectionData] = useState<{
    distanceKm?: number;
    durationMins?: number;
  }>({});

  // Safely extract coordinates
  const hasDriverCoords = Boolean(data?.driver?.lat && data?.driver?.lng);
  const hasPickupCoords = Boolean(data?.pickup?.lat && data?.pickup?.lng);
  const hasDeliveryCoords = Boolean(data?.delivery?.lat && data?.delivery?.lng);

  const pickupLat = data?.pickup?.lat || 22.6657;
  const pickupLng = data?.pickup?.lng || 75.9129;

  const deliveryLat = data?.delivery?.lat || 22.5937;
  const deliveryLng = data?.delivery?.lng || 76.9126;

  const driverLat = data?.driver?.lat;
  const driverLng = data?.driver?.lng;

  // Origin for route directions: Driver location if available, otherwise Pickup location




  // Auto-fit camera when coordinates change
  const handleRecenterMap = () => {
    if (mapRef.current) {
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
          edgePadding: { top: 120, right: 60, bottom: 380, left: 60 },
          animated: true,
        });
      } else if (coordsToFit.length === 1) {
        mapRef.current.animateToRegion({
          latitude: coordsToFit[0].latitude,
          longitude: coordsToFit[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      handleRecenterMap();
    }
  }, [data?.driver?.lat, data?.driver?.lng]);

  // Status Info normalization
  const rawTripStatus = data?.tripStatus || 'inTransit';
  const getStatusDetails = (rawStatus: string) => {
    const s = (rawStatus || '').toLowerCase();
    if (s.includes('intransit') || s.includes('in_transit')) {
      return { label: 'In Transit', badgeBg: 'rgba(59, 130, 246, 0.95)', isPickupDone: true, isDelivered: false };
    }
    if (s.includes('near')) {
      return { label: 'Near Destination', badgeBg: 'rgba(245, 158, 11, 0.95)', isPickupDone: true, isDelivered: false };
    }
    if (s.includes('delivered') || s.includes('complete')) {
      return { label: 'Delivered', badgeBg: 'rgba(16, 185, 129, 0.95)', isPickupDone: true, isDelivered: true };
    }
    if (s.includes('pickup')) {
      return { label: 'Heading to Pickup', badgeBg: 'rgba(99, 102, 241, 0.95)', isPickupDone: false, isDelivered: false };
    }
    if (s.includes('assign')) {
      return { label: 'Driver Assigned', badgeBg: 'rgba(107, 114, 128, 0.95)', isPickupDone: false, isDelivered: false };
    }
    return { label: 'Live Tracking', badgeBg: COLORS.primary, isPickupDone: false, isDelivered: false };
  };

  const statusDetails = getStatusDetails(rawTripStatus);

  // Driver details safely extracted
  const driverObj = data?.driver;
  const driverName = driverObj?.name || 'Driver';
  const driverPhone = driverObj?.phone;
  const driverUpdatedAt = driverObj?.updatedAt
    ? `Updated ${formatFromNow(driverObj.updatedAt)}`
    : 'Live GPS Active';

  // ETA & Distance logic
  const isHeadingToPickup = rawTripStatus.toLowerCase().includes('pickup');
  const targetTargetObj = isHeadingToPickup ? data?.pickup : data?.delivery;

  const rawEtaMinutes = targetTargetObj?.etaMinutes || routeDirectionData.durationMins || 0;
  const rawDistanceKm = targetTargetObj?.distanceKm || routeDirectionData.distanceKm || 0;

  // Format ETA time (e.g. 127 mins -> 2h 7m & Clock e.g. 05:24 PM)
  const formatEtaString = (totalMins: number) => {
    if (!totalMins || totalMins <= 0) return 'Arriving Soon';
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    const timeStr = formatDate(new Date(Date.now() + totalMins * 60000), 'hh:mm A');
    if (hours > 0) {
      return `${timeStr} (${hours}h ${mins}m)`;
    }
    return `${timeStr} (${mins} mins)`;
  };

  const etaFormatted = formatEtaString(rawEtaMinutes);
  const distanceKmText = rawDistanceKm > 0 ? `${rawDistanceKm.toFixed(1)} km away` : 'Calculating route...';

  // Action handlers
  const handleCallDriver = () => {
    if (driverPhone) {
      Linking.openURL(`tel:${driverPhone}`);
    } else {
      Alert.alert('Contact Driver', 'Driver phone number is not available yet.');
    }
  };

  const handleMessageDriver = () => {
    if (driverPhone) {
      Linking.openURL(`sms:${driverPhone}`);
    } else {
      Alert.alert('Contact Driver', 'Driver phone number is not available yet.');
    }
  };

  const handleShareTracking = async () => {
    try {
      await Share.share({
        message: `Track shipment live on Horse Shipt: ${statusDetails.label}. ETA: ${etaFormatted}.`,
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  if (loading && !data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <AppText style={styles.loaderText}>Initializing Live Map...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. GOOGLE MAP SECTION */}
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
        {/* Road-following Polyline Routes */}
        {/* Segment 1: Driver -> Pickup (Rendered whenever driver coords exist) */}
        {hasDriverCoords && hasPickupCoords && (
          <MapViewDirections
            origin={{ latitude: driverLat!, longitude: driverLng! }}
            destination={{ latitude: pickupLat, longitude: pickupLng }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="#3B82F6"
            optimizeWaypoints={true}
          />
        )}

        {/* Segment 2: Pickup -> Destination (Rendered whenever pickup & delivery coords exist) */}
        {hasPickupCoords && hasDeliveryCoords && (
          <MapViewDirections
            origin={{ latitude: pickupLat, longitude: pickupLng }}
            destination={{ latitude: deliveryLat, longitude: deliveryLng }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
            onReady={result => {
              setRouteDirectionData({
                distanceKm: result.distance,
                durationMins: result.duration,
              });
            }}
          />
        )}

        {/* Pickup Marker */}
        {hasPickupCoords && (
          <Marker
            coordinate={{ latitude: pickupLat, longitude: pickupLng }}
            title="Pickup Location"
            description={data?.pickup?.location}
          >
            <View style={styles.markerCircle}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
            </View>
          </Marker>
        )}

        {/* Delivery Marker */}
        {hasDeliveryCoords && (
          <Marker
            coordinate={{ latitude: deliveryLat, longitude: deliveryLng }}
            title="Delivery Location"
            description={data?.delivery?.location}
          >
            <View style={styles.markerCircle}>
              <MapPin size={18} color={COLORS.error} fill={COLORS.white} />
            </View>
          </Marker>
        )}

        {/* LIVE DRIVER TRUCK MARKER */}
        {hasDriverCoords && (
          <Marker
            coordinate={{ latitude: driverLat!, longitude: driverLng! }}
            rotation={driverObj?.heading || 0}
            anchor={{ x: 0.5, y: 0.5 }}
            title={driverName}
            description={`Updated ${driverUpdatedAt}`}
          >
            <View style={styles.truckMarkerContainer}>
              <Truck size={22} color="#A06333" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* 2. TOP FLOATING HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <X size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.statusPill, { backgroundColor: statusDetails.badgeBg }]}>
          <View style={styles.pulseDot} />
          <AppText style={styles.statusText}>
            {statusDetails.label.toUpperCase()}
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={refetch}
          activeOpacity={0.8}
        >
          <RefreshCw size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 3. FLOATING MAP RE-CENTER CONTROL */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={handleRecenterMap}
          activeOpacity={0.8}
        >
          <LocateFixed size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 4. DRIVER QUICK INFO CARD */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image
            source={driverObj?.avatar ? {
              uri:
                driverObj?.avatar
            } : imageIndex.AccountIcon}
            style={styles.driverAvatar}
          />
          <View style={{ flex: 1 }}>
            <AppText style={styles.driverName} numberOfLines={1}>
              {driverName}
            </AppText>
            <AppText style={styles.lastUpdated}>{driverUpdatedAt}</AppText>
          </View>
        </View>
        {/* <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.iconAction}
            onPress={handleCallDriver}
            activeOpacity={0.7}
          >
            <Phone size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconAction}
            onPress={handleMessageDriver}
            activeOpacity={0.7}
          >
            <MessageCircle size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconAction}
            onPress={handleShareTracking}
            activeOpacity={0.7}
          >
            <Share2 size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* 5. BOTTOM TRACKING DETAILS SHEET */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        {/* ETA & Distance Row */}
        <View style={styles.etaContainer}>
          <View>
            <AppText style={styles.etaLabel}>
              {isHeadingToPickup ? 'Estimated Pickup Time' : 'Estimated Arrival'}
            </AppText>
            <AppText style={styles.etaTime}>{etaFormatted}</AppText>
          </View>
          <View style={styles.distanceBadge}>
            <Navigation size={14} color={COLORS.white} />
            <AppText style={styles.distanceText}>{distanceKmText}</AppText>
          </View>
        </View>

        {/* Stepper Timeline */}
        <View style={styles.timeline}>
          {/* Pickup Step */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelinePoint,
                statusDetails.isPickupDone && styles.timelinePointActive,
              ]}
            >
              <CheckCircle2
                size={16}
                color={statusDetails.isPickupDone ? COLORS.primary : COLORS.grey400}
              />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>Pickup Point</AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data?.pickup?.location || 'Pickup Location'}
              </AppText>
            </View>
          </View>

          <View style={styles.timelineLine} />

          {/* Delivery Step */}
          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelinePoint,
                statusDetails.isDelivered && styles.timelinePointActive,
              ]}
            >
              {statusDetails.isDelivered ? (
                <CheckCircle2 size={16} color={COLORS.primary} />
              ) : (
                <Clock size={16} color={COLORS.grey400} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>Delivery Destination</AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data?.delivery?.location || 'Delivery Destination'}
              </AppText>
            </View>
            <ChevronRight size={18} color={COLORS.grey300} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loaderContainer: {
    flex: 1,
    justify: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loaderText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  map: { flex: 1 },

  // Marker styles
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  // Header styles
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 24,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
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
    backgroundColor: COLORS.white,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    right: SPACING.md,
    top: Platform.OS === 'ios' ? 114 : 84,
    zIndex: 10,
  },
  controlBtn: {
    width: SIZES.controlBtn,
    height: SIZES.controlBtn,
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
    bottom: 215,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
    paddingRight: SPACING.xs,
  },
  driverAvatar: {
    width: SIZES.avatarMd44,
    height: SIZES.avatarMd44,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.grey100,
  },
  driverName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.xs,
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
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLORS.grey200,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  etaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  etaLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  etaTime: {
    fontSize: FONT_SIZE.xl,
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
    fontSize: FONT_SIZE.xs,
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
    backgroundColor: COLORS.goldLightBg,
  },
  timelinePoint: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.md,
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
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  timelineLine: {
    width: 2,
    height: 18,
    backgroundColor: COLORS.grey200,
    marginLeft: 11,
    marginVertical: 2,
  },
});

export default LiveTrackingScreen;
