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
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
  ICON_SIZE,
} from '../../../../../constants';
import PublishedSuccessModal from '../PublishedSuccessModal';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../api/services/customerService';

const OverviewTab = ({ data, quoteId }: any) => {
  const navigation = useNavigation<any>();
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
    navigation.goBack();
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
          <MapPin size={ICON_SIZE.sm} color={COLORS.textSecondary} />
          <View style={styles.routeInfo}>
            <AppText style={styles.routeTitle}>Pickup</AppText>
            <AppText style={styles.routeAddress}>{data.pickupLocation}</AppText>
            <View style={styles.routeDateRow}>
              <Calendar size={ICON_SIZE.xs} color={COLORS.textSecondary} />
              <AppText style={styles.routeDate}>
                On {moment(data.pickupDateRange?.start).format('MMMM DD, YYYY')}
              </AppText>
            </View>
          </View>
        </View>

        {/* Delivery */}
        <View style={[styles.routeItem, { marginTop: SPACING.md }]}>
          <MapPin size={ICON_SIZE.sm} color={COLORS.textSecondary} />
          <View style={styles.routeInfo}>
            <AppText style={styles.routeTitle}>Delivery</AppText>
            <AppText style={styles.routeAddress}>
              {data.deliveryLocation}
            </AppText>
            <View style={styles.routeDateRow}>
              <Calendar size={ICON_SIZE.xs} color={COLORS.textSecondary} />
              <AppText style={styles.routeDate}>
                before{' '}
                {moment(data.deliveryDateRange?.end).format('MMMM DD, YYYY')}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewMapBtn}
          onPress={() => setIsMapVisible(true)}
        >
          <MapIcon size={ICON_SIZE.sm} color={COLORS.white} />
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
          size={ICON_SIZE.sm}
          color={COLORS.textPrimary}
          style={{
            transform: [{ rotate: isHorseDetailsOpen ? '180deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {/* 4. Documents Card */}
      <View style={styles.card}>
        <AppText style={styles.sectionTitle}>Documents</AppText>

        {data.horses?.map((horse: any, index: number) => (
          <View key={index} style={styles.documentGroup}>
            <AppText style={styles.horseNameLabel}>Horse {index + 1}</AppText>

            <View style={styles.docItem}>
              <AppText style={styles.docName}>Coggins.pdf</AppText>
              <TouchableOpacity
                onPress={() => openUrl(horse.documents?.coggins?.url)}
              >
                <ExternalLink size={ICON_SIZE.sm} color={COLORS.goldPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <View style={styles.docItem}>
              <AppText style={styles.docName}>Health certificate.pdf</AppText>
              <TouchableOpacity
                onPress={() => openUrl(horse.documents?.healthCertificate?.url)}
              >
                <ExternalLink size={ICON_SIZE.sm} color={COLORS.goldPrimary} />
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
                <ActivityIndicator color={COLORS.white} />
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
            buttonStyle={{ marginTop: SPACING.sm }}
          />
        )}
      </View>

      <PublishedSuccessModal
        visible={isSuccessModalVisible}
        onClose={() => {
          setIsSuccessModalVisible(false);
          navigation.goBack();
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
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: SPACING.xl },
  subHeaderBar: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  subHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginTop: SPACING.sm,
  },
  routeItem: { flexDirection: 'row', gap: SPACING.sm },
  routeInfo: { flex: 1 },
  routeTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  routeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  routeDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  viewMapBtn: {
    backgroundColor: COLORS.goldPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
    gap: SPACING.xs,
  },
  viewMapText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },

  // Accordion
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xs,
  },
  accordionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },

  // Documents Section
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
  },
  documentGroup: { marginBottom: SPACING.xs },
  horseNameLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.medium,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  docName: {
    fontSize: FONT_SIZE.sm,
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
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.md,
    minWidth: 120,
  },
  addDocText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
  },
});

export default OverviewTab;
