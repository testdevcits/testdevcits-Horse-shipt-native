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
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
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
import moment from 'moment';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';

import { useTracking } from './useTracking';
import { AppText } from '../../../../components';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';

const { width, height } = Dimensions.get('window');

const LiveTrackingScreen = ({ route, navigation }: any) => {
  const { shipmentId } = route.params;
  const { data, loading } = useTracking(shipmentId);
  const mapRef = useRef<MapView>(null);

  // Auto-fit camera when coordinates change
  useEffect(() => {
    if (data && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: data.driver.lat, longitude: data.driver.lng },
          { latitude: data.delivery.lat, longitude: data.delivery.lng },
        ],
        {
          edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
          animated: true,
        },
      );
    }
  }, [data]);

  if (loading || !data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.goldPrimary} />
        <AppText style={{ marginTop: 10 }}>Initializing Live Map...</AppText>
      </View>
    );
  }

  const statusLabel =
    {
      inTransit: 'In Transit',
      nearDestination: 'Near Destination',
      delivered: 'Delivered',
      enRouteToPickup: 'Heading to Pickup',
    }[data.tripStatus] || data.tripStatus;

  return (
    <View style={styles.container}>
      {/* 1. MAP SECTION */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: data.driver.lat,
          longitude: data.driver.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Road-following Polyline */}
        <MapViewDirections
          origin={{ latitude: data.driver.lat, longitude: data.driver.lng }}
          destination={{
            latitude: data.delivery.lat,
            longitude: data.delivery.lng,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor={COLORS.goldPrimary}
          optimizeWaypoints={true}
        />

        {/* Pickup Marker */}
        <Marker
          coordinate={{ latitude: data.pickup.lat, longitude: data.pickup.lng }}
        >
          <View style={styles.markerCircle}>
            <View style={[styles.dot, { backgroundColor: COLORS.grey400 }]} />
          </View>
        </Marker>

        {/* Delivery Marker */}
        <Marker
          coordinate={{
            latitude: data.delivery.lat,
            longitude: data.delivery.lng,
          }}
        >
          <View style={styles.markerCircle}>
            <MapPin size={20} color={COLORS.error} fill={COLORS.white} />
          </View>
        </Marker>

        {/* LIVE DRIVER TRUCK MARKER */}
        <Marker
          coordinate={{ latitude: data.driver.lat, longitude: data.driver.lng }}
          rotation={data.driver.heading}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Truck
            // source={require('../../assets/images/truck_marker.png')}
            // style={{ width: 40, height: 40, resizeMode: 'contain' }}
            size={40}
          />
        </Marker>
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
            {statusLabel.toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* 3. FLOATING MAP CONTROLS */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlBtn}>
          <LocateFixed size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 4. DRIVER QUICK CARD */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.driverAvatar}
          />
          <View>
            <AppText style={styles.driverName}>Rupesh Singh</AppText>
            <AppText style={styles.lastUpdated}>
              Updated {moment(data.driver.updatedAt).fromNow()}
            </AppText>
          </View>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconAction}>
            <Phone size={20} color={COLORS.goldPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAction}>
            <MessageCircle size={20} color={COLORS.goldPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAction}>
            <Share2 size={20} color={COLORS.goldPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. BOTTOM TRACKING SHEET */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.etaContainer}>
          <View>
            <AppText style={styles.etaLabel}>Estimated Arrival</AppText>
            <AppText style={styles.etaTime}>
              {moment()
                .add(data.delivery.etaMinutes, 'minutes')
                .format('hh:mm A')}
            </AppText>
          </View>
          <View style={styles.distanceBadge}>
            <Navigation size={14} color={COLORS.white} />
            <AppText style={styles.distanceText}>
              {data.delivery.distanceKm} km left
            </AppText>
          </View>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelinePointActive}>
              <CheckCircle2 size={16} color={COLORS.goldPrimary} />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.locationTitle}>Pickup Point</AppText>
              <AppText numberOfLines={1} style={styles.locationSub}>
                {data.pickup.location}
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
                {data.delivery.location}
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

  // Header styles
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 12,
    letterSpacing: 1,
  },

  // Driver Card
  driverCard: {
    position: 'absolute',
    bottom: 300,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.grey100,
  },
  driverName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  lastUpdated: { fontSize: 11, color: COLORS.textSecondary },
  actionRow: { flexDirection: 'row', gap: 10 },
  iconAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.grey200,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  etaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  etaLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  etaTime: { fontSize: 28, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.goldPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  distanceText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 12 },

  // Timeline
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  timelinePointActive: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelinePoint: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: COLORS.grey100,
    marginLeft: 15,
  },
  timelineContent: { flex: 1 },
  locationTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  locationSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Markers
  markerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.grey200,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  mapControls: { position: 'absolute', right: 20, bottom: 380 },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default LiveTrackingScreen;
