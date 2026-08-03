// import React, { memo, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import MapView, {
//   Marker,
//   Polyline,
//   PROVIDER_GOOGLE,
//   Callout,
// } from 'react-native-maps';
// import {
//   X,
//   Navigation,
//   Clock,
//   Map as MapIcon,
//   Layers,
//   Maximize,
//   Minimize,
//   LocateFixed,
//   MapPin,
// } from 'lucide-react-native';
// import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
// import AppText from './AppText';

// const { width, height } = Dimensions.get('window');

// interface MapModalProps {
//   visible: boolean;
//   onClose: () => void;
//   shipmentData?: {
//     pickupLocation: string;
//     deliveryLocation: string;
//     status: string;
//     estimatedTime?: string;
//   };
//   distance?: string;
//   pickupCoords?: { latitude: number; longitude: number };
//   deliveryCoords?: { latitude: number; longitude: number };
// }

// const MapModal = ({
//   visible,
//   onClose,
//   shipmentData,
//   distance = 'Calculating...',
//   pickupCoords,
//   deliveryCoords,
// }: MapModalProps) => {
//   const mapRef = useRef<MapView>(null);
//   const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>(
//     'standard',
//   );
//   const [loading, setLoading] = useState(true);
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Default Fallbacks
//   const pickup = pickupCoords || { latitude: 41.1544, longitude: -8.6498 };
//   const delivery = deliveryCoords || { latitude: 57.4567, longitude: 9.9957 };

//   // Pulse animation for markers
//   useEffect(() => {
//     if (visible) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.2,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ]),
//       ).start();

//       // Auto-focus markers after a short delay
//       setTimeout(() => {
//         mapRef.current?.fitToCoordinates([pickup, delivery], {
//           edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
//           animated: true,
//         });
//         setLoading(false);
//       }, 1000);
//     }
//   }, [visible]);

//   const toggleMapType = () => {
//     setMapType(prev => (prev === 'standard' ? 'hybrid' : 'standard'));
//   };

//   const centerMap = () => {
//     mapRef.current?.fitToCoordinates([pickup, delivery], {
//       edgePadding: { top: 100, right: 100, bottom: 350, left: 100 },
//       animated: true,
//     });
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={false}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.container}>
//         {/* GOOGLE MAP */}
//         <MapView
//           ref={mapRef}
//           provider={PROVIDER_GOOGLE}
//           style={styles.map}
//           mapType={mapType}
//           showsUserLocation
//           showsCompass={false}
//           initialRegion={{
//             latitude: (pickup.latitude + delivery.latitude) / 2,
//             longitude: (pickup.longitude + delivery.longitude) / 2,
//             latitudeDelta: 10,
//             longitudeDelta: 10,
//           }}
//         >
//           {/* Pickup Marker */}
//           <Marker coordinate={pickup} title="Pickup Location">
//             <Animated.View
//               style={[
//                 styles.markerContainer,
//                 { transform: [{ scale: pulseAnim }] },
//               ]}
//             >
//               <View
//                 style={[
//                   styles.markerDot,
//                   { backgroundColor: COLORS.goldPrimary },
//                 ]}
//               />
//               <View
//                 style={[styles.markerHalo, { borderColor: COLORS.goldPrimary }]}
//               />
//             </Animated.View>
//           </Marker>

//           {/* Delivery Marker */}
//           <Marker coordinate={delivery} title="Delivery Location">
//             <Animated.View
//               style={[
//                 styles.markerContainer,
//                 { transform: [{ scale: pulseAnim }] },
//               ]}
//             >
//               <View
//                 style={[styles.markerDot, { backgroundColor: COLORS.success }]}
//               />
//               <View
//                 style={[styles.markerHalo, { borderColor: COLORS.success }]}
//               />
//             </Animated.View>
//           </Marker>

//           {/* Route Line */}
//           <Polyline
//             coordinates={[pickup, delivery]}
//             strokeColor={COLORS.goldPrimary}
//             strokeWidth={4}
//             lineDashPattern={[1]}
//             geodesic={true}
//           />
//         </MapView>

