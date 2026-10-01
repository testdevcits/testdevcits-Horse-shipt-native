import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../../components/common/AppText';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { COLORS, FONTS } from '../../../../constants';
import styles from './styles.shipmentdetails';
import { DriverShipmentItem, Horse } from '../../../../types/driver';
import { horsePlaceholderImage, GOOGLE_MAPS_APIKEY } from '../../../../config/constants';

const DynamicHorseImage: React.FC<{ url?: string | null }> = ({ url }) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = url && !imageError ? url : horsePlaceholderImage;

  return (
    <Image
      source={{ uri: imageUri }}
      style={styles.horseImage}
      onError={() => setImageError(true)}
    />
  );
};

const ShipmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Extract shipment item passed via navigation route params (No API call needed)
  const rawShipment: DriverShipmentItem = route.params?.shipment || {};
  const shipment = rawShipment?.shipment || rawShipment;

  const rootId = rawShipment?._id || shipment?._id;
  const displayTripId = rootId ? `TRIP #${rootId.slice(0, 8).toUpperCase()}` : 'TRIP MANIFEST';

  const totalPrice =
    rawShipment?.totalPrice != null
      ? `$ ${rawShipment.totalPrice.toLocaleString()}`
      : null;

  const tripStatus = rawShipment?.tripStatus || rawShipment?.status || 'completed';
  const paymentStatus = rawShipment?.paymentStatus
    ? rawShipment.paymentStatus.toUpperCase()
    : null;

  // Locations & Coordinates
  const pickupLoc = shipment?.pickupLocation || 'Pickup location unavailable';
  const deliveryLoc = shipment?.deliveryLocation || 'Delivery location unavailable';

  const pickupLat = shipment?.pickupCoords?.latitude ?? shipment?.pickupLat;
  const pickupLng = shipment?.pickupCoords?.longitude ?? shipment?.pickupLng;

  const deliveryLat = shipment?.deliveryCoords?.latitude ?? shipment?.deliveryLat;
  const deliveryLng = shipment?.deliveryCoords?.longitude ?? shipment?.deliveryLng;

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
  const horsesList: Horse[] = Array.isArray(shipment?.horses) ? shipment.horses : [];
  const firstHorse: Horse | undefined = horsesList[0];

  // Vehicle Info
  const vehicle = rawShipment?.vehicle;
  const vehicleNumber = vehicle?.vehicleNumber;
  const vehicleType = vehicle?.vehicleType || rawShipment?.transportType || 'Trucking';
  const stallsRequired = rawShipment?.stallsRequired;

  // Additional Notes
  const shipmentNotes = rawShipment?.notes?.trim();

  // Documents Array Extraction
  const docsList: { title: string; subtitle: string; url: string | null }[] = [];
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

  const handleOpenDoc = (url: string | null) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.log('Could not open document URL:', err),
      );
    }
  };

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
        <View style={styles.mapCard}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            toolbarEnabled={false}
          >
            {/* Origin Marker */}
            {pickupLat != null && pickupLng != null && (
              <Marker
                coordinate={{ latitude: pickupLat, longitude: pickupLng }}
                title="Origin"
                description={pickupLoc}
              >
                <View style={styles.markerCircleGreen}>
                  <AppIcon name="MapPin" size={14} color={COLORS.white} />
                </View>
              </Marker>
            )}

            {/* Destination Marker */}
            {deliveryLat != null && deliveryLng != null && (
              <Marker
                coordinate={{ latitude: deliveryLat, longitude: deliveryLng }}
                title="Destination"
                description={deliveryLoc}
              >
                <View style={styles.markerCircleRed}>
                  <AppIcon name="MapPin" size={14} color={COLORS.white} />
                </View>
              </Marker>
            )}

            {/* Current GPS Telemetry Marker */}
            {currentLat != null && currentLng != null && (
              <Marker
                coordinate={{ latitude: currentLat, longitude: currentLng }}
                title="Rig Current Position"
                description={`Updated: ${lastUpdated || 'Active'}`}
              >
                <View style={styles.markerCircleBlue}>
                  <AppIcon name="Truck" size={14} color={COLORS.white} />
                </View>
              </Marker>
            )}

            {/* Polyline Route Directions */}
            {pickupLat != null && pickupLng != null && deliveryLat != null && deliveryLng != null && (
              <MapViewDirections
                origin={{ latitude: pickupLat, longitude: pickupLng }}
                destination={{ latitude: deliveryLat, longitude: deliveryLng }}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3.5}
                strokeColor={COLORS.primary}
                lineDashPattern={[0]}
                onError={err => console.log('MapViewDirections error:', err)}
              />
            )}
          </MapView>

          <View style={styles.mapHeaderOverlay}>
            <View style={styles.haulerBadge}>
              <AppIcon name="Truck" size={14} color={COLORS.slate900} />
              <AppText style={styles.haulerText}>{vehicleType}</AppText>
            </View>
          </View>

          {/* Telemetry Ping Floating Bar */}
          {currentLat != null && currentLng != null && (
            <View style={styles.telemetryPingBox}>
              <View style={styles.pingLeft}>
                <View style={styles.pingIconCircle}>
                  <AppIcon name="Radio" size={16} color="#0284C7" />
                </View>
                <View>
                  <AppText style={styles.pingLabel}>GPS TELEMETRY</AppText>
                  <AppText style={styles.pingCoords}>
                    {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
                  </AppText>
                </View>
              </View>

              {lastUpdated && (
                <View style={styles.pingRight}>
                  <AppText style={styles.pingVerifiedTag}>Verified Location</AppText>
                  <AppText style={styles.pingDate}>{lastUpdated}</AppText>
                </View>
              )}
            </View>
          )}
        </View>


        {/* 2. Route Timeline Card */}
        <View style={styles.card}>
          <View style={styles.locationTimelineRow}>
            <View style={styles.timelineGraphic}>
              <View style={styles.dotOrigin} />
              <View style={styles.timelineLine} />
              <View style={styles.dotDestination} />
            </View>

            <View style={styles.locationDetailsCol}>
              {/* Origin */}
              <View style={styles.locationBlock}>
                <AppText style={styles.locationTag}>Origin</AppText>
                <View style={styles.locationHeaderRow}>
                  <AppText style={styles.locationTitle} numberOfLines={2}>
                    {pickupLoc}
                  </AppText>

                </View>
                {pickupLat != null && pickupLng != null && (
                  <AppText style={styles.locationSubtext}>
                    ({pickupLat.toFixed(3)}, {pickupLng.toFixed(3)})
                  </AppText>
                )}
              </View>

              {/* Destination */}
              <View style={styles.locationBlock}>
                <AppText style={styles.locationTagDelivered}>
                  {tripStatus === 'completed' || tripStatus === 'delivered' ? 'Delivered' : 'Destination'}
                </AppText>
                <View style={styles.locationHeaderRow}>
                  <AppText style={styles.locationTitle} numberOfLines={2}>
                    {deliveryLoc}
                  </AppText>

                </View>
                {deliveryLat != null && deliveryLng != null && (
                  <AppText style={styles.locationSubtext}>
                    ({deliveryLat.toFixed(3)}, {deliveryLng.toFixed(3)})
                  </AppText>
                )}
              </View>
            </View>
          </View>

          {/* Trip Summary Row */}
          <View style={styles.tripSummaryRow}>
            <View style={styles.summaryCol}>
              <AppText style={styles.summaryLabel}>Trip State</AppText>
              <AppText style={styles.summaryValue}>
                {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
              </AppText>
            </View>
            {paymentStatus && (
              <View style={styles.summaryCol}>
                <AppText style={styles.summaryLabel}>Payment</AppText>
                <AppText style={[styles.summaryValue, { color: '#92400E' }]}>
                  {paymentStatus}
                </AppText>
              </View>
            )}
            <View style={styles.summaryCol}>
              <AppText style={styles.summaryLabel}>Method</AppText>
              <AppText style={styles.summaryValue}>{vehicleType}</AppText>
            </View>
          </View>
        </View>

        {/* 3. Equine Manifest Card */}
        {horsesList.map((horse: Horse, hIdx: number) => {
          const hName = horse?.registeredName || `Horse #${hIdx + 1}`;
          const bName = horse?.barnName ? `'${horse?.barnName}'` : '';
          const breedStr = horse?.breed;
          const sexStr = horse?.sex;
          const colourStr = horse?.colour;
          const ageStr = horse?.age ? `${horse?.age} Yrs` : null;
          const stallStr = horse?.requestedStallSize;
          const careNoteStr = horse?.generalInfo?.trim() || horse?.notes?.trim();
          const photoUrl = horse?.photo?.url;
          const noteLogEntry = horse?.notesLog?.[0];

          return (
            <View key={hIdx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <AppIcon name="Shield" size={18} color={COLORS.slate900} />
                  <AppText style={styles.cardTitle}>
                    Equine Manifest {horsesList.length > 1 ? `#${hIdx + 1}` : ''}
                  </AppText>
                </View>
                {stallStr ? (
                  <View style={styles.badgeTagAmber}>
                    <AppText style={styles.badgeTagAmberText}>
                      {stallStr} Reserved
                    </AppText>
                  </View>
                ) : null}
              </View>

              {/* Horse Main Info */}
              <View style={styles.horseCardInner}>
                <DynamicHorseImage url={photoUrl} />

                <View style={styles.horseMainInfo}>

                  <AppText style={styles.horseTitle}>
                    {hName}{' '}
                    {bName ? (
                      <AppText style={{ fontSize: 13, color: COLORS.slate600, fontFamily: FONTS.regular }}>
                        {bName}
                      </AppText>
                    ) : null}
                  </AppText>
                  {breedStr ? (
                    <AppText style={styles.horseSubtitle}>{breedStr}</AppText>
                  ) : null}

                  <View style={styles.pillRow}>
                    {sexStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>{sexStr}</AppText>
                      </View>
                    ) : null}
                    {colourStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>{colourStr}</AppText>
                      </View>
                    ) : null}
                    {ageStr ? (
                      <View style={styles.characteristicPill}>
                        <AppText style={styles.characteristicText}>{ageStr}</AppText>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Special Care Note */}
              {careNoteStr ? (
                <View style={styles.careNoteBox}>
                  <View style={styles.careNoteHeader}>
                    <AppIcon name="AlertCircle" size={14} color="#1E40AF" />
                    <AppText style={styles.careNoteTitle}>Special Care & Instructions</AppText>
                  </View>
                  <AppText style={styles.careNoteText}>"{careNoteStr}"</AppText>
                </View>
              ) : null}

              {/* Customer / Shipper Note Log Entry */}
              {noteLogEntry ? (
                <View style={styles.signOffRow}>
                  <View style={styles.avatarCircle}>
                    <AppText style={styles.avatarInitials}>
                      {(noteLogEntry.userName || 'C').charAt(0).toUpperCase()}
                    </AppText>
                  </View>
                  <View style={styles.signOffInfo}>
                    <AppText style={styles.signOffName}>
                      {noteLogEntry.userName || 'Customer'} ({noteLogEntry.userRole || 'customer'})
                    </AppText>
                    <AppText style={styles.signOffSub}>
                      {noteLogEntry.note || 'Shipper manifest verified'}
                    </AppText>
                  </View>
                  <AppIcon name="CheckCircle" size={20} color="#10B981" />
                </View>
              ) : null}
            </View>
          );
        })}

        {/* 4. Rig & Vehicle Information Card */}
        {vehicleNumber || stallsRequired ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon name="Truck" size={18} color={COLORS.slate900} />
                <AppText style={styles.cardTitle}>Rig & Transport Details</AppText>
              </View>
              {vehicleNumber && (
                <AppText style={{ fontFamily: FONTS.bold, fontSize: 12, color: COLORS.slate600 }}>
                  {vehicleNumber}
                </AppText>
              )}
            </View>

            {stallsRequired != null && (
              <View style={styles.capacityRow}>
                <AppIcon name="Box" size={16} color={COLORS.slate600} />
                <AppText style={styles.capacityText}>
                  Stalls Required Allocation:{' '}
                  <AppText style={styles.capacityValue}>
                    {stallsRequired} Stalls
                  </AppText>
                </AppText>
              </View>
            )}

            {shipmentNotes ? (
              <View style={[styles.careNoteBox, { marginTop: 10 }]}>
                <View style={styles.careNoteHeader}>
                  <AppIcon name="Info" size={14} color="#92400E" />
                  <AppText style={[styles.careNoteTitle, { color: '#92400E' }]}>
                    Additional Shipment Notes
                  </AppText>
                </View>
                <AppText style={[styles.careNoteText, { color: '#78350F' }]}>
                  "{shipmentNotes}"
                </AppText>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 5. Digital Equine Passport Documents */}
        {docsList.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <AppIcon name="Shield" size={18} color={COLORS.slate900} />
                <AppText style={styles.cardTitle}>Digital Equine Passport</AppText>
              </View>
              <View style={styles.badgeTagGreen}>
                <AppText style={styles.badgeTagGreenText}>
                  {docsList.length} Verified
                </AppText>
              </View>
            </View>

            {docsList.map((doc, dIdx) => (
              <TouchableOpacity
                key={dIdx}
                style={styles.docRow}
                activeOpacity={0.7}
                onPress={() => handleOpenDoc(doc.url)}
              >
                <View style={styles.docIconTile}>
                  <AppIcon name="FileText" size={18} color={COLORS.slate900} />
                </View>
                <View style={styles.docInfo}>
                  <AppText style={styles.docTitle}>{doc.title}</AppText>
                  <AppText style={styles.docSubtext}>{doc.subtitle}</AppText>
                </View>
                <AppIcon name="ExternalLink" size={16} color={COLORS.slate700} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShipmentDetailsScreen;


