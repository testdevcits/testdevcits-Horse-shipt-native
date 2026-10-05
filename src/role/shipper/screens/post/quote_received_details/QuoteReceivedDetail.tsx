import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from 'react';
import { ScrollView, View, TouchableOpacity, Share } from 'react-native';
import MapView from 'react-native-maps';

import { COLORS } from '../../../../../constants';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { AppHeader } from '../../../../../components';
import shipperService from '../../../../../api/services/shipperService';
import useStripeStatus from '../../../../../hooks/useStripeStatus';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import styles from './styles.QuoteReceivedDetails';

// Sub-components
import { HorseDetailCard } from './components/HorseDetailCard';
import { CustomerInfoSection } from './components/CustomerInfoSection';
import { QuoteHeroCard } from './components/QuoteHeroCard';
import { QuoteRouteCard } from './components/QuoteRouteCard';
import { QuoteMapCard } from './components/QuoteMapCard';
import { QuoteSummaryCard } from './components/QuoteSummaryCard';
import { QuoteActionBar } from './components/QuoteActionBar';

const AskQuestionModal = lazy(
  () => import('../../home/components/ask_question/AskQuestionModal'),
);
const SubmitOfferModal = lazy(
  () => import('../../home/components/submit_offer_modal/SubmitOfferModal'),
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
        <QuoteHeroCard
          shipmentCode={shipmentCode}
          status={status}
          statusColor={statusColor}
          getStatusLabel={getStatusLabel}
          formatDate={formatDate}
          quoteCreatedAt={quote?.createdAt}
          numberOfHorses={shipment?.numberOfHorses || 0}
        />

        {/* Route Section */}
        <QuoteRouteCard
          pickupLocation={pickupLocation}
          pickupDate={pickupDate}
          deliveryLocation={deliveryLocation}
          deliveryDate={deliveryDate}
          formatDate={formatDate}
          formatTime={formatTime}
        />

        {/* Interactive Map Card with Distance & Time Calculation */}
        <QuoteMapCard
          mapRef={mapRef}
          mapRegion={mapRegion}
          pLat={pLat}
          pLng={pLng}
          dLat={dLat}
          dLng={dLng}
          fitToRoute={fitToRoute}
          handleDirectionsReady={handleDirectionsReady}
          calculatedDistance={calculatedDistance}
          calculatedDuration={calculatedDuration}
          haversine={haversine}
        />

        {/* Shipment Summary Card */}
        <QuoteSummaryCard
          numberOfHorses={shipment?.numberOfHorses || 0}
          shipmentStatus={shipment?.status}
          pickupDate={pickupDate}
          deliveryDate={deliveryDate}
          getStatusLabel={getStatusLabel}
          formatDate={formatDate}
        />

        {/* Horse Details */}
        <HorseDetailCard horse={horse} />

        {/* Customer Info & Message */}
        <CustomerInfoSection
          customer={quote?.customer}
          message={quote?.message}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <QuoteActionBar
        onAskQuestionPress={handleAskQuestionPress}
        onSubmitOfferPress={handleSubmitOfferPress}
      />

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

export default QuoteReceivedDetail;
