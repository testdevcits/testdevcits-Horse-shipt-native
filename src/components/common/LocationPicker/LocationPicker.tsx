import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
  Modal,
  Keyboard,
  Platform,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import axios from 'axios';
import { Map as MapIcon } from 'lucide-react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { GOOGLE_MAPS_APIKEY } from '../../../config/constants';
import { COLORS, SPACING, ICON_SIZE } from '../../../constants';
import AppText from '../AppText';
import { Button } from '../..';
import AppIcon from '../../AppIcon';
import styles from './styles.locationpicker';

/**
 * TYPES
 */
export interface LocationSelectResult {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value?: string;
  placeholder?: string;
  onSelect: (location: LocationSelectResult) => void;
}

interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

/**
 * MAIN COMPONENT (THE TRIGGER)
 */
const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  placeholder,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconCircle}>
          <AppIcon name={'MapPin'} size={ICON_SIZE.sm} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText
            style={[styles.triggerText, !value && styles.placeholder]}
            numberOfLines={1}
          >
            {value || placeholder || 'Select Location'}
          </AppText>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <LocationPickerCore
          onClose={() => setModalVisible(false)}
          onConfirm={res => {
            onSelect(res);
            setModalVisible(false);
          }}
        />
      </Modal>
    </View>
  );
};

/**
 * THE INTERACTIVE CORE MODAL
 */
