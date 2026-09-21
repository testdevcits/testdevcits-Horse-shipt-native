import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from 'react';
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  Share,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { COLORS, ICON_SIZE } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';

import AppIcon from '../../../../../components/app_icon/AppIcon';
import { AppHeader, AppText } from '../../../../../components';
import shipperService from '../../../../../api/services/shipperService';
import useStripeStatus from '../../../../../hooks/useStripeStatus';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import styles from './styles.QuoteReceivedDetails';

const AskQuestionModal = lazy(
  () => import('../../home/components/AskQuestionModal'),
);
const SubmitOfferModal = lazy(
  () => import('../../home/shipment_details/SubmitOfferModal'),
);
const ConnectBankModal = lazy(
  () => import('../../home/components/ConnectBankModal'),
);

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DateRange {
  start: string;
  end: string;
}

interface Horse {
  photo?: {
    url?: string | null;
    public_id?: string | null;
  };
  registeredName?: string;
  barnName?: string;
  breed?: string;
  otherBreed?: string;
  sex?: string;
  colour?: string;
  age?: number;
  requestedStallSize?: string;
  generalInfo?: string;
  notes?: string;
}

interface Shipment {
  _id?: string;
  shipmentCode?: string;
  status?: string;

  pickupCoords?: Coordinates;
  deliveryCoords?: Coordinates;

  pickupDateRange?: DateRange;
  deliveryDateRange?: DateRange;

  pickupLocation?: string;
  deliveryLocation?: string;

  numberOfHorses?: number;
  horses?: Horse[];
}

interface Customer {
  _id?: string;
  name?: string;
  email?: string;
}

interface QuoteData {
  _id?: string;

  pickupCoords?: Coordinates;
  deliveryCoords?: Coordinates;

  shipment?: Shipment;

  customer?: Customer;

  shipper?: string;

  shipmentCode?: string;

  pickupLocation?: string;
  deliveryLocation?: string;

  message?: string;

  status?: string;

  isSeen?: boolean;

  respondedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  route: {
    params?: {
      data?: QuoteData;
      quote?: QuoteData;
      item?: QuoteData;

      [key: string]: any;
    };
  };

  navigation: any;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (date?: string) => {
  if (!date) return '--';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '--';
  return parsedDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date?: string) => {
  if (!date) return '';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';
  return parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'open_for_offers':
      return 'Open for Offers';
    case 'accepted':
      return 'Accepted';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status
        ? status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        : 'Pending';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'accepted':
      return COLORS.greenPrimary;
    case 'completed':
      return COLORS.greenSuccess;
    case 'cancelled':
      return COLORS.redPrimary;
    case 'open_for_offers':
      return COLORS.bluePrimary;
    case 'pending':
    default:
      return COLORS.amberPrimary;
  }
};

const truncateText = (text = '', maxLength = 90) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Haversine distance and duration calculation helper
const calculateHaversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  const miles = km * 0.621371;

  // Assuming average driving speed 60 km/h (1 km / min)
  const totalMins = Math.max(1, Math.round(km));
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;

  return {
    km: km.toFixed(1),
    miles: miles.toFixed(1),
    formattedKm: `${km.toFixed(1)} km`,
    formattedMiles: `${miles.toFixed(1)} mi`,
    timeStr,
  };
};

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

