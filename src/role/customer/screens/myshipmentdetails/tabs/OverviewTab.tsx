import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  MapPin,
  Calendar,
  Map as MapIcon,
  ChevronDown,
  ExternalLink,
} from 'lucide-react-native';
import moment from 'moment';
import { AppText, Button, MapModal } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import PublishedSuccessModal from '../PublishedSuccessModal';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../api/services/customerService';

const OverviewTab = ({ data,quoteId }: any) => {


 
  const navigation = useNavigation();
  const [isHorseDetailsOpen, setIsHorseDetailsOpen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openUrl = (url: string | null) => {
    if (url) Linking.openURL(url);
  };

  const handlePublish = async (id: string) => {
    setLoading(true);
    try {
      const res = await customerService.publishShipment(id);
      if (res.success) {
        // Show the Success Modal we created earlier
        setIsSuccessModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to publish shipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewShipment = () => {
    setIsSuccessModalVisible(false);
    navigation.goBack(); // Or specific details page
  };

  return (
    <View style={styles.container}>
      {/* 1. Total Horses Bar */}
      <View style={styles.subHeaderBar}>
        <AppText style={styles.subHeaderText}>
          Total horses : {data.numberOfHorses}
        </AppText>
      </View>

      {/* 2. Route Card (Pickup & Delivery) */}
      <View style={styles.card}>
        {/* Pickup */}
        <View style={styles.routeItem}>
          <MapPin size={22} color={COLORS.textSecondary} />
          <View style={styles.routeInfo}>
            <AppText style={styles.routeTitle}>Pickup</AppText>
            <AppText style={styles.routeAddress}>{data.pickupLocation}</AppText>
            <View style={styles.routeDateRow}>
              <Calendar size={18} color={COLORS.textSecondary} />
              <AppText style={styles.routeDate}>
                On {moment(data.pickupDateRange.start).format('MMMM DD, YYYY')}
              </AppText>
            </View>
          </View>
        </View>

        {/* Delivery */}
        <View style={[styles.routeItem, { marginTop: SPACING.xl }]}>
          <MapPin size={22} color={COLORS.textSecondary} />
          <View style={styles.routeInfo}>
            <AppText style={styles.routeTitle}>Delivery</AppText>
            <AppText style={styles.routeAddress}>
              {data.deliveryLocation}
            </AppText>
            <View style={styles.routeDateRow}>
              <Calendar size={18} color={COLORS.textSecondary} />
              <AppText style={styles.routeDate}>
                before{' '}
                {moment(data.deliveryDateRange.end).format('MMMM DD, YYYY')}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewMapBtn}
          onPress={() => setIsMapVisible(true)}
        >
          <MapIcon size={18} color={COLORS.white} />
          <AppText style={styles.viewMapText}>View Map</AppText>
        </TouchableOpacity>
      </View>

      {/* 3. Horse Details Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsHorseDetailsOpen(!isHorseDetailsOpen)}
      >
        <AppText style={styles.accordionTitle}>Horse Details</AppText>
        <ChevronDown
          size={24}
          color={COLORS.textPrimary}
          style={{
            transform: [{ rotate: isHorseDetailsOpen ? '180deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {/* 4. Documents Card */}
      <View style={styles.card}>
        <AppText style={styles.sectionTitle}>Documents</AppText>

        {data.horses.map((horse: any, index: number) => (
          <View key={index} style={styles.documentGroup}>
            <AppText style={styles.horseNameLabel}>Horse {index + 1}</AppText>

            <View style={styles.docItem}>
              <AppText style={styles.docName}>Coggins.pdf</AppText>
              <TouchableOpacity
                onPress={() => openUrl(horse.documents.coggins.url)}
              >
                <ExternalLink size={18} color={COLORS.goldPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <View style={styles.docItem}>
              <AppText style={styles.docName}>Health certificate.pdf</AppText>
              <TouchableOpacity
                onPress={() => openUrl(horse.documents.healthCertificate.url)}
              >
                <ExternalLink size={18} color={COLORS.goldPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.addDocBtn}>
            <AppText style={styles.addDocText}>Add document</AppText>
          </TouchableOpacity>

          {data?.publish === false && (
            <TouchableOpacity
              onPress={() => handlePublish(data?._id)}
              style={styles.addDocBtn}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <AppText style={styles.addDocText}>Publish</AppText>
              )}
            </TouchableOpacity>
          )}
        </View>
        {data.status === 'assigned' && (
          <Button
            title="Track Shipment"
            onPress={() =>
              navigation.navigate('LiveTracking', { shipmentId: quoteId })
            }
          />
        )}
      </View>

      <PublishedSuccessModal
        visible={isSuccessModalVisible}
        onClose={() => {
          setIsSuccessModalVisible(false);
          navigation.goBack(); // Return to home if they just close
        }}
        onViewShipment={handleViewShipment}
      />

      <MapModal
        visible={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        distance={data.estimatedDistance || '1,240 mi'}
        pickupCoords={data.pickupCoords}
        deliveryCoords={data.deliveryCoords}
        shipmentData={{
          pickupLocation: data.pickupLocation,
          deliveryLocation: data.deliveryLocation,
          status: data.status,
          // estimatedTime: '3 days 4 hours', // Optional logic
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.xs,
  },
  subHeaderText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginTop: SPACING.md,
  },
  routeItem: { flexDirection: 'row', gap: SPACING.md },
  routeInfo: { flex: 1 },
  routeTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  routeAddress: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  routeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  routeDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  viewMapBtn: {
    backgroundColor: COLORS.goldPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xl,
    width: 140,
    gap: SPACING.sm,
  },
  viewMapText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },

  // Accordion
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.xs,
  },
  accordionTitle: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },

  // Documents Section
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.lg,
    color: COLORS.textPrimary,
  },
  documentGroup: { marginBottom: SPACING.sm },
  horseNameLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  docName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
  },
  addDocBtn: {
    backgroundColor: COLORS.goldPrimary,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.lg,
    width: 160,
  },
  addDocText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});

export default OverviewTab;