const LocationPickerCore: React.FC<{
  onClose: () => void;
  onConfirm: (res: LocationSelectResult) => void;
}> = ({ onClose, onConfirm }) => {
  const mapRef = useRef<MapView>(null);
  const searchAbortController = useRef<AbortController | null>(null);

  // States
  const [region, setRegion] = useState<Region>({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [displayAddress, setDisplayAddress] = useState('Locating...');
  const [isReverseLoading, setIsReverseLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Animations
  const markerAnim = useRef(new Animated.Value(0)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.3)).current;

  // Google Session Token
  const sessionToken = useMemo(
    () => Math.random().toString(36).substring(2, 15),
    [],
  );

  useEffect(() => {
    handleGetCurrentLocation();
    return () => searchAbortController.current?.abort();
  }, []);

  /**
   * REVERSE GEOCODING (Coordinates -> Address)
   */
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseLoading(true);
    try {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_APIKEY}`,
      );
      if (resp.data?.results.length > 0) {
        setDisplayAddress(resp.data?.results[0].formatted_address);
      } else {
        setDisplayAddress('Unnamed Road');
      }
    } catch (e) {
      setDisplayAddress('Location services unavailable');
    } finally {
      setIsReverseLoading(false);
    }
  };

  /**
   * SEARCH PLACES (Text -> Suggestions)
   */
  const searchPlaces = async (text: string) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request if still flying
    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }
    searchAbortController.current = new AbortController();

    setIsSearchLoading(true);
    try {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: GOOGLE_MAPS_APIKEY,
            sessiontoken: sessionToken,
            types: 'geocode|establishment',
          },
          signal: searchAbortController.current.signal,
        },
      );
      setSuggestions(resp.data?.predictions);
    } catch (e: any) {
      if (e.name !== 'CanceledError') console.error('Search error', e);
    } finally {
      setIsSearchLoading(false);
    }
  };

  /**
   * GET DETAILS (Suggestion -> Coordinates)
   */
  const getPlaceDetails = async (placeId: string) => {
    Keyboard.dismiss();
    setIsSearchLoading(true);
    try {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_APIKEY,
            sessiontoken: sessionToken,
            fields: 'geometry,formatted_address',
          },
        },
      );
      const { lat, lng } = resp.data?.result.geometry.location;
      const addr = resp.data?.result.formatted_address;

      const newRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      mapRef.current?.animateToRegion(newRegion, 800);
      setDisplayAddress(addr);
      setRegion(newRegion);
      setIsSearchFocused(false);
      setSuggestions([]);
      setSearchQuery('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchLoading(false);
    }
  };

  /**
   * DEVICE GEOLOCATION
   */
  const handleGetCurrentLocation = async () => {
    let hasPermission = false;
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      hasPermission = status === RESULTS.GRANTED;
    }

    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const newRegion = {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          mapRef.current?.animateToRegion(newRegion, 1000);
          setRegion(newRegion);
          reverseGeocode(
            position?.coords?.latitude,
            position?.coords?.longitude,
          );
        },
        error => console.log('GPS Error', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  /**
   * PIN ANIMATIONS
   */
  const liftMarker = () => {
    Animated.parallel([
      Animated.spring(markerAnim, { toValue: -30, useNativeDriver: true }),
      Animated.timing(shadowScale, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const dropMarker = () => {
    Animated.parallel([
      Animated.spring(markerAnim, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(shadowScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="dark-content" />

      {/* MAP ENGINE */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.fullMap}
        initialRegion={region}
        onRegionChange={liftMarker}
        onRegionChangeComplete={onRegionChangeComplete => {
          dropMarker();
          setRegion(onRegionChangeComplete);
          reverseGeocode(
            onRegionChangeComplete.latitude,
            onRegionChangeComplete.longitude,
          );
        }}
        showsUserLocation
        showsMyLocationButton={false}
        onPanDrag={() => isSearchFocused && setIsSearchFocused(false)}
      />

      {/* CENTER PIN (UBER STYLE) */}
      {!isSearchFocused && (
        <View style={styles.markerFixed} pointerEvents="none">
          <Animated.View
            style={{
              transform: [{ translateY: markerAnim }],
              alignItems: 'center',
            }}
          >
            <View style={styles.pinBubble}>
              <AppText style={styles.pinBubbleText}>Set Point</AppText>
            </View>
            <AppIcon
              name={'MapPin'}
              size={42}
              color={COLORS.textPrimary}
              fill={COLORS.primary}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.markerShadow,
              { transform: [{ scale: shadowScale }], opacity: shadowOpacity },
            ]}
          />
        </View>
      )}

      {/* SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <View
          style={[styles.searchBox, isSearchFocused && styles.searchBoxActive]}
        >
          <TouchableOpacity
            onPress={
              isSearchFocused ? () => setIsSearchFocused(false) : onClose
            }
            style={styles.searchIconBtn}
          >
            {isSearchFocused ? (
              <AppIcon
                name={'ArrowLeft'}
                size={ICON_SIZE.md}
                color={COLORS.textPrimary}
              />
            ) : (
              <AppIcon
                name={'X'}
                size={ICON_SIZE.md}
                color={COLORS.textPrimary}
              />
            )}
          </TouchableOpacity>

          <TextInput
            allowFontScaling={false}
            style={styles.searchInput}
            placeholder="Search address, city or landmark..."
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              searchPlaces(text);
            }}
            onFocus={() => setIsSearchFocused(true)}
            placeholderTextColor={COLORS.textSecondary}
          />

          {isSearchLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginRight: SPACING.sm + 2 }}
            />
          ) : searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon
                name={'X'}
                size={ICON_SIZE.sm}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ) : (
            <AppIcon
              name={'Search'}
              size={ICON_SIZE.sm}
              color={COLORS.textSecondary}
            />
          )}
        </View>

        {/* RESULTS OVERLAY */}
        {isSearchFocused && (
          <View style={styles.resultsPanel}>
            <FlatList
              data={suggestions}
              keyExtractor={item => item?.place_id}
              keyboardShouldPersistTaps="always"
              ListEmptyComponent={
                !isSearchLoading && searchQuery.length > 2 ? (
                  <View style={styles.emptyState}>
                    <AppText style={styles.emptyText}>
                      No locations found
                    </AppText>
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => getPlaceDetails(item?.place_id)}
                >
                  <View style={styles.resultIcon}>
                    <MapIcon size={18} color={COLORS.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.resultMain} numberOfLines={1}>
                      {item?.structured_formatting.main_text}
                    </AppText>
                    <AppText style={styles.resultSub} numberOfLines={1}>
                      {item?.structured_formatting.secondary_text}
                    </AppText>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* CONTROLS */}
      {!isSearchFocused && (
        <>
          <TouchableOpacity
            style={styles.fabLocation}
            onPress={handleGetCurrentLocation}
          >
            <AppIcon
              name={'Navigation2'}
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.bottomSheet}>
            <View style={styles.addressContainer}>
              <View style={styles.addressIndicator}>
                <View style={styles.dotOuter}>
                  <View style={styles.dotInner} />
                </View>
                <View style={styles.line} />
              </View>

              <View style={{ flex: 1 }}>
                <AppText style={styles.label}>CONFIRM LOCATION</AppText>
                {isReverseLoading ? (
                  <View style={styles.skeletonLine} />
                ) : (
                  <AppText style={styles.addressText}>{displayAddress}</AppText>
                )}
              </View>
            </View>

            {/* <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm({
                address: displayAddress,
                latitude: region.latitude,
                longitude: region.longitude
              })}
            >
              <AppText style={styles.confirmButtonText}>Confirm and Continue</AppText>
            </TouchableOpacity> */}
            <Button
              title={'Confirm and Continue'}
              onPress={() =>
                onConfirm({
                  address: displayAddress,
                  latitude: region.latitude,
                  longitude: region.longitude,
                })
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

export default LocationPicker;