//         {/* LOADING OVERLAY */}
//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color={COLORS.goldPrimary} />
//             <AppText style={styles.loadingText}>
//               Loading Shipment Route...
//             </AppText>
//           </View>
//         )}

//         {/* TOP CONTROLS */}
//         <View style={styles.topControls}>
//           <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
//             <X size={24} color={COLORS.textPrimary} />
//           </TouchableOpacity>

//           <View style={styles.statusPill}>
//             <View style={styles.liveDot} />
//             <AppText style={styles.statusPillText}>
//               {shipmentData?.status?.replace('_', ' ').toUpperCase() ||
//                 'IN TRANSIT'}
//             </AppText>
//           </View>
//         </View>

//         {/* RIGHT SIDE CONTROLS */}
//         <View style={styles.sideControls}>
//           <TouchableOpacity style={styles.sideBtn} onPress={toggleMapType}>
//             <Layers size={20} color={COLORS.textPrimary} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.sideBtn} onPress={centerMap}>
//             <LocateFixed size={20} color={COLORS.textPrimary} />
//           </TouchableOpacity>
//         </View>

//         {/* FLOATING PREMIUM INFORMATION CARD */}
//         <View style={styles.infoCardWrapper}>
//           <View style={styles.infoCard}>
//             <View style={styles.cardHeader}>
//               <View style={styles.statBox}>
//                 <Navigation size={18} color={COLORS.goldPrimary} />
//                 <View>
//                   <AppText style={styles.statLabel}>Distance</AppText>
//                   <AppText style={styles.statValue}>{distance}</AppText>
//                 </View>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statBox}>
//                 <Clock size={18} color={COLORS.goldPrimary} />
//                 <View>
//                   <AppText style={styles.statLabel}>Est. Time</AppText>
//                   <AppText style={styles.statValue}>
//                     {shipmentData?.estimatedTime || '48h 20m'}
//                   </AppText>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.addressSection}>
//               <View style={styles.addressRow}>
//                 <View style={styles.addressIconCol}>
//                   <View
//                     style={[
//                       styles.tinyDot,
//                       { backgroundColor: COLORS.goldPrimary },
//                     ]}
//                   />
//                   <View style={styles.verticalLine} />
//                 </View>
//                 <View style={styles.addressTextCol}>
//                   <AppText numberOfLines={1} style={styles.addressText}>
//                     {shipmentData?.pickupLocation ||
//                       'Loading pickup location...'}
//                   </AppText>
//                 </View>
//               </View>

//               <View style={styles.addressRow}>
//                 <View style={styles.addressIconCol}>
//                   <MapPin size={14} color={COLORS.success} />
//                 </View>
//                 <View style={styles.addressTextCol}>
//                   <AppText numberOfLines={1} style={styles.addressText}>
//                     {shipmentData?.deliveryLocation ||
//                       'Loading delivery location...'}
//                   </AppText>
//                 </View>
//               </View>
//             </View>

//             <TouchableOpacity style={styles.trackBtn} activeOpacity={0.9}>
//               <AppText style={styles.trackBtnText}>Track Live Shipment</AppText>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.white },
//   map: { ...StyleSheet.absoluteFillObject },

//   // Custom Markers
//   markerContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 40,
//     height: 40,
//   },
//   markerDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2 },
//   markerHalo: {
//     position: 'absolute',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     borderWidth: 2,
//     opacity: 0.5,
//   },

//   // UI Overlays
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: COLORS.textSecondary,
//     fontFamily: FONTS.medium,
//   },

//   topControls: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 20,
//     left: SPACING.lg,
//     right: SPACING.lg,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   iconBtn: {
//     width: 44,
//     height: 44,
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.round,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//       },
//       android: { elevation: 5 },
//     }),
//   },
//   statusPill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: RADIUS.round,
//     gap: 8,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.success,
//   },
//   statusPillText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: FONTS.bold,
//     letterSpacing: 1,
//   },

