import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  Truck,
  FileText,
  Search,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Repeat,
  ArrowLeftRight,
} from 'lucide-react-native';
import moment from 'moment';
import { AppHeader, AppText } from '../../../../components';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import { useSelector } from 'react-redux';
import { useCurrentLocation } from '../../../../hooks/useCurrentLocation';
import styles from './styles.shipperhome';

const { width } = Dimensions.get('window');

const ShipperHomeScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: any) => state.auth || {});
  const { getCurrentPosition, requestPermission } = useCurrentLocation();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(''); // 'pickup' | 'dropoff'
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Map view selection state
  const [selectedMapShipment, setSelectedMapShipment] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);

  const fetchShipments = async () => {
    try {
      let params: any = { page: 1, limit: 10 };

      // 1. Check user coords from redux user object
      let lat =
        user?.location?.lat ||
        user?.location?.latitude ||
        user?.lat ||
        user?.coords?.latitude;
      let lng =
        user?.location?.lng ||
        user?.location?.longitude ||
        user?.lng ||
        user?.coords?.longitude;

      // 2. Fallback to device location
      if (!lat || !lng) {
        try {
          const hasPerm = await requestPermission();
          if (hasPerm) {
            const pos = await getCurrentPosition();
            if (pos?.latitude && pos?.longitude) {
              lat = pos.latitude;
              lng = pos.longitude;
            }
          }
        } catch (e) {
          // ignore location error fallback
        }
      }

      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }

      const res = await shipperService.getAvailableShipments(params);
      if (res?.success || res?.shipments) {
        const list = res.shipments || [];
        setShipments(list);
        if (list.length > 0 && !selectedMapShipment) {
          setSelectedMapShipment(list[0]);
        }
      }
    } catch (error: any) {
      console.error('Fetch Available Shipments Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShipments();
  };

  const userName = user?.name || user?.firstName || 'Marcus';

  // Filter shipments
  const filteredShipments = shipments.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const pickup = (item.pickupLocation || '').toLowerCase();
    const delivery = (item.deliveryLocation || '').toLowerCase();
    const code = (item.shipmentCode || '').toLowerCase();
    return pickup.includes(q) || delivery.includes(q) || code.includes(q);
  });

  const handleSelectMapShipment = (item: any) => {
    setSelectedMapShipment(item);
    if (item.pickupCoords && item.deliveryCoords && mapRef.current) {
      const coords = [
        {
          latitude:
            item.pickupCoords.lat || item.pickupCoords.latitude || 22.96,
          longitude:
            item.pickupCoords.lng || item.pickupCoords.longitude || 76.05,
        },
        {
          latitude:
            item.deliveryCoords.lat || item.deliveryCoords.latitude || 23.83,
          longitude:
            item.deliveryCoords.lng || item.deliveryCoords.longitude || 78.73,
        },
      ];
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const getRegionForShipment = (item: any) => {
    if (!item?.pickupCoords) {
      return {
        latitude: 22.745,
        longitude: 75.892,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      };
    }
    const pLat = item.pickupCoords.lat || item.pickupCoords.latitude || 22.745;
    const pLng = item.pickupCoords.lng || item.pickupCoords.longitude || 75.892;
    const dLat =
      item.deliveryCoords?.lat || item.deliveryCoords?.latitude || pLat + 0.5;
    const dLng =
      item.deliveryCoords?.lng || item.deliveryCoords?.longitude || pLng + 0.5;

    const midLat = (pLat + dLat) / 2;
    const midLng = (pLng + dLng) / 2;
    const latDelta = Math.abs(pLat - dLat) * 1.6 || 0.5;
    const lngDelta = Math.abs(pLng - dLng) * 1.6 || 0.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(latDelta, 0.1),
      longitudeDelta: Math.max(lngDelta, 0.1),
    };
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Welcome Greeting Header */}
        <View style={styles.welcomeHeader}>
          <AppText style={styles.welcomeTitle}>Hello {userName},</AppText>
          <AppText style={styles.welcomeSub}>Good to see you again!</AppText>
        </View>

        {/* Stats Row Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statTextCol}>
              <AppText style={styles.statTitle}>Upcoming Shipments</AppText>
              <AppText style={styles.statCount}>03</AppText>
            </View>
            <View style={styles.statIconBox}>
              <Truck size={24} color="#A06333" />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTextCol}>
              <AppText style={styles.statTitle}>Submitted Quotes</AppText>
              <AppText style={styles.statCount}>03</AppText>
            </View>
            <View style={styles.statIconBox}>
              <FileText size={24} color="#A06333" />
            </View>
          </View>
        </View>

        {/* New Opportunities Section */}
        <View style={styles.opportunitiesCard}>
          <View style={styles.sectionHeaderRow}>
            <AppText style={styles.sectionTitle}>New Opportunities</AppText>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('MyQuotes')}
            >
              <AppText style={styles.viewAllText}>View All</AppText>
              <ChevronRight size={16} color="#A06333" />
            </TouchableOpacity>
          </View>
          <AppText style={styles.sectionSub}>
            Browse available horse shipments & bid now
          </AppText>

          {/* Search Input Bar */}
          <View style={styles.searchBarContainer}>
            <Search
              size={18}
              color={COLORS.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by pickup or delivery location..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter By Row */}
          <View style={styles.filterRow}>
            <AppText style={styles.filterLabel}>Filter By :</AppText>
            <View style={styles.filterPillsGroup}>
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedFilter === 'pickup' && styles.filterPillActive,
                ]}
                onPress={() =>
                  setSelectedFilter(selectedFilter === 'pickup' ? '' : 'pickup')
                }
              >
                <AppText
                  style={[
                    styles.filterPillText,
                    selectedFilter === 'pickup' && styles.filterPillTextActive,
                  ]}
                >
                  Pickup Distance
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedFilter === 'dropoff' && styles.filterPillActive,
                ]}
                onPress={() =>
                  setSelectedFilter(
                    selectedFilter === 'dropoff' ? '' : 'dropoff',
                  )
                }
              >
                <AppText
                  style={[
                    styles.filterPillText,
                    selectedFilter === 'dropoff' && styles.filterPillTextActive,
                  ]}
                >
                  Dropoff Distance
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterIconBtn}>
                <SlidersHorizontal size={18} color={COLORS.goldDarkText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* View Toggle Row (List View vs View Map) */}
          <View style={styles.viewToggleRow}>
            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'list'
                  ? styles.viewToggleBtnActive
                  : styles.viewToggleBtnInactive,
              ]}
              onPress={() => setViewMode('list')}
            >
              <List
                size={16}
                color={viewMode === 'list' ? COLORS.white : '#A06333'}
              />
              <AppText
                style={[
                  styles.viewToggleBtnText,
                  viewMode === 'list' && styles.viewToggleBtnTextActive,
                ]}
              >
                List View
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.viewToggleBtn,
                viewMode === 'map'
                  ? styles.viewToggleBtnActive
                  : styles.viewToggleBtnInactive,
              ]}
              onPress={() => {
                setViewMode('map');
                if (filteredShipments.length > 0 && !selectedMapShipment) {
                  setSelectedMapShipment(filteredShipments[0]);
                }
              }}
            >
              <MapIcon
                size={16}
                color={viewMode === 'map' ? COLORS.white : '#A06333'}
              />
              <AppText
                style={[
                  styles.viewToggleBtnText,
                  viewMode === 'map' && styles.viewToggleBtnTextActive,
                ]}
              >
                View Map
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* MODE 1: LIST VIEW MODE */}
        {viewMode === 'list' ? (
          <View style={styles.currentShipmentsSection}>
            <View style={styles.sectionHeaderRow}>
              <AppText style={styles.sectionTitle}>Current Shipments</AppText>
              <TouchableOpacity style={styles.viewAllBtn}>
                <AppText style={styles.viewAllText}>View All</AppText>
                <ChevronRight size={16} color="#A06333" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.goldPrimary} />
              </View>
            ) : filteredShipments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Truck size={44} color={COLORS.textLight} />
                <AppText style={styles.emptyTitle}>No Active Shipments</AppText>
                <AppText style={styles.emptySub}>
                  Available shipments for bidding will appear here.
                </AppText>
              </View>
            ) : (
              filteredShipments.map((item, index) => {
                const horsePhoto =
                  item.horses && item.horses[0]?.photo?.url
                    ? item.horses[0].photo.url
                    : null;
                const horseName =
                  item.horses && item.horses[0]?.registeredName
                    ? item.horses[0].registeredName
                    : 'Thunder - Sky';
                const horseSpecs =
                  item.horses && item.horses[0]
                    ? `${item.horses[0].breed || 'Belgian Warmblood'} | ${
                        item.horses[0].age || '2'
                      }yr | ${item.horses[0].colour || 'Blood bay'}`
                    : 'Belgian Warmblood | 2yr | Blood bay';

                const locationText = item.pickupLocation
                  ? item.pickupLocation.split(',')[0] +
                    ', ' +
                    (item.pickupLocation.split(',')[1] || '')
                  : 'Ghbaleh, Lebanon';

                return (
                  <View key={item._id || index} style={styles.shipmentCard}>
                    {/* Left Horse Image */}
                    <View style={styles.cardImageContainer}>
                      {horsePhoto ? (
                        <Image
                          source={{ uri: horsePhoto }}
                          style={styles.cardImage}
                        />
                      ) : (
                        <Image
                          source={imageIndex.Banner}
                          style={styles.cardImage}
                        />
                      )}
                    </View>

                    {/* Center Info Col */}
                    <View style={styles.cardInfoCol}>
                      <AppText style={styles.horseTitle}>{horseName}</AppText>
                      <AppText style={styles.horseSpecs}>{horseSpecs}</AppText>
                      <AppText style={styles.shipmentCode}>
                        {item.shipmentCode || 'HS-SHIP-2026-3B7C23'}
                      </AppText>

                      <View style={styles.infoMetaRow}>
                        <MapPin size={14} color={COLORS.textSecondary} />
                        <AppText style={styles.infoMetaText} numberOfLines={1}>
                          {locationText}
                        </AppText>
                      </View>

                      <View style={styles.infoMetaRow}>
                        <Calendar size={14} color={COLORS.textSecondary} />
                        <AppText style={styles.infoMetaText}>
                          {item.pickupDateRange?.start
                            ? `Pickup ${moment(
                                item.pickupDateRange.start,
                              ).format('MMM DD')}`
                            : 'Pickup Jul 23-31'}
                        </AppText>
                      </View>
                    </View>

                    {/* Right Action & Timeline Col */}
                    <View style={styles.cardRightCol}>
                      <TouchableOpacity
                        style={styles.externalActionBtn}
                        onPress={() =>
                          Alert.alert(
                            'Shipment Details',
                            `Shipment Code: ${item.shipmentCode}`,
                          )
                        }
                      >
                        <ExternalLink size={14} color={COLORS.white} />
                      </TouchableOpacity>

                      <View style={styles.timelineCol}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineDashedLine} />
                        <View style={styles.timelineTruckNode}>
                          <Truck size={12} color="#059669" />
                        </View>
                        <View style={styles.timelineDashedLine} />
                        <View style={styles.timelineDot} />
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          /* MODE 2: MAP VIEW MODE (MATCHING SCREENSHOT) */
          <View style={styles.mapModeContainer}>
            {/* Shipments List Selection Card */}
            <View style={styles.mapShipmentsListCard}>
              <View style={styles.sectionHeaderRow}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <List size={18} color="#A06333" />
                  <AppText style={styles.mapSectionTitle}>
                    Shipments ({filteredShipments.length})
                  </AppText>
                </View>

                <TouchableOpacity style={styles.viewAllBtn}>
                  <AppText style={styles.viewAllText}>View All</AppText>
                  <ChevronRight size={16} color="#A06333" />
                </TouchableOpacity>
              </View>

              <AppText style={styles.mapSectionSub}>
                Select a shipment to view route on map
              </AppText>

              {/* Selection Items Table */}
              <View style={styles.mapSelectionTable}>
                {filteredShipments.map((item, index) => {
                  const isSelected = selectedMapShipment?._id === item._id;
                  const isLast = index === filteredShipments.length - 1;

                  const pickupTitle = item.pickupLocation
                    ? item.pickupLocation.split(',')[0] +
                      ', ' +
                      (item.pickupLocation.split(',')[1] || '')
                    : 'Ghbaleh, Lebanon';

                  const deliveryTitle = item.deliveryLocation
                    ? item.deliveryLocation.split(',')[0] +
                      ', ' +
                      (item.deliveryLocation.split(',')[1] || '')
                    : 'Myanmar';

                  return (
                    <TouchableOpacity
                      key={item._id || index}
                      style={[
                        styles.mapSelectItemRow,
                        isSelected && styles.mapSelectItemRowActive,
                        isLast && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => handleSelectMapShipment(item)}
                      activeOpacity={0.7}
                    >
                      {/* Left Map Pin Icon Circle */}
                      <View style={styles.mapPinCircle}>
                        <MapPin size={18} color="#A06333" />
                      </View>

                      {/* Center Info Col */}
                      <View style={styles.mapSelectTextCol}>
                        <AppText
                          style={styles.mapSelectLocationTitle}
                          numberOfLines={1}
                        >
                          {pickupTitle}
                        </AppText>
                        <AppText style={styles.mapSelectShipmentCode}>
                          {item.shipmentCode || 'HS-SHIP-2026-CODE'}
                        </AppText>
                        <AppText
                          style={styles.mapSelectDeliverySub}
                          numberOfLines={1}
                        >
                          ➜ {deliveryTitle}
                        </AppText>
                      </View>

                      {/* Right Action Swap / Arrow Circle Buttons */}
                      <View style={styles.mapSelectActionsCol}>
                        <TouchableOpacity
                          style={styles.swapIconCircle}
                          onPress={() => handleSelectMapShipment(item)}
                        >
                          <ArrowLeftRight size={14} color={COLORS.white} />
                        </TouchableOpacity>

                        <View style={styles.arrowIconCircle}>
                          <ArrowRight size={14} color={COLORS.textPrimary} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Shipment Route Map Card */}
            <View style={styles.routeMapCard}>
              <AppText style={styles.routeMapTitle}>Shipment Route Map</AppText>
              <AppText style={styles.routeMapShipmentCode}>
                {selectedMapShipment?.shipmentCode || 'HS-SHIP-2026-3B7C23'}
              </AppText>

              {/* Map Preview Container */}
              <View style={styles.mapWrapper}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.mapView}
                  initialRegion={getRegionForShipment(selectedMapShipment)}
                >
                  {selectedMapShipment?.pickupCoords && (
                    <Marker
                      coordinate={{
                        latitude:
                          selectedMapShipment.pickupCoords.lat ||
                          selectedMapShipment.pickupCoords.latitude ||
                          22.745,
                        longitude:
                          selectedMapShipment.pickupCoords.lng ||
                          selectedMapShipment.pickupCoords.longitude ||
                          75.892,
                      }}
                      title="Pickup"
                      description={selectedMapShipment.pickupLocation}
                    >
                      <View style={styles.markerCircleGreen}>
                        <MapPin size={14} color={COLORS.white} />
                      </View>
                    </Marker>
                  )}

                  {selectedMapShipment?.deliveryCoords && (
                    <Marker
                      coordinate={{
                        latitude:
                          selectedMapShipment.deliveryCoords.lat ||
                          selectedMapShipment.deliveryCoords.latitude ||
                          23.838,
                        longitude:
                          selectedMapShipment.deliveryCoords.lng ||
                          selectedMapShipment.deliveryCoords.longitude ||
                          78.737,
                      }}
                      title="Delivery"
                      description={selectedMapShipment.deliveryLocation}
                    >
                      <View style={styles.markerCircleRed}>
                        <MapPin size={14} color={COLORS.white} />
                      </View>
                    </Marker>
                  )}

                  {selectedMapShipment?.pickupCoords &&
                    selectedMapShipment?.deliveryCoords && (
                      <Polyline
                        coordinates={[
                          {
                            latitude:
                              selectedMapShipment.pickupCoords.lat ||
                              selectedMapShipment.pickupCoords.latitude ||
                              22.745,
                            longitude:
                              selectedMapShipment.pickupCoords.lng ||
                              selectedMapShipment.pickupCoords.longitude ||
                              75.892,
                          },
                          {
                            latitude:
                              selectedMapShipment.deliveryCoords.lat ||
                              selectedMapShipment.deliveryCoords.latitude ||
                              23.838,
                            longitude:
                              selectedMapShipment.deliveryCoords.lng ||
                              selectedMapShipment.deliveryCoords.longitude ||
                              78.737,
                          },
                        ]}
                        strokeColor="#2563EB"
                        strokeWidth={4}
                      />
                    )}
                </MapView>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeMapBtn}
                onPress={() => setViewMode('list')}
              >
                <AppText style={styles.closeMapBtnText}>Close</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShipperHomeScreen;
