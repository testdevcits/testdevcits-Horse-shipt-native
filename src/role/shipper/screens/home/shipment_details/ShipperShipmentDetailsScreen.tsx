import React, { useState, useEffect, lazy, Suspense } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Share } from 'react-native';

import { formatDate } from '../../../../../utils/helpers';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppHeader, AppText } from '../../../../../components';
import { COLORS } from '../../../../../constants';
import imageIndex from '../../../../../assets/images/imageIndex';
import shipperService from '../../../../../api/services/shipperService';
import styles from './styles.shippershipmentdetails';
import useStripeStatus from '../../../../../hooks/useStripeStatus';
import ConnectBankModal from '../components/ConnectBankModal';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import AppButton from '../../../../../components/common/Button/AppButton';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import { ShipmentDetailMapCard } from './components/ShipmentDetailMapCard';
import { ShipmentEquineListCard } from './components/ShipmentEquineListCard';

const AskQuestionModal = lazy(
  () => import('../components/ask_question/AskQuestionModal'),
);
const SubmitOfferModal = lazy(
  () => import('../components/submit_offer_modal/SubmitOfferModal'),
);

const ShipperShipmentDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { isStripeReady, loading } = useStripeStatus();
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  // console.log("======ShipmentDetails checkStripeStatus======", isStripeReady, loading)

  // Extract shipment from route params or fallback to default sample payload
  const shipment = route.params?.shipment || {};

  const [isMapVisible, setIsMapVisible] = useState(true);

  // Questions State
  const [isAskModalVisible, setIsAskModalVisible] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<any>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Submit Offer Modal State
  const [isSubmitOfferModalVisible, setIsSubmitOfferModalVisible] =
    useState(false);

  const fetchQuestions = async () => {
    if (!shipment?._id) return;
    setLoadingQuestions(true);
    try {
      const res = await shipperService.getShipmentQuestions(shipment?._id);
      if (res?.success && res?.data?.pending) {
        if (res?.data?.pending.length > 0) {
          setPendingQuestion(res?.data?.pending[0]);
        } else {
          setPendingQuestion(null);
        }
        if (res?.data?.answered.length > 0) {
          setAnsweredQuestion(res?.data?.answered[0]);
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
  }, [shipment?._id]);

  // Horses List
  const horsesList: any[] =
    Array.isArray(shipment?.horses) && shipment.horses.length > 0
      ? shipment.horses
      : [shipment];

  const [expandedHorseIndices, setExpandedHorseIndices] = useState<number[]>(
    horsesList.map((_, idx) => idx),
  );

  const toggleHorseExpanded = (index: number) => {
    setExpandedHorseIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    );
  };

  // First Horse Summary for Hero & Spec Cards
  const firstHorse = horsesList[0] || {};
  const horsePhoto =
    typeof firstHorse?.photo === 'string'
      ? firstHorse.photo
      : firstHorse?.photo?.url || null;
  const heroRegisteredName = firstHorse?.registeredName || 'Not Available';
  const heroBarnName = firstHorse?.barnName || 'Not Available';
  const heroBreed = firstHorse?.breed || 'Not Available';
  const heroSex = firstHorse?.sex || 'Not Available';
  const heroColour = firstHorse?.colour || firstHorse?.color || 'Not Available';
  const heroAge =
    firstHorse?.age !== undefined && firstHorse?.age !== null
      ? firstHorse.age
      : 'Not Available';
  const heroStallSize =
    firstHorse?.requestedStallSize || firstHorse?.stallSize || 'Not Available';

  // Dates
  const pickupDateFormatted = shipment?.pickupDateRange?.start
    ? formatDate(shipment?.pickupDateRange.start, 'MMM DD').toUpperCase()
    : 'Not Available';
  const deliveryDateFormatted = shipment?.deliveryDateRange?.start
    ? formatDate(shipment?.deliveryDateRange.start, 'MMM DD').toUpperCase()
    : 'Not Available';
  const postedDateFormatted = shipment?.publishedAt
    ? formatDate(shipment?.publishedAt, 'MMM D, YYYY')
    : 'Not Available';

  // Distance & Specs
  const distanceMiles = shipment?.estimatedDistance?.miles
    ? Number(shipment?.estimatedDistance.miles).toFixed(2)
    : '2664.22';
  const distanceKm = shipment?.estimatedDistance?.km
    ? Number(shipment?.estimatedDistance.km).toFixed(2)
    : '4287.65';

  // Coords & Region
  const pLat =
    shipment?.pickupCoords?.latitude ||
    shipment?.pickupCoords?.lat ||
    25.2479758;
  const pLng =
    shipment?.pickupCoords?.longitude ||
    shipment?.pickupCoords?.lng ||
    55.3525527;
  const dLat =
    shipment?.deliveryCoords?.latitude ||
    shipment?.deliveryCoords?.lat ||
    56.879635;
  const dLng =
    shipment?.deliveryCoords?.longitude ||
    shipment?.deliveryCoords?.lng ||
    24.603189;

  const mapRegion = {
    latitude: (pLat + dLat) / 2,
    longitude: (pLng + dLng) / 2,
    latitudeDelta: Math.max(Math.abs(pLat - dLat) * 1.4, 0.5),
    longitudeDelta: Math.max(Math.abs(pLng - dLng) * 1.4, 0.5),
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shipment Details ${shipment?.shipmentCode}: Pickup ${shipment?.pickupLocation} to ${shipment?.deliveryLocation}`,
      });
    } catch (_e) {
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
        shipmentId: shipment?._id,
        question,
      };
      const res = await shipperService.askQuestion(payload);
      if (res?.success) {
        showSuccessToast(
          'Success',
          res.message || 'Question submitted successfully',
        );
        if (res?.data) {
          setPendingQuestion(res?.data);
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
    if (!isStripeReady && !loading) {
      setIsBankModalVisible(true);
    } else {
      setIsSubmitOfferModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="SHIPMENT DETAILS"
        showBack
        onBack={() => navigation.goBack()}
        showProfileImage={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Sub Row: Status Pill & Posted Date */}
        <View style={styles.headerSubRow}>
          <View style={styles.statusBadgePill}>
            <AppText style={styles.statusBadgeText}>
              {(shipment?.status || 'Not Available').replace(/_/g, ' ')}
            </AppText>
          </View>
          <AppText style={styles.postedDateText}>
            Posted on {postedDateFormatted}
          </AppText>
        </View>

        {/* 1. Hero Horse Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBannerContainer}>
            {horsePhoto ? (
              <Image
                source={{ uri: horsePhoto }}
                style={styles.heroBannerImage}
              />
            ) : (
              <Image
                source={imageIndex?.Banner}
                style={styles.heroBannerImage}
              />
            )}
            <View style={styles.heroBannerBadge}>
              <AppText style={styles.heroBannerBadgeText}>
                {(shipment?.status || 'Not Available').replace(/_/g, ' ')}
              </AppText>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.horseCountTag}>
              <AppText style={styles.horseCountTagText}>
                Horse {shipment?.horses?.length || '0'}
              </AppText>
            </View>

            <AppText style={styles.heroTitle}>
              {heroRegisteredName} ( {heroBarnName} )
            </AppText>
            <AppText style={styles.heroSubtitle}>
              {heroBreed} • {heroAge} yrs • {heroSex} • {heroColour}
            </AppText>
            <AppText style={styles.shipmentCodeText}>
              {shipment?.shipmentCode}
            </AppText>

            <View style={styles.customerRow}>
              <AppText style={styles.customerNameText}>
                Customer: {shipment?.customer?.name || 'Not Available'}
              </AppText>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <AppIcon name="Share2" size={14} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Date Cards Row */}
            <View style={styles.dateCardsRow}>
              <View style={styles.dateCard}>
                <AppText style={styles.dateCardLabel}>PICKUP</AppText>
                <AppText style={styles.dateCardValue}>
                  {pickupDateFormatted}
                </AppText>
              </View>

              <View style={styles.dateCard}>
                <AppText style={styles.dateCardLabel}>DELIVERY</AppText>
                <AppText style={styles.dateCardValue}>
                  {deliveryDateFormatted}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Shipment Route Map Card */}
        <ShipmentDetailMapCard
          shipment={shipment}
          isMapVisible={isMapVisible}
          setIsMapVisible={setIsMapVisible}
          pLat={pLat}
          pLng={pLng}
          dLat={dLat}
          dLng={dLng}
          mapRegion={mapRegion}
          navigation={navigation}
        />

        {/* 3. 4-Grid Spec Cards */}
        <View style={styles.gridContainer}>
          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Compass" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>DISTANCE</AppText>
              <AppText style={styles.specStatValue}>{distanceMiles} mi</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>HORSES</AppText>
              <AppText style={styles.specStatValue}>
                {shipment?.numberOfHorses || 1}
              </AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{heroStallSize}</AppText>
            </View>
          </View>

          <View style={styles.specStatCard}>
            <View style={styles.specStatIconBox}>
              <AppIcon name="Box" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.specStatTextCol}>
              <AppText style={styles.specStatLabel}>STALL</AppText>
              <AppText style={styles.specStatValue}>{heroStallSize}</AppText>
            </View>
          </View>
        </View>

        {/* 4. Route Information Card */}
        <View style={styles.routeInfoCard}>
          <View style={styles.cardTitleRow}>
            <AppIcon name="Compass" size={18} color={COLORS.saddleBrown} />
            <AppText style={styles.cardHeaderTitle}>Route Information</AppText>
          </View>

          <View style={styles.timelineContainer}>
            {/* Pickup Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxPickup}>
                <AppIcon name="MapPin" size={16} color={COLORS.saddleBrown} />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>PICKUP LOCATION</AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment?.pickupLocation || 'Not Available'}
                </AppText>
              </View>
            </View>

            {/* Connecting Vertical Line */}
            <View style={styles.timelineLine} />

            {/* Delivery Node */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineIconBoxDelivery}>
                <AppIcon name="Flag" size={16} color={COLORS.saddleBrown} />
              </View>

              <View style={styles.timelineTextCol}>
                <AppText style={styles.timelineLabel}>
                  DELIVERY LOCATION
                </AppText>
                <AppText style={styles.timelineAddress}>
                  {shipment?.deliveryLocation || 'Not Available'}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.totalDistanceContainer}>
            <AppText style={styles.totalDistanceLabel}>TOTAL DISTANCE</AppText>
            <AppText style={styles.totalDistanceValue}>
              {distanceMiles}{' '}
              <AppText style={styles.totalDistanceSub}>
                miles ({distanceKm} km)
              </AppText>
            </AppText>
          </View>
        </View>

        {isMapVisible === false && (
          <AppButton title="Open Map" onPress={() => setIsMapVisible(true)} />
        )}

        {/* 5. Horse Details Accordion Cards for All Horses */}
        <ShipmentEquineListCard
          horsesList={horsesList}
          expandedHorseIndices={expandedHorseIndices}
          toggleHorseExpanded={toggleHorseExpanded}
        />

        {/* 6. Ready to Respond CTA Card */}
        <View style={styles.ctaCard}>
          <AppText style={styles.ctaTitle}>Ready to Respond</AppText>
          <AppText style={styles.ctaSub}>
            Do you have questions about this shipment, or are you ready to
            submit a binding proposal, providing your professional offer?
          </AppText>

          <View style={styles.summaryCodeBox}>
            <AppText style={styles.summaryCodeLabel}>QUESTION SUMMARY</AppText>
            <AppText style={styles.summaryCodeValue}>
              {shipment?.shipmentCode}
            </AppText>
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
      <Suspense fallback={null}>
        <AskQuestionModal
          isVisible={isAskModalVisible}
          onClose={() => setIsAskModalVisible(false)}
          onSubmit={handleSubmitQuestion}
          shipmentCode={shipment?.shipmentCode}
          pendingQuestion={pendingQuestion}
          loadingQuestions={loadingQuestions}
          answeredQuestion={answeredQuestion}
        />
      </Suspense>

      {/* Submit Shipping Offer Custom Modal */}
      <Suspense fallback={null}>
        <SubmitOfferModal
          isVisible={isSubmitOfferModalVisible}
          onClose={() => setIsSubmitOfferModalVisible(false)}
          shipmentId={shipment?._id}
          shipmentCode={shipment?.shipmentCode}
        />
      </Suspense>

      {!loading && !isStripeReady && (
        <ConnectBankModal
          isVisible={isBankModalVisible}
          onClose={() => setIsBankModalVisible(false)}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default ShipperShipmentDetailsScreen;