//   sideControls: {
//     position: 'absolute',
//     right: SPACING.lg,
//     top: height * 0.25,
//     gap: 12,
//   },
//   sideBtn: {
//     width: 40,
//     height: 40,
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//   },

//   // Floating Info Card
//   infoCardWrapper: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     padding: SPACING.lg,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20,
//   },
//   infoCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.xl,
//     padding: SPACING.xl,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -10 },
//         shadowOpacity: 0.1,
//         shadowRadius: 20,
//       },
//       android: { elevation: 15 },
//     }),
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingBottom: SPACING.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.divider,
//   },
//   statBox: { flexDirection: 'row', gap: 10, alignItems: 'center' },
//   statLabel: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     fontFamily: FONTS.regular,
//   },
//   statValue: {
//     fontSize: 15,
//     color: COLORS.textPrimary,
//     fontFamily: FONTS.bold,
//   },
//   statDivider: { width: 1, height: '100%', backgroundColor: COLORS.divider },

//   addressSection: { marginVertical: SPACING.lg, gap: 4 },
//   addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   addressIconCol: { width: 20, alignItems: 'center' },
//   tinyDot: { width: 8, height: 8, borderRadius: 4 },
//   verticalLine: {
//     width: 2,
//     height: 20,
//     backgroundColor: COLORS.divider,
//     marginVertical: 2,
//   },
//   addressTextCol: { flex: 1 },
//   addressText: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     fontFamily: FONTS.medium,
//   },

//   trackBtn: {
//     backgroundColor: COLORS.goldPrimary,
//     height: 54,
//     borderRadius: RADIUS.md,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   trackBtnText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
// });

// export default memo(MapModal);

