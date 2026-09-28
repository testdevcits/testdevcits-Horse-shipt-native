import React, { lazy, Suspense, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';

import { formatDate } from '../../../../../../utils/helpers';
import { AppText } from '../../../../../../components';
import { COLORS } from '../../../../../../constants';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../../api/services/customerService';
import { fetchCustomerShipments } from '../../../../../../redux/slices/customerShipmentSlice';
import { useAppDispatch } from '../../../../../../hooks/redux';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import styles from './styles.OverViewTab';
import { showErrorToast } from '../../../../../../utils/toast';
import ShipmentStatusTimeline from './ShipmentStatusTimeline';
import HorseDetailsList from './HorseDetailsList';

const PublishedSuccessModal = lazy(
  () => import('../../components/publish_success_modal/PublishedSuccessModal'),
);
const MapModal = lazy(
  () => import('../../../../../../components/common/MapModal/MapModal'),
);

const OverviewTab = ({ data, quoteId, onReview }: any) => {
  const navigation = useNavigation<any>();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const openUrl = (url: string | null) => {
    if (url) Linking.openURL(url);
  };

  const handlePublish = async (id: string) => {
    setLoading(true);
    try {
      const res = await customerService.publishShipment(id);
      if (res?.success) {
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          dispatch(fetchCustomerShipments());
        }, 1000);
      }
    } catch (_error) {
      showErrorToast('Error', 'Failed to publish shipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocumentsNotes = async () => {
    if (!data?._id) return;
    setLoading(true);
    try {
      const res: any = await customerService.getShipmentById(data._id);
      const fetchedShipment =
        res?.shipment || res?.data?.shipment || res?.data || data;
      navigation.navigate('NewShipment', {
        isEdit: true,
        shipmentData: fetchedShipment,
      });
    } catch (err) {
      console.log('Error fetching shipment details for edit:', err);
      navigation.navigate('NewShipment', {
        isEdit: true,
        shipmentData: data,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return 'N/A';
    const s = start ? formatDate(start, 'MMM DD, YYYY') : '';
    const e = end ? formatDate(end, 'MMM DD, YYYY') : '';
    if (s && e) return `${s} - ${e}`;
    return s || e;
  };

  return (
    <View style={styles.container}>
      {/* 1. TOP OVERVIEW CARD */}
      <View style={styles.topCard}>
        {/* Header Row: Title & Status */}
        <View style={styles.topHeaderRow}>
          <AppText style={styles.topCardTitle}>Overview</AppText>
          <View style={styles.statusBadge}>
            <AppText style={styles.statusBadgeText}>
              {(data?.status || 'Not Available').toUpperCase()}
            </AppText>
          </View>
        </View>

        {/* Route Timeline (Pickup to Delivery) */}
        <ShipmentStatusTimeline
          pickupLocation={data?.pickupLocation}
          pickupDateRange={data?.pickupDateRange}
          deliveryLocation={data?.deliveryLocation}
          deliveryDateRange={data?.deliveryDateRange}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {data?.status !== 'delivered' && data?.status !== 'assigned' && (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleEditDocumentsNotes}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <AppIcon name={'Edit3'} size={15} color={COLORS.white} />
                  <AppText style={styles.primaryActionBtnText}>
                    {/* Edit Documents & Notes */}
                    Edit Docs / Notes
                  </AppText>
                </View>
              )}

              <View />
            </TouchableOpacity>
          )}

          {data?.status === 'delivered' && (
            <TouchableOpacity
              style={styles.chatActionBtn}
              onPress={onReview}
              activeOpacity={0.8}
            >
              <AppIcon
                name={'MessageSquare'}
                size={15}
                color={COLORS.primary}
              />
              <AppText style={styles.chatActionBtnText}>
                Review Shipment
              </AppText>
            </TouchableOpacity>
          )}
          {data?.status !== 'open_for_offers' &&
            data?.status !== 'delivered' && (
              <TouchableOpacity
                style={styles.secondaryActionBtn}
                // onPress={() => setIsMapVisible(true)}
                onPress={() => {
                  navigation.navigate('LiveTracking', { shipmentId: quoteId });
                }}
                activeOpacity={0.8}
              >
                <AppIcon name={'Map'} size={15} color={COLORS.textPrimary} />
                <AppText style={styles.secondaryActionBtnText}>
                  View Map
                </AppText>
              </TouchableOpacity>
            )}
        </View>
      </View>

      {/* 2. BOTTOM SHIPMENT DETAILS CARD */}
      <View style={styles.detailsCard}>
        <TouchableOpacity
          style={styles.detailsHeader}
          onPress={() => setIsDetailsExpanded(!isDetailsExpanded)}
          activeOpacity={0.85}
        >
          <AppText style={styles.detailsHeaderTitle}>Shipment Details</AppText>
          {isDetailsExpanded ? (
            <AppIcon name={'ChevronUp'} size={20} color={COLORS.textPrimary} />
          ) : (
            <AppIcon
              name={'ChevronDown'}
              size={20}
              color={COLORS.textPrimary}
            />
          )}
        </TouchableOpacity>

        {isDetailsExpanded && (
          <View style={styles.detailsBody}>
            {/* General Overview Summary */}
            <View style={styles.summaryBox}>
              <AppText style={styles.summaryBoxHeader}>GENERAL SUMMARY</AppText>
              <View style={styles.summaryRow}>
                <AppText style={styles.summaryLabel}>Total Horses:</AppText>
                <AppText style={styles.summaryValue}>
                  {data?.numberOfHorses || "0"}
                </AppText>
              </View>
              <View style={styles.summaryRow}>
                <AppText style={styles.summaryLabel}>Pickup Window:</AppText>
                <AppText style={styles.summaryValue}>
                  {formatDateRange(
                    data?.pickupDateRange?.start,
                    data?.pickupDateRange?.end,
                  )}
                </AppText>
              </View>
              <View style={styles.summaryRow}>
                <AppText style={styles.summaryLabel}>Delivery Window:</AppText>
                <AppText style={styles.summaryValue}>
                  {formatDateRange(
                    data?.deliveryDateRange?.start,
                    data?.deliveryDateRange?.end,
                  )}
                </AppText>
              </View>
            </View>

            {/* Horses List */}
            <HorseDetailsList
              horses={data?.horses}
              status={data?.status}
              loading={loading}
              onEditDocumentsNotes={handleEditDocumentsNotes}
              onOpenUrl={openUrl}
            />

            {/* Additional Info History Log */}
            {data?.additionalInfoLog && data?.additionalInfolog?.length > 0 && (
              <View style={styles.logSection}>
                <AppText style={styles.logSectionHeader}>
                  ADDITIONAL INFO HISTORY
                </AppText>
                {data?.additionalInfolog?.map((log: any, idx: number) => (
                  <View key={idx} style={styles.logCardItem}>
                    <View style={styles.logCardItemHeader}>
                      <View style={styles.logUserRow}>
                        <AppIcon
                          name={'User'}
                          size={12}
                          color={COLORS.primary}
                        />
                        <AppText style={styles.logUserNameText}>
                          {log?.userName || 'Customer'}
                        </AppText>
                      </View>
                      <View style={styles.logUserRow}>
                        <AppIcon
                          name={'Clock'}
                          size={11}
                          color={COLORS.textLight}
                        />
                        <AppText style={styles.logTimeText}>
                          {formatDate(log?.createdAt, 'MM/DD/YYYY, h:mm A')}
                        </AppText>
                      </View>
                    </View>
                    <AppText style={styles.logBodyText}>{log?.note}</AppText>
                  </View>
                ))}
              </View>
            )}

            {/* Publish / Track Action Buttons */}
            <View style={styles.footerActionsRow}>
              {data?.publish === false && (
                <TouchableOpacity
                  onPress={() => handlePublish(data?._id)}
                  style={styles.publishButton}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <AppText style={styles.publishButtonText}>
                      Publish Shipment
                    </AppText>
                  )}
                </TouchableOpacity>
              )}

              {/* {data?.status === 'assigned' && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('LiveTracking', { shipmentId: quoteId })}
                  style={styles.trackButton}
                  activeOpacity={0.8}
                >
                  <AppIcon name={"Truck"} size={16} color={COLORS.white} />
                  <AppText style={styles.trackButtonText}>Track Shipment</AppText>
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        )}
      </View>
      <Suspense fallback={<ActivityIndicator />}>
        <PublishedSuccessModal
          visible={isSuccessModalVisible}
          onClose={() => {
            setIsSuccessModalVisible(false);
            navigation.goBack();
          }}
          onViewShipment={() => {
            setIsSuccessModalVisible(false);
            navigation.goBack();
          }}
        />
      </Suspense>

      <Suspense fallback={<ActivityIndicator />}>
        <MapModal
          visible={isMapVisible}
          onClose={() => setIsMapVisible(false)}
          distance={data?.estimatedDistance || 'Not Available'}
          pickupCoords={data?.pickupCoords}
          deliveryCoords={data?.deliveryCoords}
          shipmentData={{
            pickupLocation: data?.pickupLocation,
            deliveryLocation: data?.deliveryLocation,
            status: data?.status,
          }}
          currentLocation={data?.currentLocation}
        />
      </Suspense>
    </View>
  );
};

export default OverviewTab;
