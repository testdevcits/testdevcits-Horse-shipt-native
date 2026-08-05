import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  FlatList,
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
  ArrowLeftRight,
} from 'lucide-react-native';
import {
  AppHeader,
  AppText,
  AppLoader,
  EmptyState,
  Input,
  SectionHeader,
} from '../../../../components';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  FONT_SIZE,
} from '../../../../constants';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import { useCurrentLocation } from '../../../../hooks/useCurrentLocation';
import AvailableShipmentCard from './AvailableShipmentCard';
import MapShipmentSelectItem from './MapShipmentSelectItem';
import ConnectBankModal from './ConnectBankModal';
import styles from './styles.shipperhome';

const { width } = Dimensions.get('window');

const ShipperHomeScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth || {});
  const { getCurrentPosition, requestPermission } = useCurrentLocation();
  const [shipments, setShipments] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(''); // 'pickup' | 'dropoff'
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  // Map view selection state
  const [selectedMapShipment, setSelectedMapShipment] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await shipperService.getMyQuotes();
      if (res?.success || res?.quotes) {
        setQuotes(res.quotes || []);
      }
    } catch (error: any) {
      console.error('Fetch Quotes Error:', error);
    }
  };

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

  const fetchAllData = async () => {
    await Promise.all([fetchShipments(), fetchQuotes()]);
  };

  const checkStripeStatus = async () => {
    try {
      const res = await shipperService.getStripeStatus();
      if (res && res.success) {
        const needsModal =
          res.needsVerification === true ||
          res.onboardingCompleted === false ||
          res.chargesEnabled === false ||
          res.payoutsEnabled === false ||
          res.verified === false;
        setIsBankModalVisible(needsModal);
      }
    } catch (err) {
      console.log('Stripe status check error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    checkStripeStatus();
    shipperService
      .getProfile()
      .then(res => {
        if (res?.data?.profileImage) {
          dispatch(updateUser({ profileImage: res.data?.profileImage }));
        }
      })
      .catch(() => null);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const userName = user?.name || user?.firstName || 'Not available';

  // Dynamic stats calculation
  const submittedQuotesCount = quotes.length;
  const upcomingShipmentsCount = quotes.filter(q => {
    const s = (q.shipment?.status || '').toLowerCase();
    return (
      s === 'accepted' ||
      s === 'assigned' ||
      s === 'in_transit' ||
      s === 'on_the_way' ||
      s === 'open' ||
      s === 'published' ||
      s === 'upcoming' ||
      s === 'pending' ||
      s === 'open_for_offers'
    );
  }).length;

  const formatCount = (count: number) => {
    return String(count).padStart(2, '0');
  };

  // Filter shipments
  const filteredShipments = shipments.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const pickup = (item?.pickupLocation || '').toLowerCase();
    const delivery = (item?.deliveryLocation || '').toLowerCase();
    const code = (item?.shipmentCode || '').toLowerCase();
    return pickup.includes(q) || delivery.includes(q) || code.includes(q);
  });

  const handleSelectMapShipment = (item: any) => {
    setSelectedMapShipment(item);
    if (item?.pickupCoords && item?.deliveryCoords && mapRef.current) {
      const coords = [
        {
          latitude:
            item?.pickupCoords?.lat || item?.pickupCoords?.latitude || 22.96,
          longitude:
            item?.pickupCoords?.lng || item?.pickupCoords?.longitude || 76.05,
        },
        {
          latitude:
            item?.deliveryCoords?.lat ||
            item?.deliveryCoords?.latitude ||
            23.83,
          longitude:
            item?.deliveryCoords?.lng ||
            item?.deliveryCoords?.longitude ||
            78.73,
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
    const pLat =
      item?.pickupCoords?.lat || item?.pickupCoords?.latitude || 22.745;
    const pLng =
      item?.pickupCoords?.lng || item?.pickupCoords?.longitude || 75.892;
    const dLat =
      item?.deliveryCoords?.lat || item?.deliveryCoords?.latitude || pLat + 0.5;
    const dLng =
      item?.deliveryCoords?.lng ||
      item?.deliveryCoords?.longitude ||
      pLng + 0.5;

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

  const handleNavigateToDetails = (item: any) => {
    navigation.navigate('ShipperShipmentDetails', { shipment: item });
  };

  const renderHeader = () => (
    <View style={{ width: '100%' }}>
      {/* Welcome Greeting Header */}
      <View style={styles.welcomeHeader}>
        <AppText style={styles.welcomeTitle}>Hello {userName},</AppText>
        <AppText style={styles.welcomeSub}>Good to see you again!</AppText>
      </View>

      {/* Stats Row Cards */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MyQuotes')}
        >
          <View style={styles.statTextCol}>
            <AppText style={styles.statTitle}>Upcoming Shipments</AppText>
            <AppText style={styles.statCount}>
              {formatCount(upcomingShipmentsCount)}
            </AppText>
          </View>
          <View style={styles.statIconBox}>
            <Truck size={24} color="#A06333" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MyQuotes')}
        >
          <View style={styles.statTextCol}>
            <AppText style={styles.statTitle}>Submitted Quotes</AppText>
            <AppText style={styles.statCount}>
              {formatCount(submittedQuotesCount)}
            </AppText>
          </View>
          <View style={styles.statIconBox}>
            <FileText size={24} color="#A06333" />
          </View>
        </TouchableOpacity>
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
        <Input
          placeholder="Search by pickup or delivery location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={COLORS.textSecondary} />}
          containerStyle={{ marginBottom: SPACING.md }}
        />

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
                setSelectedFilter(selectedFilter === 'dropoff' ? '' : 'dropoff')
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

            {/* <TouchableOpacity style={styles.filterIconBtn}>
              <SlidersHorizontal size={18} color={COLORS.goldDarkText} />
            </TouchableOpacity> */}
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

      {/* Current Shipments Section Title */}
      {viewMode === 'list' && (
        <View style={{ marginTop: SPACING.sm, marginBottom: SPACING.xs }}>
          <SectionHeader
            title="Current Shipment"
            showAction={true}
            onPress={() => navigation.navigate('Post')}
            containerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
          />
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        icon={Truck}
        title="No Active Shipments"
        message="Available shipments for bidding will appear here."
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="" />
      <AppLoader visible={loading && !refreshing} />

      {viewMode === 'list' ? (
        <FlatList
          data={filteredShipments}
          keyExtractor={(item, index) => item?._id || item?.id || String(index)}
          renderItem={({ item }) => (
            <AvailableShipmentCard
              item={item}
              onPress={handleNavigateToDetails}
            />
          )}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={renderEmpty()}
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      ) : (
        /* MODE 2: MAP VIEW MODE */
        <ScrollView
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {renderHeader()}

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

              {/* Selection Items Table using FlatList */}
              <View style={styles.mapSelectionTable}>
                <FlatList
                  data={filteredShipments}
                  keyExtractor={(item, index) =>
                    item?._id || item?.id || String(index)
                  }
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                    <MapShipmentSelectItem
                      item={item}
                      isSelected={selectedMapShipment?._id === item?._id}
                      isLast={index === filteredShipments.length - 1}
                      onSelect={handleSelectMapShipment}
                      onNavigateDetails={handleNavigateToDetails}
                    />
                  )}
                />
              </View>
            </View>

            {/* Shipment Route Map Card */}

            {filteredShipments.length > 0 && (
              <View style={styles.routeMapCard}>
                <AppText style={styles.routeMapTitle}>
                  Shipment Route Map
                </AppText>
                <AppText style={styles.routeMapShipmentCode}>
                  {selectedMapShipment?.shipmentCode}
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
                            selectedMapShipment?.pickupCoords?.lat ||
                            selectedMapShipment?.pickupCoords?.latitude ||
                            22.745,
                          longitude:
                            selectedMapShipment?.pickupCoords?.lng ||
                            selectedMapShipment?.pickupCoords?.longitude ||
                            75.892,
                        }}
                        title="Pickup"
                        description={selectedMapShipment?.pickupLocation}
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
                            selectedMapShipment?.deliveryCoords?.lat ||
                            selectedMapShipment?.deliveryCoords?.latitude ||
                            23.838,
                          longitude:
                            selectedMapShipment?.deliveryCoords?.lng ||
                            selectedMapShipment?.deliveryCoords?.longitude ||
                            78.737,
                        }}
                        title="Delivery"
                        description={selectedMapShipment?.deliveryLocation}
                      >
                        <View style={styles.markerCircleRed}>
                          <MapPin size={14} color={COLORS.white} />
                        </View>
                      </Marker>
                    )}

                    {selectedMapShipment?.pickupCoords &&
                      selectedMapShipment?.deliveryCoords && (
                        <>
                          <MapViewDirections
                            origin={{
                              latitude:
                                selectedMapShipment?.pickupCoords?.lat ||
                                selectedMapShipment?.pickupCoords?.latitude ||
                                22.745,
                              longitude:
                                selectedMapShipment?.pickupCoords?.lng ||
                                selectedMapShipment?.pickupCoords?.longitude ||
                                75.892,
                            }}
                            destination={{
                              latitude:
                                selectedMapShipment?.deliveryCoords?.lat ||
                                selectedMapShipment?.deliveryCoords?.latitude ||
                                23.838,
                              longitude:
                                selectedMapShipment?.deliveryCoords?.lng ||
                                selectedMapShipment?.deliveryCoords
                                  ?.longitude ||
                                78.737,
                            }}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={4}
                            strokeColor={
                              COLORS.brandBrown || COLORS.primary || '#A06333'
                            }
                            lineDashPattern={[0]}
                            onError={err =>
                              console.log('MapViewDirections Error:', err)
                            }
                          />
                          <Polyline
                            coordinates={[
                              {
                                latitude:
                                  selectedMapShipment?.pickupCoords?.lat ||
                                  selectedMapShipment?.pickupCoords?.latitude ||
                                  22.745,
                                longitude:
                                  selectedMapShipment?.pickupCoords?.lng ||
                                  selectedMapShipment?.pickupCoords
                                    ?.longitude ||
                                  75.892,
                              },
                              {
                                latitude:
                                  selectedMapShipment?.deliveryCoords?.lat ||
                                  selectedMapShipment?.deliveryCoords
                                    ?.latitude ||
                                  23.838,
                                longitude:
                                  selectedMapShipment?.deliveryCoords?.lng ||
                                  selectedMapShipment?.deliveryCoords
                                    ?.longitude ||
                                  78.737,
                              },
                            ]}
                            strokeColor={COLORS.primary || '#A37F3D'}
                            strokeWidth={3}
                            lineDashPattern={[6, 6]}
                          />
                        </>
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
            )}
          </View>
        </ScrollView>
      )}

      <ConnectBankModal
        isVisible={isBankModalVisible}
        onClose={() => setIsBankModalVisible(false)}
      />
    </View>
  );
};

export default ShipperHomeScreen;
