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
 
import { formatDate, formatFromNow } from '../../../../utils/helpers';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SIZES,
  SPACING,
} from '../../../../constants';
import { useTracking } from './useTracking';
import { AppText } from '../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';
import imageIndex from '../../../../assets/images/imageIndex';
import AppIcon from '../../../../components/AppIcon';
import styles from './styles.Livetracking';

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
      return {
        label: 'In Transit',
        badgeBg: 'rgba(59, 130, 246, 0.95)',
        isPickupDone: true,
        isDelivered: false,
      };
    }
    if (s.includes('near')) {
      return {
        label: 'Near Destination',
        badgeBg: 'rgba(245, 158, 11, 0.95)',
        isPickupDone: true,
        isDelivered: false,
      };
    }
    if (s.includes('delivered') || s.includes('complete')) {
      return {
        label: 'Delivered',
        badgeBg: 'rgba(16, 185, 129, 0.95)',
        isPickupDone: true,
        isDelivered: true,
      };
    }
    if (s.includes('pickup')) {
      return {
        label: 'Heading to Pickup',
        badgeBg: 'rgba(99, 102, 241, 0.95)',
        isPickupDone: false,
        isDelivered: false,
      };
    }
    if (s.includes('assign')) {
      return {
        label: 'Driver Assigned',
        badgeBg: 'rgba(107, 114, 128, 0.95)',
        isPickupDone: false,
        isDelivered: false,
      };
    }
    return {
      label: 'Live Tracking',
      badgeBg: COLORS.primary,
      isPickupDone: false,
      isDelivered: false,
    };
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

  const rawEtaMinutes =
    targetTargetObj?.etaMinutes || routeDirectionData.durationMins || 0;
  const rawDistanceKm =
    targetTargetObj?.distanceKm || routeDirectionData.distanceKm || 0;

  // Format ETA time (e.g. 127 mins -> 2h 7m & Clock e.g. 05:24 PM)
  const formatEtaString = (totalMins: number) => {
    if (!totalMins || totalMins <= 0) return 'Arriving Soon';
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    const timeStr = formatDate(
      new Date(Date.now() + totalMins * 60000),
      'hh:mm A',
    );
    if (hours > 0) {
      return `${timeStr} (${hours}h ${mins}m)`;
    }
    return `${timeStr} (${mins} mins)`;
  };

  const etaFormatted = formatEtaString(rawEtaMinutes);
  const distanceKmText =
    rawDistanceKm > 0
      ? `${rawDistanceKm.toFixed(1)} km away`
      : 'Calculating route...';

  // Action handlers
  const handleCallDriver = () => {
    if (driverPhone) {
      Linking.openURL(`tel:${driverPhone}`);
    } else {
      Alert.alert(
        'Contact Driver',
        'Driver phone number is not available yet.',
      );
    }
  };

  const handleMessageDriver = () => {
    if (driverPhone) {
      Linking.openURL(`sms:${driverPhone}`);
    } else {
      Alert.alert(
        'Contact Driver',
        'Driver phone number is not available yet.',
      );
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
              <AppIcon name={'MapPin'} size={18} color={COLORS.error} fill={COLORS.white} />
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
              <AppIcon name={'Truck'} size={22} color="#A06333" />
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
          <AppIcon name={'X'} size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusDetails.badgeBg },
          ]}
        >
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
          <AppIcon name={'RefreshCw'} size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 3. FLOATING MAP RE-CENTER CONTROL */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={handleRecenterMap}
          activeOpacity={0.8}
        >
          <AppIcon name={'LocateFixed'} size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 4. DRIVER QUICK INFO CARD */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image
            source={
              driverObj?.avatar
                ? {
                    uri: driverObj?.avatar,
                  }
                : imageIndex.AccountIcon
            }
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
            <AppIcon name={'Phone'} size={18} color={COLORS.primary} />
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
              {isHeadingToPickup
                ? 'Estimated Pickup Time'
                : 'Estimated Arrival'}
            </AppText>
            <AppText style={styles.etaTime}>{etaFormatted}</AppText>
          </View>
          <View style={styles.distanceBadge}>
            <AppIcon name={'Navigation'} size={14} color={COLORS.white} />
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
              <AppIcon name={'CheckCircle2'} size={16} color={
                statusDetails.isPickupDone ? COLORS.primary : COLORS.grey400
              } />
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
                <AppIcon name={'CheckCircle2'} size={16} color={COLORS.primary} />
              ) : (
                <AppIcon name={'Clock'} size={16} color={COLORS.grey400} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>
                Delivery Destination
              </AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data?.delivery?.location || 'Delivery Destination'}
              </AppText>
            </View>
            <AppIcon name={'ChevronRight'} size={18} color={COLORS.grey300} />
          </View>
        </View>
      </View>
    </View>
  );
};

 

export default LiveTrackingScreen;