const QuoteReceivedDetail = ({ route, navigation }: Props) => {
  const params = useMemo(() => route?.params || {}, [route?.params]);

  const quote: QuoteData = useMemo(() => {
    return (params.data || params.quote || params.item || params) as QuoteData;
  }, [params]);

  const shipment = quote?.shipment;
  const horse = shipment?.horses?.[0];
  const status = quote?.status || shipment?.status || 'pending';
  const statusColor = getStatusColor(status);

  const pickupLocation =
    quote?.pickupLocation ||
    shipment?.pickupLocation ||
    'Pickup location unavailable';

  const deliveryLocation =
    quote?.deliveryLocation ||
    shipment?.deliveryLocation ||
    'Delivery location unavailable';

  const pickupDate = shipment?.pickupDateRange?.start;
  const deliveryDate = shipment?.deliveryDateRange?.start;

  const shipmentCode =
    quote?.shipmentCode || shipment?.shipmentCode || 'HS-SHIP';

  const shipmentId = shipment?._id || quote?._id;

  // Stripe readiness
  const { isStripeReady, loading: stripeLoading } = useStripeStatus();
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  // Map & Route Coordinates
  const mapRef = useRef<MapView>(null);
  const pLat =
    quote?.pickupCoords?.latitude ||
    shipment?.pickupCoords?.latitude ||
    22.750089225339288;
  const pLng =
    quote?.pickupCoords?.longitude ||
    shipment?.pickupCoords?.longitude ||
    75.90277293697;
  const dLat =
    quote?.deliveryCoords?.latitude ||
    shipment?.deliveryCoords?.latitude ||
    22.754344256169404;
  const dLng =
    quote?.deliveryCoords?.longitude ||
    shipment?.deliveryCoords?.longitude ||
    75.9033459238708;

  const mapRegion = useMemo(
    () => ({
      latitude: (pLat + dLat) / 2,
      longitude: (pLng + dLng) / 2,
      latitudeDelta: Math.max(Math.abs(pLat - dLat) * 1.5, 0.05),
      longitudeDelta: Math.max(Math.abs(pLng - dLng) * 1.5, 0.05),
    }),
    [pLat, pLng, dLat, dLng],
  );

  const haversine = useMemo(
    () => calculateHaversine(pLat, pLng, dLat, dLng),
    [pLat, pLng, dLat, dLng],
  );

  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(
    null,
  );
  const [calculatedDuration, setCalculatedDuration] = useState<string | null>(
    null,
  );

  // Modals state
  const [isAskModalVisible, setIsAskModalVisible] = useState(false);
  const [isSubmitOfferModalVisible, setIsSubmitOfferModalVisible] =
    useState(false);

  // Questions State
  const [pendingQuestion, setPendingQuestion] = useState<any>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const fetchQuestions = async () => {
    if (!shipmentId) return;
    setLoadingQuestions(true);
    try {
      const res = await shipperService.getShipmentQuestions(shipmentId);
      if (res?.success && res?.data) {
        if (res?.data?.pending?.length > 0) {
          setPendingQuestion(res.data.pending[0]);
        } else {
          setPendingQuestion(null);
        }
        if (res?.data?.answered?.length > 0) {
          setAnsweredQuestion(res.data.answered[0]);
        } else {
          setAnsweredQuestion(null);
        }
      }
    } catch (error) {
      console.error('Fetch Shipment Questions Error:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentId]);

  const fitToRoute = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: pLat, longitude: pLng },
          { latitude: dLat, longitude: dLng },
        ],
        {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        },
      );
    }
  };

  const handleDirectionsReady = (result: any) => {
    if (result) {
      setCalculatedDistance(
        `${result.distance.toFixed(1)} km (${(
          result.distance * 0.621371
        ).toFixed(1)} mi)`,
      );
      const mins = Math.round(result.duration);
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      setCalculatedDuration(hrs > 0 ? `${hrs}h ${remMins}m` : `${mins} mins`);
    }
  };

  const handleAskQuestionPress = () => {
    setIsAskModalVisible(true);
    fetchQuestions();
  };

  const handleSubmitQuestion = async (question: string) => {
    try {
      const payload = {
        shipmentId: shipmentId || '',
        question,
      };
      const res = await shipperService.askQuestion(payload);
      if (res?.success) {
        showSuccessToast(
          'Success',
          res.message || 'Question submitted successfully',
        );
        if (res?.data) {
          setPendingQuestion(res.data);
        } else {
          fetchQuestions();
        }
      } else {
        showErrorToast(
          'Submission Failed',
          res?.message || 'Failed to submit question.',
        );
      }
    } catch (error: any) {
      console.error('Ask Question Error:', error);
      showErrorToast(
        'Submission Failed',
        error?.response?.data?.message || 'Failed to submit question.',
      );
      throw error;
    }
  };

  const handleSubmitOfferPress = () => {
    if (!isStripeReady && !stripeLoading) {
      setIsBankModalVisible(true);
    } else {
      setIsSubmitOfferModalVisible(true);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shipment Request ${shipmentCode}: ${pickupLocation} -> ${deliveryLocation}`,
      });
    } catch (_e) {
      // ignore share error
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <AppHeader
        showBack
        title="Quote Detail"
        showProfileImage={false}
        showNotificationIcon={false}
        onBack={() => navigation?.goBack?.()}
        rightElement={
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ padding: 6 }}
          >
            <AppIcon name="Share2" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.shipmentIcon}>
              <AppIcon
                name="Truck"
                size={ICON_SIZE.xl}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.heroInfo}>
              <AppText style={styles.heroLabel}>SHIPMENT REQUEST</AppText>
              <AppText style={styles.heroCode}>{shipmentCode}</AppText>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <AppText style={[styles.statusText, { color: statusColor }]}>
                {getStatusLabel(status)}
              </AppText>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View style={styles.heroMeta}>
              <AppIcon
                name="Calendar"
                size={ICON_SIZE.sm}
                color={COLORS.textSecondary}
              />
              <AppText style={styles.heroMetaText}>
                Requested {formatDate(quote?.createdAt)}
              </AppText>
            </View>

            <View style={styles.heroMeta}>
              <AppIcon
                name="Box"
                size={ICON_SIZE.sm}
                color={COLORS.textSecondary}
              />
              <AppText style={styles.heroMetaText}>
                {shipment?.numberOfHorses || 1}{' '}
                {shipment?.numberOfHorses === 1 ? 'Horse' : 'Horses'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Route Section */}
        <View style={styles.sectionHeader}>
          <View>
            <AppText style={styles.sectionTitle}>Shipment Route</AppText>
            <AppText style={styles.sectionSubtitle}>
              Pickup and delivery details
            </AppText>
          </View>
          <View style={styles.routeIcon}>
            <AppIcon name="Route" size={ICON_SIZE.sm} color={COLORS.primary} />
          </View>
        </View>

        <View style={styles.routeCard}>
          {/* Pickup */}
          <View style={styles.locationRow}>
            <View style={styles.timelineContainer}>
              <View
                style={[
                  styles.locationDot,
                  { backgroundColor: COLORS.greenPrimary },
                ]}
              />
              <View style={styles.timelineLine} />
            </View>

            <View style={styles.locationContent}>
              <View style={styles.locationHeader}>
                <AppText style={styles.locationType}>PICKUP</AppText>
                <View style={styles.datePill}>
                  <AppIcon
                    name="Calendar"
                    size={ICON_SIZE.xs}
                    color={COLORS.greenPrimary}
                  />
                  <AppText style={styles.datePillText}>
                    {formatDate(pickupDate)}
                  </AppText>
                </View>
              </View>
              <AppText style={styles.locationText}>{pickupLocation}</AppText>
              {pickupDate && (
                <View style={styles.timeRow}>
                  <AppIcon
                    name="Clock"
                    size={ICON_SIZE.xs}
                    color={COLORS.textLight}
                  />
                  <AppText style={styles.timeText}>
                    {formatTime(pickupDate) || 'Scheduled pickup'}
                  </AppText>
                </View>
              )}
            </View>
          </View>

          {/* Delivery */}
          <View style={styles.locationRow}>
            <View style={styles.timelineContainer}>
              <View
                style={[
                  styles.locationDot,
                  { backgroundColor: COLORS.redPrimary },
                ]}
              />
            </View>

            <View style={styles.locationContent}>
              <View style={styles.locationHeader}>
                <AppText style={styles.locationType}>DELIVERY</AppText>
                <View
                  style={[
                    styles.datePill,
                    { backgroundColor: COLORS.redLightBg },
                  ]}
                >
                  <AppIcon
                    name="Calendar"
                    size={ICON_SIZE.xs}
                    color={COLORS.redPrimary}
                  />
                  <AppText
                    style={[styles.datePillText, { color: COLORS.redPrimary }]}
                  >
                    {formatDate(deliveryDate)}
                  </AppText>
                </View>
              </View>
              <AppText style={styles.locationText}>{deliveryLocation}</AppText>
              {deliveryDate && (
                <View style={styles.timeRow}>
                  <AppIcon
                    name="Clock"
                    size={ICON_SIZE.xs}
                    color={COLORS.textLight}
                  />
                  <AppText style={styles.timeText}>
                    {formatTime(deliveryDate) || 'Scheduled delivery'}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Interactive Map Card with Distance & Time Calculation */}
        <View style={styles.mapCardContainer}>
          <View style={styles.mapHeaderRow}>
            <View style={styles.mapHeaderInfo}>
              <AppIcon
                name="Route"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
              <AppText style={styles.mapHeaderTitle}>
                Interactive Route & Distance
              </AppText>
            </View>
            <TouchableOpacity
              style={styles.recenterBtn}
              onPress={fitToRoute}
              activeOpacity={0.8}
            >
              <AppIcon name="LocateFixed" size={14} color={COLORS.primary} />
              <AppText style={styles.recenterText}>Fit Route</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.mapView}
              initialRegion={mapRegion}
              showsUserLocation={false}
              showsMyLocationButton={false}
              onMapReady={fitToRoute}
            >
              <Marker
                coordinate={{ latitude: pLat, longitude: pLng }}
                title="Pickup Location"
              >
                <View
                  style={[
                    styles.markerBadge,
                    { backgroundColor: COLORS.greenSuccess },
                  ]}
                >
                  <AppIcon name="PackageCheck" size={14} color={COLORS.white} />
                </View>
              </Marker>

              <Marker
                coordinate={{ latitude: dLat, longitude: dLng }}
                title="Delivery Location"
              >
                <View
                  style={[
                    styles.markerBadge,
                    { backgroundColor: COLORS.primary },
                  ]}
                >
                  <AppIcon name="MapPin" size={14} color={COLORS.white} />
                </View>
              </Marker>

              <MapViewDirections
                origin={{ latitude: pLat, longitude: pLng }}
                destination={{ latitude: dLat, longitude: dLng }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor={COLORS.primary}
                optimizeWaypoints={true}
                onReady={handleDirectionsReady}
              />
            </MapView>

            {/* Distance & Duration Live Overlay Card */}
            <View style={styles.mapStatsCard}>
              <View style={styles.mapStatItem}>
                <AppIcon name="Navigation" size={16} color={COLORS.primary} />
                <View style={styles.mapStatContent}>
                  <AppText style={styles.mapStatLabel}>
                    ESTIMATED DISTANCE
                  </AppText>
                  <AppText style={styles.mapStatVal}>
                    {calculatedDistance ||
                      `${haversine.formattedKm} (${haversine.formattedMiles})`}
                  </AppText>
                </View>
              </View>

              <View style={styles.mapStatDivider} />

              <View style={styles.mapStatItem}>
                <AppIcon name="Clock" size={16} color={COLORS.primary} />
                <View style={styles.mapStatContent}>
                  <AppText style={styles.mapStatLabel}>
                    ESTIMATED DURATION
                  </AppText>
                  <AppText style={styles.mapStatVal}>
                    {calculatedDuration || haversine.timeStr}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Shipment Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryTitleRow}>
              <View style={styles.smallIconContainer}>
                <AppIcon
                  name="Package"
                  size={ICON_SIZE.sm}
                  color={COLORS.primary}
                />
              </View>
              <AppText style={styles.summaryTitle}>Shipment Summary</AppText>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>HORSES</AppText>
              <AppText style={styles.summaryValue}>
                {shipment?.numberOfHorses || 1}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>SHIPMENT</AppText>
              <AppText style={styles.summaryValueSmall} numberOfLines={1}>
                {shipment?.status ? getStatusLabel(shipment.status) : 'Open'}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>PICKUP</AppText>
              <AppText style={styles.summaryValueSmall}>
                {formatDate(pickupDate)}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>DELIVERY</AppText>
              <AppText style={styles.summaryValueSmall}>
                {formatDate(deliveryDate)}
              </AppText>
            </View>
          </View>
        </View>

        {/* Horse Details */}
        {horse && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Horse Details</AppText>
                <AppText style={styles.sectionSubtitle}>
                  Information provided for this shipment
                </AppText>
              </View>
            </View>

            <View style={styles.horseCard}>
              <View style={styles.horseHeader}>
                <View style={styles.horseAvatar}>
                  <AppIcon
                    name="Heart"
                    size={ICON_SIZE.lg}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.horseNameContainer}>
                  <AppText style={styles.horseName}>
                    {horse?.registeredName || 'Unnamed Horse'}
                  </AppText>
                  <AppText style={styles.horseBarnName}>
                    {horse?.barnName || 'Barn not specified'}
                  </AppText>
                </View>

                <View style={styles.horseAgeBadge}>
                  <AppText style={styles.horseAge}>
                    {horse?.age ?? '--'}
                  </AppText>
                  <AppText style={styles.horseAgeLabel}>yrs</AppText>
                </View>
              </View>

              <View style={styles.horseDivider} />

              <View style={styles.horseDetailsGrid}>
                <HorseDetail
                  icon="Award"
                  label="Breed"
                  value={horse?.breed || horse?.otherBreed || 'Not specified'}
                />
                <HorseDetail
                  icon="User"
                  label="Sex"
                  value={horse?.sex || 'Not specified'}
                />
                <HorseDetail
                  icon="Circle"
                  label="Colour"
                  value={horse?.colour || 'Not specified'}
                />
                <HorseDetail
                  icon="Box"
                  label="Stall Size"
                  value={horse?.requestedStallSize || 'Not specified'}
                />
              </View>

              {horse?.generalInfo ? (
                <View style={styles.infoBox}>
                  <View style={styles.infoBoxHeader}>
                    <AppIcon
                      name="Info"
                      size={ICON_SIZE.xs}
                      color={COLORS.primary}
                    />
                    <AppText style={styles.infoBoxTitle}>
                      General Information
                    </AppText>
                  </View>
                  <AppText style={styles.infoBoxText}>
                    {horse?.generalInfo}
                  </AppText>
                </View>
              ) : null}

              {horse?.notes ? (
                <View style={styles.notesBox}>
                  <View style={styles.infoBoxHeader}>
                    <AppIcon
                      name="FileText"
                      size={ICON_SIZE.xs}
                      color={COLORS.textSecondary}
                    />
                    <AppText style={styles.notesTitle}>Notes</AppText>
                  </View>
                  <AppText style={styles.notesText}>{horse?.notes}</AppText>
                </View>
              ) : null}
            </View>
          </>
        )}

        {/* Customer Info */}
        {quote?.customer && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Customer</AppText>
                <AppText style={styles.sectionSubtitle}>
                  Shipment requested by
                </AppText>
              </View>
            </View>

            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <AppIcon
                  name="User"
                  size={ICON_SIZE.lg}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.customerInfo}>
                <AppText style={styles.customerName}>
                  {quote?.customer?.name || 'Customer'}
                </AppText>
                {!!quote?.customer?.email && (
                  <View style={styles.customerMeta}>
                    <AppIcon
                      name="Mail"
                      size={ICON_SIZE.xs}
                      color={COLORS.textSecondary}
                    />
                    <AppText style={styles.customerEmail}>
                      {quote?.customer?.email}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Customer Message */}
        {!!quote?.message && (
          <View style={styles.messageCard}>
            <View style={styles.messageIcon}>
              <AppIcon
                name="MessageSquare"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.messageContent}>
              <AppText style={styles.messageTitle}>Customer Message</AppText>
              <AppText style={styles.messageText}>
                {truncateText(quote?.message, 180)}
              </AppText>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.askQuestionBtn}
          onPress={handleAskQuestionPress}
          activeOpacity={0.8}
        >
          <AppIcon name="MessageSquare" size={16} color={COLORS.primary} />
          <AppText style={styles.askQuestionBtnText}>Ask Question</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitOfferBtn}
          onPress={handleSubmitOfferPress}
          activeOpacity={0.85}
        >
          <AppIcon name="Send" size={16} color={COLORS.white} />
          <AppText style={styles.submitOfferBtnText}>Submit Offer</AppText>
        </TouchableOpacity>
      </View>

      {/* Modals with Suspense */}
      <Suspense fallback={null}>
        <AskQuestionModal
          isVisible={isAskModalVisible}
          onClose={() => setIsAskModalVisible(false)}
          onSubmit={handleSubmitQuestion}
          shipmentCode={shipmentCode}
          pendingQuestion={pendingQuestion}
          loadingQuestions={loadingQuestions}
          answeredQuestion={answeredQuestion}
        />
      </Suspense>

      <Suspense fallback={null}>
        <SubmitOfferModal
          isVisible={isSubmitOfferModalVisible}
          onClose={() => setIsSubmitOfferModalVisible(false)}
          shipmentId={shipmentId || ''}
          shipmentCode={shipmentCode}
          onSuccess={() => {
            setIsSubmitOfferModalVisible(false);
            showSuccessToast(
              'Offer Submitted',
              'Your offer was submitted successfully.',
            );
            if (navigation?.goBack) navigation.goBack();
          }}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ConnectBankModal
          isVisible={isBankModalVisible}
          onClose={() => setIsBankModalVisible(false)}
          navigation={navigation}
        />
      </Suspense>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* Horse Detail Component                                                     */
/* -------------------------------------------------------------------------- */

interface HorseDetailProps {
  icon: any;
  label: string;
  value: string;
}

const HorseDetail = ({ icon, label, value }: HorseDetailProps) => {
  return (
    <View style={styles.horseDetailItem}>
      <View style={styles.horseDetailIcon}>
        <AppIcon name={icon} size={ICON_SIZE.xs} color={COLORS.primary} />
      </View>

      <View style={styles.horseDetailContent}>
        <AppText style={styles.horseDetailLabel}>{label}</AppText>
        <AppText style={styles.horseDetailValue} numberOfLines={1}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

export default QuoteReceivedDetail;
