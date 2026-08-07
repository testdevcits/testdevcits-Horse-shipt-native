import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import {
  ChevronLeft,
  Search,
  LocateFixed,
  Layers,
  MapPin, // Added for the list icons
  Navigation,
} from 'lucide-react-native';

// Constants
import { SPACING, RADIUS, COLORS, FONTS, FONT_SIZE } from '../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../config/constants';
import { AppText } from '../../../components';

const MapScreen = ({ navigation }: any) => {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Get Device Location on Mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getDeviceLocation();
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getDeviceLocation();
      }
    }
  };

  const getDeviceLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLoading(false);
        centerOnLocation(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const centerOnLocation = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      1000,
    );
  };

  const mapCustomStyle = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. MAP LAYER */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || 37.78825,
          longitude: currentLocation?.longitude || -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        customMapStyle={mapCustomStyle}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Custom User Location Marker (The Blue Dot) */}
        {currentLocation && (
          <Marker coordinate={currentLocation} flat anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.blueDotContainer}>
              <View style={styles.blueDotPulse} />
              <View style={styles.blueDotInner} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* 2. TOP SEARCH UI */}
      <View style={styles.searchContainer}>
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <ChevronLeft color={COLORS.grey900} size={24} />
          </TouchableOpacity>

          <GooglePlacesAutocomplete
            placeholder="Where to?"
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log('===data======data====', data);
              if (details) {
                centerOnLocation(
                  details.geometry.location.lat,
                  details.geometry.location.lng,
                );
              }
            }}
            query={{ key: GOOGLE_MAPS_APIKEY, language: 'en' }}
            enablePoweredByContainer={false}
            styles={autocompleteStyles}
            // CUSTOM SEARCH LIST WITH ICONS
            renderRow={data => (
              <Pressable
                onPress={() =>
                  navigation.popTo('PickupStep', {
                    selectedLocation: data?.structured_formatting,
                  })
                }
                style={styles.searchRow}
              >
                <View style={styles.searchIconCircle}>
                  <MapPin size={18} color={COLORS.grey500} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.searchRowTitle} numberOfLines={1}>
                    {data?.structured_formatting.main_text}
                  </AppText>
                  <AppText style={styles.searchRowSub} numberOfLines={1}>
                    {data?.structured_formatting.secondary_text}
                  </AppText>
                </View>
              </Pressable>
            )}
            renderLeftButton={() => (
              <View style={styles.leftSearchIcon}>
                <Search size={18} color={COLORS.grey400} />
              </View>
            )}
          />
        </View>
      </View>

      {/* 3. FLOATING TOOLS */}
      <View style={styles.mapTools}>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() =>
            setMapType(mapType === 'standard' ? 'satellite' : 'standard')
          }
        >
          <Layers size={20} color={COLORS.grey700} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, styles.primaryTool]}
          onPress={() =>
            centerOnLocation(
              currentLocation.latitude,
              currentLocation.longitude,
            )
          }
        >
          <LocateFixed size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const autocompleteStyles = {
  container: { flex: 1 },
  textInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    height: 52,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  textInput: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.grey900,
    backgroundColor: 'transparent',
    marginTop: 0,
  },
  listView: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },

  // Custom Blue Dot Marker
  blueDotContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueDotPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.4)',
  },
  blueDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 5,
  },

  // Search UI
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.lg,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 45 : 10,
  },
  backButton: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  leftSearchIcon: { paddingLeft: 15 },

  // Custom Search List Items
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.divider,
  },
  searchIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.grey50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchRowTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey900,
  },
  searchRowSub: {
    fontSize: FONT_SIZE.sm,

    fontFamily: FONTS.regular,
    color: COLORS.grey500,
    marginTop: 2,
  },

  // Tools
  mapTools: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 50,
    gap: SPACING.md,
  },
  toolBtn: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  primaryTool: { backgroundColor: COLORS.grey900 },
});

export default MapScreen;
