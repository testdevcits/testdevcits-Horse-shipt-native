import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Pressable,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import {
  AppHeader,
  AppText,
  EmptyState,

  ShipperHomeSkeleton,
} from '../../../../components';
import { COLORS, ICON_SIZE, SPACING } from '../../../../constants';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '../../../../config/constants';
import shipperService from '../../../../api/services/shipperService';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import { useCurrentLocation } from '../../../../hooks/useCurrentLocation';
import AvailableShipmentCard from './components/AvailableShipmentCard';
import MapShipmentSelectItem from './components/MapShipmentSelectItem';
import { HomeHeaderSection } from './components/HomeHeaderSection';
import styles from './styles.shipperhome';

import { useStripe } from '@stripe/stripe-react-native';
import useShipperSubscription from '../../../../hooks/useShipperSubscription';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { showSuccessToast } from '../../../../utils/toast';

const ConnectBankModal = lazy(() => import('./components/ConnectBankModal'));
const SubscriptionRequiredModal = lazy(
  () =>
    import(
      '../../components/subscription_required_modal/SubscriptionRequiredModal'
    ),
);
const StripePaymentMethodCardModal = lazy(
  () => import('../earnings/components/StripePaymentMethodCardModal'),
);

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

  const { confirmSetupIntent, createPaymentMethod } = useStripe();

  const {
    shipperStatus,
    subscriptionStatus,
    plansData,
    isModalVisible: isSubModalVisible,
    openModal: _openSubModal,
    closeModal: closeSubModal,
    checkAccessAndRun: _checkAccessAndRun,
    refreshStatus: refreshSubStatus,
  } = useShipperSubscription();

  // Payment Card Modal state
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);
  const [cardFormError, setCardFormError] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handleSavePaymentMethod = async () => {
    if (!cardDetails?.complete) {
      setCardFormError('Please enter valid and complete card details.');
      return;
    }
    setCardFormError('');
    try {
      setSubmittingCard(true);
      let paymentMethodId = '';
      const setupIntentRes = await shipperService
        .getSetupIntent()
        .catch(() => null);
      const clientSecret = setupIntentRes?.clientSecret;

      if (clientSecret && clientSecret.includes('_secret_')) {
        const { setupIntent, error: stripeError } = await confirmSetupIntent(
          clientSecret,
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: { name: cardholderName.trim() || undefined },
            },
          },
        );
        if (stripeError) {
          setSubmittingCard(false);
          setCardFormError(
            stripeError.message || 'Failed to confirm card setup.',
          );
          return;
        }
        paymentMethodId =
          typeof setupIntent?.paymentMethod === 'string'
            ? setupIntent.paymentMethod
            : (setupIntent?.paymentMethod as any)?.id || setupIntent?.id || '';
      }

      if (!paymentMethodId) {
        const { paymentMethod, error: stripeError } = await createPaymentMethod(
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: { name: cardholderName.trim() || undefined },
            },
          },
        );
        if (stripeError) {
          setSubmittingCard(false);
          setCardFormError(
            stripeError.message || 'Failed to process card details.',
          );
          return;
        }
        paymentMethodId = paymentMethod?.id || '';
      }

      if (paymentMethodId) {
        const saveRes = await shipperService.savePaymentMethod({
          paymentMethodId,
        });
        if (saveRes?.success) {
          setIsCardModalVisible(false);
          showSuccessToast('Card Saved', 'Payment method saved successfully.');
          refreshSubStatus();
        }
      }
    } catch (e: any) {
      console.error('Save Card Error:', e);
      setCardFormError(
        e?.response?.data?.message || 'Failed to save payment method.',
      );
    } finally {
      setSubmittingCard(false);
    }
  };

  // Map view selection state
  const [selectedMapShipment, setSelectedMapShipment] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await shipperService.getMyQuotes();
      if (res?.success || res?.quotes) {
        setQuotes(res?.quotes || []);
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
        } catch (_e) {
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
      if (!res || res.success === false) {
        // Account not created ({"success":false,"message":"Stripe account not created"})
        setIsBankModalVisible(true);
        return;
      }
      const needsModal =
        res.needsVerification === true ||
        res.onboardingCompleted === false ||
        res.chargesEnabled === false ||
        res.payoutsEnabled === false ||
        res.verified === false;
      setIsBankModalVisible(needsModal);
    } catch (err) {
      console.log('Stripe status check error:', err);
      setIsBankModalVisible(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
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
    <HomeHeaderSection
      user={user}
      shipperStatus={shipperStatus}
      subscriptionStatus={subscriptionStatus}
      quotesCount={quotes.length}
      availableLoadsCount={filteredShipments.length}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onOpenCardModal={() => setIsCardModalVisible(true)}
      onOpenBankModal={() => setIsBankModalVisible(true)}
      onOpenSubModal={_openSubModal}
      onNavigatePost={() => navigation.navigate('Post')}
      onSelectMapFirstShipment={() => {
        if (filteredShipments.length > 0 && !selectedMapShipment) {
          setSelectedMapShipment(filteredShipments[0]);
        }
      }}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        // icon={Truck}
        icon={
          <AppIcon
            name={'Truck'}
            size={ICON_SIZE.xl}
            color={COLORS.lightGrey}
            strokeWidth={1.5}
          />
        }
        title="No Active Shipments"
        message="Available shipments for bidding will appear here."
      />
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="" />
        <ShipperHomeSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="" />

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
                  <AppIcon name={'List'} size={18} color={COLORS.saddleBrown} />
                  <AppText style={styles.mapSectionTitle}>
                    Shipments ({filteredShipments.length})
                  </AppText>
                </View>

                <TouchableOpacity style={styles.viewAllBtn}>
                  <AppText style={styles.viewAllText}>View All</AppText>
                  <AppIcon
                    name={'ChevronRight'}
                    size={16}
                    color={COLORS.saddleBrown}
                  />
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
                <View style={styles.routeMapHeader}>
                  <View>
                    <AppText style={styles.routeMapTitle}>
                      Shipment Route Map
                    </AppText>
                    <AppText style={styles.routeMapShipmentCode}>
                      {selectedMapShipment?.shipmentCode}
                    </AppText>
                  </View>
                  <Pressable
                    onPress={() => {
                      navigation.navigate('ShipmentMapDirection', {
                        shipmentData: selectedMapShipment,
                      });
                    }}
                    style={styles.viewInFullScreenBtn}
                  >
                    <AppText style={styles.viewInFullScreenBtnText}>
                      View in Full Map
                    </AppText>
                  </Pressable>
                </View>

                {/* Map Preview Container */}
                <View style={styles.mapWrapper}>
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapView}
                    initialRegion={getRegionForShipment(selectedMapShipment)}
                    showsUserLocation
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
                          <AppIcon
                            name={'MapPin'}
                            size={14}
                            color={COLORS.white}
                          />
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
                          <AppIcon
                            name={'MapPin'}
                            size={14}
                            color={COLORS.white}
                          />
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
                            strokeColor={COLORS.brandBrown || COLORS.primary}
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
                            strokeColor={COLORS.primary}
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
      <Suspense fallback={null}>
        <ConnectBankModal
          isVisible={isBankModalVisible}
          onClose={() => setIsBankModalVisible(false)}
          navigation={navigation}
        />
      </Suspense>

      <Suspense fallback={null}>
        <SubscriptionRequiredModal
          visible={isSubModalVisible}
          onClose={closeSubModal}
          shipperStatus={shipperStatus}
          subscriptionStatus={subscriptionStatus}
          plansData={plansData}
          onOpenAddCardModal={() => setIsCardModalVisible(true)}
          onSubscriptionSuccess={refreshSubStatus}
        />
      </Suspense>

      <Suspense fallback={null}>
        <StripePaymentMethodCardModal
          isCardModalVisible={isCardModalVisible}
          setIsCardModalVisible={setIsCardModalVisible}
          cardStatus={{ hasCard: shipperStatus.hasCard }}
          submittingCard={submittingCard}
          formError={cardFormError}
          cardholderName={cardholderName}
          setCardholderName={setCardholderName}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
          handleSavePaymentMethod={handleSavePaymentMethod}
        />
      </Suspense>
    </View>
  );
};

export default ShipperHomeScreen;
