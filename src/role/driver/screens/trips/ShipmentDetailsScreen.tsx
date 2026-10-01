import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../../components/common/AppText';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../constants';
import styles from './styles.shipmentdetails';
import { DriverTripMapCard } from './components/DriverTripMapCard';
import { DriverTripTimelineCard } from './components/DriverTripTimelineCard';
import { DriverTripManifestCard } from './components/DriverTripManifestCard';
import { DriverTripRigDetailsCard } from './components/DriverTripRigDetailsCard';
import { DriverTripPassportDocsCard } from './components/DriverTripPassportDocsCard';
import { DriverShipmentItem, Horse } from '../../../../types/driver';

const ShipmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Extract shipment item passed via navigation route params (No API call needed)
  const rawShipment: DriverShipmentItem = route.params?.shipment || {};
  const shipment = rawShipment?.shipment || rawShipment;

  const rootId = rawShipment?._id || shipment?._id;
  const displayTripId = rootId
    ? `TRIP #${rootId.slice(0, 8).toUpperCase()}`
    : 'TRIP MANIFEST';

  const totalPrice =
    rawShipment?.totalPrice != null
      ? `$ ${rawShipment.totalPrice.toLocaleString()}`
      : null;

  const tripStatus =
    rawShipment?.tripStatus || rawShipment?.status || 'completed';
  const paymentStatus = rawShipment?.paymentStatus
    ? rawShipment.paymentStatus.toUpperCase()
    : null;

  // Locations & Coordinates
  const pickupLoc = shipment?.pickupLocation || 'Pickup location unavailable';
  const deliveryLoc =
    shipment?.deliveryLocation || 'Delivery location unavailable';

  const pickupLat = shipment?.pickupCoords?.latitude ?? shipment?.pickupLat;
  const pickupLng = shipment?.pickupCoords?.longitude ?? shipment?.pickupLng;

  const deliveryLat =
    shipment?.deliveryCoords?.latitude ?? shipment?.deliveryLat;
  const deliveryLng =
    shipment?.deliveryCoords?.longitude ?? shipment?.deliveryLng;

  // Current Location Telemetry
  const currentLocation = shipment?.currentLocation;
  const currentLat = currentLocation?.latitude ?? pickupLat;
  const currentLng = currentLocation?.longitude ?? pickupLng;
  const lastUpdated = currentLocation?.updatedAt
    ? new Date(currentLocation.updatedAt).toLocaleDateString()
    : null;

  // Compute map region dynamically to encompass pickup & delivery
  const mapRegion = useMemo(() => {
    const pLat = pickupLat ?? 22.7195687;
    const pLng = pickupLng ?? 75.8577258;
    const dLat = deliveryLat ?? 22.9675929;
    const dLng = deliveryLng ?? 76.0534454;

    const midLat = (pLat + dLat) / 2;
    const midLng = (pLng + dLng) / 2;
    const latDelta = Math.max(Math.abs(pLat - dLat) * 1.6, 0.12);
    const lngDelta = Math.max(Math.abs(pLng - dLng) * 1.6, 0.12);

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng]);

  // Horse List
  const horsesList: Horse[] = Array.isArray(shipment?.horses)
    ? shipment.horses
    : [];
  const firstHorse: Horse | undefined = horsesList[0];

  // Vehicle Info
  const vehicle = rawShipment?.vehicle;
  const vehicleNumber = vehicle?.vehicleNumber;
  const vehicleType =
    vehicle?.vehicleType || rawShipment?.transportType || 'Trucking';
  const stallsRequired = rawShipment?.stallsRequired;

  // Additional Notes
  const shipmentNotes = rawShipment?.notes?.trim();

  // Documents Array Extraction
  const docsList: { title: string; subtitle: string; url: string | null }[] =
    [];
  if (firstHorse?.documents) {
    if (firstHorse.documents.coggins?.url) {
      docsList.push({
        title: 'Coggins Test Certificate',
        subtitle: 'Coggins Document Verified',
        url: firstHorse.documents.coggins.url,
      });
    }
    if (firstHorse.documents.healthCertificate?.url) {
      docsList.push({
        title: 'Veterinary Health Certificate',
        subtitle: 'Health Certificate Verified',
        url: firstHorse.documents.healthCertificate.url,
      });
    }
    if (firstHorse.documents.other?.url) {
      docsList.push({
        title: 'Transit Authorization Form',
        subtitle: 'Other Document Attached',
        url: firstHorse.documents.other.url,
      });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FA" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <AppIcon name="ArrowLeft" size={22} color={COLORS.slate900} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Shipment Details</AppText>
        </View>

        <View style={styles.brandBadge}>
          <AppIcon name="Shield" size={18} color={COLORS.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Sub-Header Badges & Price */}
        <View style={styles.subHeaderRow}>
          <View style={styles.tripIdBadge}>
            <AppText style={styles.tripIdText}>{displayTripId}</AppText>
          </View>

          <View style={styles.statusBadgeCompleted}>
            <View style={styles.statusDotGreen} />
            <AppText style={styles.statusTextCompleted}>
              {tripStatus.toUpperCase()}
            </AppText>
          </View>

          {totalPrice && (
            <AppText style={styles.priceText}>{totalPrice}</AppText>
          )}
        </View>

        {/* 1. Real Interactive Google Map Card */}
        <DriverTripMapCard
          mapRegion={mapRegion}
          pickupLat={pickupLat}
          pickupLng={pickupLng}
          pickupLoc={pickupLoc}
          deliveryLat={deliveryLat}
          deliveryLng={deliveryLng}
          deliveryLoc={deliveryLoc}
          currentLat={currentLat}
          currentLng={currentLng}
          lastUpdated={lastUpdated}
          vehicleType={vehicleType}
        />

        {/* 2. Route Timeline Card */}
        <DriverTripTimelineCard
          pickupLoc={pickupLoc}
          pickupLat={pickupLat}
          pickupLng={pickupLng}
          deliveryLoc={deliveryLoc}
          deliveryLat={deliveryLat}
          deliveryLng={deliveryLng}
          tripStatus={tripStatus}
          paymentStatus={paymentStatus}
          vehicleType={vehicleType}
        />

        {/* 3. Equine Manifest Card */}
        <DriverTripManifestCard horsesList={horsesList} />

        {/* 4. Rig & Vehicle Information Card */}
        <DriverTripRigDetailsCard
          vehicleNumber={vehicleNumber}
          stallsRequired={stallsRequired}
          shipmentNotes={shipmentNotes}
        />

        {/* 5. Digital Equine Passport Documents */}
        <DriverTripPassportDocsCard docsList={docsList} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShipmentDetailsScreen;
