import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  MapPin,
  Calendar,
  Compass,
  Box,
  ChevronDown,
  ChevronUp,
  Share2,
  Flag,
} from 'lucide-react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppHeader, AppText } from '../../../../components';
import { COLORS } from '../../../../constants';
import imageIndex from '../../../../assets/images/imageIndex';
import shipperService from '../../../../api/services/shipperService';
import AskQuestionModal from './AskQuestionModal';
import SubmitOfferModal from './SubmitOfferModal';
import styles from './styles.shippershipmentdetails';


const ShipperShipmentDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Extract shipment from route params or fallback to default sample payload
  const shipment = route.params?.shipment || {};

  const [isHorseExpanded, setIsHorseExpanded] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(true);

  // Questions State
  const [isAskModalVisible, setIsAskModalVisible] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Submit Offer Modal State
  const [isSubmitOfferModalVisible, setIsSubmitOfferModalVisible] = useState(false);

  const fetchQuestions = async () => {
    if (!shipment._id) return;
    setLoadingQuestions(true);
    try {
      const res = await shipperService.getShipmentQuestions(shipment._id);
      if (res?.success && res?.data?.pending) {
        if (res.data.pending.length > 0) {
          setPendingQuestion(res.data.pending[0]);
        } else {
          setPendingQuestion(null);
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
  }, [shipment._id]);

  // Horse & Specs
  const firstHorse = shipment.horses && shipment.horses[0] ? shipment.horses[0] : {};
  const horsePhoto = firstHorse.photo?.url;
  const registeredName = firstHorse.registeredName || 'HOrse no 1';
  const barnName = firstHorse.barnName || 'Test Barn';
  const breed = firstHorse.breed || 'Brandenburger';
  const sex = firstHorse.sex || 'Mare';
  const colour = firstHorse.colour || 'Bay';
  const age = firstHorse.age || 3;
  const stallSize = firstHorse.requestedStallSize || 'Box';
  const notesText = firstHorse.notes || firstHorse.notesLog?.[0]?.note || 'This is first horse for test';
  const noteDate = firstHorse.notesLog?.[0]?.createdAt || shipment.publishedAt;

  // Dates
  const pickupDateFormatted = shipment.pickupDateRange?.start
    ? moment(shipment.pickupDateRange.start).format('MMM DD').toUpperCase()
    : 'JUL 28';
  const deliveryDateFormatted = shipment.deliveryDateRange?.start
    ? moment(shipment.deliveryDateRange.start).format('MMM DD').toUpperCase()
    : 'JUL 29';
  const postedDateFormatted = shipment.publishedAt
    ? moment(shipment.publishedAt).format('D MMM YYYY')
    : '27 Jul 2026';

  // Distance & Specs
  const distanceMiles = shipment.estimatedDistance?.miles
    ? Number(shipment.estimatedDistance.miles).toFixed(2)
    : '2664.22';
  const distanceKm = shipment.estimatedDistance?.km
    ? Number(shipment.estimatedDistance.km).toFixed(2)
    : '4287.65';

  // Coords & Region
  const pLat = shipment.pickupCoords?.latitude || shipment.pickupCoords?.lat || 25.2479758;
  const pLng = shipment.pickupCoords?.longitude || shipment.pickupCoords?.lng || 55.3525527;
  const dLat = shipment.deliveryCoords?.latitude || shipment.deliveryCoords?.lat || 56.879635;
  const dLng = shipment.deliveryCoords?.longitude || shipment.deliveryCoords?.lng || 24.603189;

  const mapRegion = {
    latitude: (pLat + dLat) / 2,
    longitude: (pLng + dLng) / 2,
    latitudeDelta: Math.max(Math.abs(pLat - dLat) * 1.4, 0.5),
    longitudeDelta: Math.max(Math.abs(pLng - dLng) * 1.4, 0.5),
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shipment Details ${shipment.shipmentCode}: Pickup ${shipment.pickupLocation} to ${shipment.deliveryLocation}`,
      });
    } catch (e) {
      // ignore share error
    }
  };

  const handleAskQuestionPress = () => {
    setIsAskModalVisible(true);
    fetchQuestions();
  };

  const handleSubmitQuestion = async (question: string) => {
    try {
      const payload = {
        shipmentId: shipment._id,
        question,
      };
      const res = await shipperService.askQuestion(payload);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Question submitted successfully',
        });
        if (res.data) {
          setPendingQuestion(res.data);
        } else {
          fetchQuestions();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: res?.message || 'Failed to submit question.',
        });
      }
    } catch (error: any) {
      console.error('Ask Question Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error?.response?.data?.message || 'Failed to submit question.',
      });
      throw error;
    }
  };

  const handleSubmitOfferPress = () => {
    setIsSubmitOfferModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="SHIPMENT DETAILS"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Sub Row: Status Pill & Posted Date */}
        <View style={styles.headerSubRow}>
          <View style={styles.statusBadgePill}>
            <AppText style={styles.statusBadgeText}>
              {(shipment.status || 'OPEN FOR OFFERS').replace(/_/g, ' ')}
            </AppText>
          </View>
          <AppText style={styles.postedDateText}>Posted on {postedDateFormatted}</AppText>
        </View>

        {/* 1. Hero Horse Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBannerContainer}>
            {horsePhoto ? (
              <Image source={{ uri: horsePhoto }} style={styles.heroBannerImage} />
            ) : (
              <Image source={imageIndex.Banner} style={styles.heroBannerImage} />
            )}
            <View style={styles.heroBannerBadge}>
              <AppText style={styles.heroBannerBadgeText}>OPEN FOR OFFERS</AppText>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.horseCountTag}>
              <AppText style={styles.horseCountTagText}>Horse 1/1</AppText>
            </View>

            <AppText style={styles.heroTitle}>
              {registeredName} ( {barnName} )
            </AppText>
            <AppText style={styles.heroSubtitle}>
              {breed} • {age} yrs • {sex} • {colour}
            </AppText>
            <AppText style={styles.shipmentCodeText}>{shipment.shipmentCode}</AppText>

            <View style={styles.customerRow}>
              <AppText style={styles.customerNameText}>
                Customer: {shipment.customer?.name || 'Test Dev'}
              </AppText>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Share2 size={14} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Date Cards Row */}
            <View style={styles.dateCardsRow}>
              <View style={styles.dateCard}>
                <AppText style={styles.dateCardLabel}>PICKUP</AppText>
                <AppText style={styles.dateCardValue}>{pickupDateFormatted}</AppText>
              </View>

              <View style={styles.dateCard}>
                <AppText style={styles.dateCardLabel}>DELIVERY</AppText>
                <AppText style={styles.dateCardValue}>{deliveryDateFormatted}</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Shipment Route Map Card */}
        {isMapVisible && (
          <View style={styles.routeMapCard}>
            <AppText style={styles.cardHeaderTitle}>Shipment Route Map</AppText>
            <AppText style={styles.cardHeaderSub}>{shipment.shipmentCode}</AppText>

            <View style={styles.mapWrapper}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapView}
                initialRegion={mapRegion}
              >
                <Marker
                  coordinate={{ latitude: pLat, longitude: pLng }}
                  title="Pickup Location"
                  description={shipment.pickupLocation}
                >
                  <View style={styles.markerCircleGreen}>
                    <MapPin size={14} color={COLORS.white} />
                  </View>
                </Marker>

                <Marker
                  coordinate={{ latitude: dLat, longitude: dLng }}
                  title="Delivery Location"
                  description={shipment.deliveryLocation}
                >
                  <View style={styles.markerCircleRed}>
                    <MapPin size={14} color={COLORS.white} />
                  </View>
                </Marker>

                <Polyline
                  coordinates={[
                    { latitude: pLat, longitude: pLng },
                    { latitude: dLat, longitude: dLng },
                  ]}
                  strokeColor="#2563EB"
                  strokeWidth={4}
                />
              </MapView>
            </View>

            <TouchableOpacity
              style={styles.closeMapBtn}
              onPress={() => setIsMapVisible(false)}
            >
              <AppText style={styles.closeMapBtnText}>Close Map</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. 4-Grid Spec Cards */}
        <View style={styles.gridContainer}>
          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <Compass size={18} color="#A06333" />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>DISTANCE</AppText>
              <AppText style={styles.specStatValue}>{distanceMiles} mi</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <Box size={18} color="#A06333" />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>HORSES</AppText>
              <AppText style={styles.specStatValue}>{shipment.numberOfHorses || 1}</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <Box size={18} color="#A06333" />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{stallSize}</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <Box size={18} color="#A06333" />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{stallSize}</AppText>
            </View>
          </View>
        </View>

        {/* 4. Route Information Card */}
        <View style={styles.routeInfoCard}>
          <View style={styles.cardTitleRow}>
            <Compass size={18} color="#A06333" />
            <AppText style={styles.cardHeaderTitle}>Route Information</AppText>
          </View>

          <View style={styles.timelineContainer}>
            {/* Pickup Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxPickup}>
                <MapPin size={16} color="#A06333" />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>PICKUP LOCATION</AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment.pickupLocation || 'Dubai, UAE'}
                </AppText>
              </View>
            </View>

            {/* Connecting Vertical Line */}
            <View style={styles.timelineLine} />

            {/* Delivery Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxDelivery}>
                <Flag size={16} color="#A06333" />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>DELIVERY LOCATION</AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment.deliveryLocation || 'Latvia'}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.totalDistanceContainer}>
            <AppText style={styles.totalDistanceLabel}>TOTAL DISTANCE</AppText>
            <AppText style={styles.totalDistanceValue}>
              {distanceMiles} <AppText style={styles.totalDistanceSub}>miles ({distanceKm} km)</AppText>
            </AppText>
          </View>
        </View>

        {/* 5. Horse Details Accordion Card */}
        <View style={styles.horseDetailsCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setIsHorseExpanded(!isHorseExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.accordionTitleRow}>
              <Box size={18} color="#A06333" />
              <AppText style={styles.cardHeaderTitle}>Horse Details 1/1</AppText>
            </View>

            {isHorseExpanded ? (
              <ChevronUp size={20} color={COLORS.textSecondary} />
            ) : (
              <ChevronDown size={20} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>

          {isHorseExpanded && (
            <View style={styles.accordionContent}>
              {/* Horse Thumbnail Row */}
              <View style={styles.horseProfileRow}>
                {horsePhoto ? (
                  <Image source={{ uri: horsePhoto }} style={styles.horseThumb} />
                ) : (
                  <Image source={imageIndex.Banner} style={styles.horseThumb} />
                )}

                <View style={styles.horseProfileInfo}>
                  <AppText style={styles.horseNameText}>
                    {registeredName} - {barnName}
                  </AppText>
                  <AppText style={styles.horseBreedText}>
                    Breed: {breed} | Sex: {sex}
                  </AppText>

                  <View style={styles.horsePillsRow}>
                    <View style={styles.horseMiniPill}>
                      <AppText style={styles.horseMiniPillText}>STALL: {stallSize}</AppText>
                    </View>
                    <View style={styles.horseMiniPill}>
                      <AppText style={styles.horseMiniPillText}>AGE: {age}</AppText>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2x2 Horse Specs Grid */}
              <View style={styles.horseSpecsGrid}>
                <View style={styles.horseSpecBox}>
                  <AppText style={styles.horseSpecLabel}>BREED</AppText>
                  <AppText style={styles.horseSpecValue}>{breed}</AppText>
                </View>

                <View style={styles.horseSpecBox}>
                  <AppText style={styles.horseSpecLabel}>COLOR</AppText>
                  <AppText style={styles.horseSpecValue}>{colour}</AppText>
                </View>

                <View style={styles.horseSpecBox}>
                  <AppText style={styles.horseSpecLabel}>SEX</AppText>
                  <AppText style={styles.horseSpecValue}>{sex}</AppText>
                </View>

                <View style={styles.horseSpecBox}>
                  <AppText style={styles.horseSpecLabel}>AGE</AppText>
                  <AppText style={styles.horseSpecValue}>{age} Yrs</AppText>
                </View>

                <View style={[styles.horseSpecBox, { width: '100%' }]}>
                  <AppText style={styles.horseSpecLabel}>REGISTERED NAME</AppText>
                  <AppText style={styles.horseSpecValue}>{registeredName}</AppText>
                </View>
              </View>

              {/* Chronological Notes */}
              <View style={styles.notesBox}>
                <View style={styles.notesHeaderRow}>
                  <AppText style={styles.notesTitle}>Chronological Notes</AppText>
                  <AppText style={styles.notesDateText}>
                    {moment(noteDate).format('D MMM YYYY, h:mm A')}
                  </AppText>
                </View>
                <AppText style={styles.notesBodyText}>"{notesText}"</AppText>
              </View>
            </View>
          )}
        </View>

        {/* 6. Ready to Respond CTA Card */}
        <View style={styles.ctaCard}>
          <AppText style={styles.ctaTitle}>Ready to Respond</AppText>
          <AppText style={styles.ctaSub}>
            Do you have questions about this shipment, or are you ready to submit a binding
            proposal, providing your professional offer?
          </AppText>

          <View style={styles.summaryCodeBox}>
            <AppText style={styles.summaryCodeLabel}>QUESTION SUMMARY</AppText>
            <AppText style={styles.summaryCodeValue}>{shipment.shipmentCode}</AppText>
          </View>

          <TouchableOpacity
            style={styles.askQuestionBtn}
            onPress={handleAskQuestionPress}
            activeOpacity={0.8}
          >
            <AppText style={styles.askQuestionBtnText}>
              {pendingQuestion ? 'View Pending Question' : 'Ask Question'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitOfferBtn}
            onPress={handleSubmitOfferPress}
            activeOpacity={0.85}
          >
            <AppText style={styles.submitOfferBtnText}>Submit Proposal</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Ask Question Custom Modal */}
      <AskQuestionModal
        isVisible={isAskModalVisible}
        onClose={() => setIsAskModalVisible(false)}
        onSubmit={handleSubmitQuestion}
        shipmentCode={shipment.shipmentCode}
        pendingQuestion={pendingQuestion}
        loadingQuestions={loadingQuestions}
      />

      {/* Submit Shipping Offer Custom Modal */}
      <SubmitOfferModal
        isVisible={isSubmitOfferModalVisible}
        onClose={() => setIsSubmitOfferModalVisible(false)}
        shipmentId={shipment._id}
        shipmentCode={shipment.shipmentCode}
      />
    </View>
  );
};

export default ShipperShipmentDetailsScreen;