import React, { memo, useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'; // 1. Import this
import {
  X,
  Navigation,
  Clock,
  Layers,
  LocateFixed,
  MapPin,
  Package,
  Flag,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';
import { GOOGLE_MAPS_APIKEY } from '../../config/constants';

const { width, height } = Dimensions.get('window');

// 2. Add your Google API Key here

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  shipmentData?: {
    pickupLocation: string;
    deliveryLocation: string;
    status: string;
    estimatedTime?: string;
  };
  distance?: string;
  pickupCoords?: { latitude: number; longitude: number };
  deliveryCoords?: { latitude: number; longitude: number };
}

const MapModal = ({
  visible,
  onClose,
  shipmentData,
  distance: initialDistance = 'Calculating...',
  pickupCoords,
  deliveryCoords,
}: MapModalProps) => {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>(
    'standard',
  );
  const [loading, setLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState({
    distance: initialDistance,
    duration: shipmentData?.estimatedTime || '--',
  });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const pickup = pickupCoords || { latitude: 41.1544, longitude: -8.6498 };
  const delivery = deliveryCoords || { latitude: 41.671, longitude: -72.949 };

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const toggleMapType = () => {
    setMapType(prev => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  const centerMap = () => {
    mapRef.current?.fitToCoordinates([pickup, delivery], {
      edgePadding: { top: 100, right: 100, bottom: 350, left: 100 },
      animated: true,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType={mapType}
          showsUserLocation
          showsCompass={false}
        >
          {/* 3. ROAD FOLLOWING DIRECTIONS */}
          <MapViewDirections
            origin={pickup}
            destination={delivery}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor={COLORS.info} // Professional Blue Route Line
            optimizeWaypoints={true}
            onStart={() => setLoading(true)}
            onReady={result => {
              setRouteInfo({
                distance: `${result.distance.toFixed(1)} km`,
                duration: `${Math.floor(result.duration)} mins`,
              });

              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
                animated: true,
              });
              setLoading(false);
            }}
            onError={errorMessage => {
              console.log('Directions Error: ', errorMessage);
              setLoading(false);
            }}
          />

          {/* Pickup Custom Marker */}
          <Marker
            coordinate={pickup}
            title="Pickup Location"
            description={shipmentData?.pickupLocation || 'Pickup Location'}
          >
            <View style={styles.markerWrapper}>
              <View style={[styles.markerBadge, { backgroundColor: COLORS.goldPrimary }]}>
                <Package size={12} color={COLORS.white} />
                <AppText style={styles.markerBadgeText}>Pickup</AppText>
              </View>
              <View style={[styles.markerPin, { backgroundColor: COLORS.goldPrimary }]}>
                <MapPin size={18} color={COLORS.white} strokeWidth={2.5} />
              </View>
              <View style={[styles.markerPointer, { borderTopColor: COLORS.goldPrimary }]} />
            </View>
          </Marker>

          {/* Delivery Custom Marker */}
          <Marker
            coordinate={delivery}
            title="Delivery Location"
            description={shipmentData?.deliveryLocation || 'Delivery Location'}
          >
            <View style={styles.markerWrapper}>
              <View style={[styles.markerBadge, { backgroundColor: COLORS.error }]}>
                <Flag size={12} color={COLORS.white} />
                <AppText style={styles.markerBadgeText}>Delivery</AppText>
              </View>
              <View style={[styles.markerPin, { backgroundColor: COLORS.error }]}>
                <MapPin size={18} color={COLORS.white} strokeWidth={2.5} />
              </View>
              <View style={[styles.markerPointer, { borderTopColor: COLORS.error }]} />
            </View>
          </Marker>
        </MapView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
            <AppText style={styles.loadingText}>
              Fetching best road route...
            </AppText>
          </View>
        )}

        {/* CONTROLS */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <X size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.statusPill}>
            <View style={styles.liveDot} />
            <AppText style={styles.statusPillText}>
              {shipmentData?.status?.replace('_', ' ').toUpperCase() ||
                'IN TRANSIT'}
            </AppText>
          </View>
        </View>

        <View style={styles.sideControls}>
          <TouchableOpacity style={styles.sideBtn} onPress={toggleMapType}>
            <Layers size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn} onPress={centerMap}>
            <LocateFixed size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* INFO CARD */}
        <View style={styles.infoCardWrapper}>
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.statBox}>
                <Navigation size={18} color={COLORS.goldPrimary} />
                <View>
                  <AppText style={styles.statLabel}>Road Distance</AppText>
                  <AppText style={styles.statValue}>
                    {routeInfo.distance}
                  </AppText>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Clock size={18} color={COLORS.goldPrimary} />
                <View>
                  <AppText style={styles.statLabel}>Est. Travel</AppText>
                  <AppText style={styles.statValue}>
                    {routeInfo.duration}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.addressSection}>
              <View style={styles.addressRow}>
                <View style={styles.addressIconCol}>
                  <View
                    style={[
                      styles.tinyDot,
                      { backgroundColor: COLORS.goldPrimary },
                    ]}
                  />
                  <View style={styles.verticalLine} />
                </View>
                <View style={styles.addressTextCol}>
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {shipmentData?.pickupLocation || 'Not Available'}
                  </AppText>
                </View>
              </View>

              <View style={styles.addressRow}>
                <View style={styles.addressIconCol}>
                  <MapPin size={14} color={COLORS.error} />
                </View>
                <View style={styles.addressTextCol}>
                  <AppText numberOfLines={1} style={styles.addressText}>
                    {shipmentData?.deliveryLocation || 'Not Available'}
                  </AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.trackBtn} activeOpacity={0.9}>
              <AppText style={styles.trackBtnText}>Close</AppText>
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
    fontSize: 10,
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
  statusPillText: { color: COLORS.white, fontSize: 12, fontFamily: FONTS.bold },
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
  statBox: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  statValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  statDivider: { width: 1, height: '100%', backgroundColor: COLORS.divider },
  addressSection: { marginVertical: SPACING.lg, gap: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addressIconCol: { width: 20, alignItems: 'center' },
  tinyDot: { width: 8, height: 8, borderRadius: 4 },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.divider,
    marginVertical: 2,
  },
  addressTextCol: { flex: 1 },
  addressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  trackBtn: {
    backgroundColor: COLORS.goldPrimary,
    height: 54,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackBtnText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});

export default memo(MapModal);
