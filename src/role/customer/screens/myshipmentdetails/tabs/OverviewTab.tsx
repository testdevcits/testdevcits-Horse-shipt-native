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
  ChevronUp,
  FileText,
  MessageSquare,
  Edit3,
  ExternalLink,

  User,
  Clock,
} from 'lucide-react-native';
import { formatDate } from '../../../../../utils/helpers';
import { AppText, MapModal } from '../../../../../components';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
} from '../../../../../constants';
import PublishedSuccessModal from '../PublishedSuccessModal';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../../api/services/customerService';
import { fetchCustomerShipments } from '../../../../../redux/slices/customerShipmentSlice';
import { useAppDispatch } from '../../../../../hooks/redux';

const OverviewTab = ({ data, quoteId, onReview }: any) => {


  const navigation = useNavigation<any>();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()

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
    } catch (error) {
      Alert.alert('Error', 'Failed to publish shipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocumentsNotes = async () => {
    if (!data?._id) return;
    setLoading(true);
    try {
      const res: any = await customerService.getShipmentById(data._id);
      const fetchedShipment = res?.shipment || res?.data?.shipment || res?.data || data;
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

  const handleChatWithShipper = () => {
    const shipperId = data?.shipper?._id || data?.shipper;
    if (shipperId) {
      navigation.navigate('CustomerDrawer', {
        screen: 'CustomerTabs',
        params: {
          screen: 'Chats',
        },
      });
    } else {
      Alert.alert('Chat Unavailable', 'No shipper assigned yet.');
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
              {(data?.status || 'Draft').toUpperCase()}
            </AppText>
          </View>
        </View>

        {/* Route Timeline (Pickup to Delivery) */}
        <View style={styles.timelineContainer}>
          {/* Pickup Block */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#EF4444' }]}>
              <MapPin size={12} color={COLORS.white} />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.timelineLabel}>PICKUP LOCATION</AppText>
              <AppText style={styles.timelineAddress} numberOfLines={2}>
                {data?.pickupLocation || 'N/A'}
              </AppText>
              <View style={styles.dateChip}>
                <Calendar size={12} color={COLORS.goldDarkText} />
                <AppText style={styles.dateChipText}>
                  {formatDateRange(
                    data?.pickupDateRange?.start,
                    data?.pickupDateRange?.end,
                  )}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.timelineLine} />

          {/* Delivery Block */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]}>
              <MapPin size={12} color={COLORS.white} />
            </View>
            <View style={styles.timelineContent}>
              <AppText style={styles.timelineLabel}>DELIVERY LOCATION</AppText>
              <AppText style={styles.timelineAddress} numberOfLines={2}>
                {data?.deliveryLocation || 'N/A'}
              </AppText>
              <View style={styles.dateChip}>
                <Calendar size={12} color={COLORS.goldDarkText} />
                <AppText style={styles.dateChipText}>
                  {formatDateRange(
                    data?.deliveryDateRange?.start,
                    data?.deliveryDateRange?.end,
                  )}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {data?.status !== 'delivered' && data?.status !== 'assigned' && (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleEditDocumentsNotes}
              activeOpacity={0.8}
            >
              <Edit3 size={15} color={COLORS.white} />
              <AppText style={styles.primaryActionBtnText}>
                Edit Documents & Notes
              </AppText>
            </TouchableOpacity>
          )}

          {/* {(data?.shipper?._id || data?.shipper) &&
            data?.status !== 'delivered' && (
              <TouchableOpacity
                style={styles.chatActionBtn}
                onPress={handleChatWithShipper}
                activeOpacity={0.8}
              >
                <MessageSquare size={15} color={COLORS.primary} />
                <AppText style={styles.chatActionBtnText}>
                  Chat with Shipper
                </AppText>
              </TouchableOpacity>
            )} */}
          {data?.status === 'delivered' && (
            <TouchableOpacity
              style={styles.chatActionBtn}
              onPress={onReview}
              activeOpacity={0.8}
            >
              <MessageSquare size={15} color={COLORS.primary} />
              <AppText style={styles.chatActionBtnText}>
                Review Shipment
              </AppText>
            </TouchableOpacity>
          )}
          {data?.status !== 'open_for_offers' && data?.status !== "delivered" && (
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              // onPress={() => setIsMapVisible(true)}
              onPress={() => { navigation.navigate("LiveTracking", { shipmentId: quoteId }) }}
              activeOpacity={0.8}
            >
              <MapIcon size={15} color={COLORS.textPrimary} />
              <AppText style={styles.secondaryActionBtnText}>View Map</AppText>
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
            <ChevronUp size={20} color={COLORS.textPrimary} />
          ) : (
            <ChevronDown size={20} color={COLORS.textPrimary} />
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
                  {data?.numberOfHorses || 1}
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
            {data?.horses?.map((horse: any, index: number) => (
              <View key={index} style={styles.horseCard}>
                <View style={styles.horseCardBadgeHeader}>
                  <AppText style={styles.horseCardBadgeText}>
                    HORSE {index + 1}
                  </AppText>
                </View>

                <View style={styles.horseCardBody}>
                  {/* Horse Profile Grid */}
                  <View style={styles.horseSpecGrid}>
                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>
                        Registered Name
                      </AppText>
                      <AppText style={styles.specValue}>
                        {horse.registeredName || 'N/A'}
                      </AppText>
                    </View>

                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>Barn Name</AppText>
                      <AppText style={styles.specValue}>
                        {horse.barnName || 'N/A'}
                      </AppText>
                    </View>

                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>Breed</AppText>
                      <AppText style={styles.specValue}>
                        {horse.breed || 'N/A'}
                      </AppText>
                    </View>

                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>Colour</AppText>
                      <AppText style={styles.specValue}>
                        {horse.colour || 'N/A'}
                      </AppText>
                    </View>

                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>Age</AppText>
                      <AppText style={styles.specValue}>
                        {horse.age || 'N/A'}
                      </AppText>
                    </View>

                    <View style={styles.specItem}>
                      <AppText style={styles.specLabel}>Sex</AppText>
                      <AppText style={styles.specValue}>
                        {horse.sex || 'N/A'}
                      </AppText>
                    </View>
                  </View>

                  {/* General Info Box */}
                  <View style={styles.infoQuoteBox}>
                    <AppText style={styles.infoQuoteTitle}>
                      General Info / Care Notes
                    </AppText>
                    <AppText style={styles.infoQuoteText}>
                      {horse.generalInfo || horse.notes || 'No notes provided.'}
                    </AppText>
                  </View>

                  {/* Chronological Notes Log */}
                  {horse.notesLog && horse.notesLog.length > 0 && (
                    <View style={styles.logSection}>
                      <AppText style={styles.logSectionHeader}>
                        CHRONOLOGICAL NOTES
                      </AppText>
                      {horse.notesLog.map((log: any, lIdx: number) => (
                        <View key={lIdx} style={styles.logCardItem}>
                          <View style={styles.logCardItemHeader}>
                            <View style={styles.logUserRow}>
                              <User size={12} color={COLORS.primary} />
                              <AppText style={styles.logUserNameText}>
                                {log.userName || 'User'} (
                                {log.userRole || 'Customer'})
                              </AppText>
                            </View>
                            <View style={styles.logUserRow}>
                              <Clock size={11} color={COLORS.textLight} />
                              <AppText style={styles.logTimeText}>
                                {formatDate(log.createdAt, 'DD/MM/YYYY, HH:mm')}
                              </AppText>
                            </View>
                          </View>
                          <AppText style={styles.logBodyText}>
                            {log.note}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Uploaded Documents */}
                  <View style={styles.documentsContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
                      <AppText style={styles.documentsHeaderTitle}>
                        Uploaded Documents
                      </AppText>
                      {
                        data?.status !== "delivered" &&
                        <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                          onPress={handleEditDocumentsNotes}
                        >
                          <Edit3 size={14} color={COLORS.primary} />
                          <AppText style={{
                            color: COLORS.primary, fontSize: FONT_SIZE.sm,
                            fontFamily: FONTS.semiBold
                          }}>
                            Edit Docs / Notes
                          </AppText>
                        </TouchableOpacity>
                      }

                    </View>
                    <View style={styles.docListGrid}>
                      {horse.documents?.coggins?.url && (
                        <TouchableOpacity
                          style={styles.docCardPill}
                          onPress={() => openUrl(horse.documents.coggins.url)}
                          activeOpacity={0.8}
                        >
                          <FileText size={16} color={COLORS.primary} />
                          <View style={styles.docCardPillTextCol}>
                            <AppText style={styles.docTitle}>
                              Coggins Test
                            </AppText>
                            <AppText style={styles.docSub}>Tap to view</AppText>
                          </View>
                          <ExternalLink
                            size={13}
                            color={COLORS.textSecondary}
                          />
                        </TouchableOpacity>
                      )}

                      {horse.documents?.healthCertificate?.url && (
                        <TouchableOpacity
                          style={styles.docCardPill}
                          onPress={() =>
                            openUrl(horse.documents.healthCertificate.url)
                          }
                          activeOpacity={0.8}
                        >
                          <FileText size={16} color={COLORS.primary} />
                          <View style={styles.docCardPillTextCol}>
                            <AppText style={styles.docTitle}>
                              Health Certificate
                            </AppText>
                            <AppText style={styles.docSub}>Tap to view</AppText>
                          </View>
                          <ExternalLink
                            size={13}
                            color={COLORS.textSecondary}
                          />
                        </TouchableOpacity>
                      )}

                      {horse.documents?.other?.url && (
                        <TouchableOpacity
                          style={styles.docCardPill}
                          onPress={() => openUrl(horse.documents.other.url)}
                          activeOpacity={0.8}
                        >
                          <FileText size={16} color={COLORS.primary} />
                          <View style={styles.docCardPillTextCol}>
                            <AppText style={styles.docTitle}>
                              Other Document
                            </AppText>
                            <AppText style={styles.docSub}>Tap to view</AppText>
                          </View>
                          <ExternalLink
                            size={13}
                            color={COLORS.textSecondary}
                          />
                        </TouchableOpacity>
                      )}

                      {!horse.documents?.coggins?.url &&
                        !horse.documents?.healthCertificate?.url &&
                        !horse.documents?.other?.url && (
                          <AppText style={styles.emptyDocsText}>
                            No documents uploaded for this horse.
                          </AppText>
                        )}
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Additional Info History Log */}
            {data?.additionalInfoLog && data?.additionalInfoLog.length > 0 && (
              <View style={styles.logSection}>
                <AppText style={styles.logSectionHeader}>
                  ADDITIONAL INFO HISTORY
                </AppText>
                {data?.additionalInfoLog.map((log: any, idx: number) => (
                  <View key={idx} style={styles.logCardItem}>
                    <View style={styles.logCardItemHeader}>
                      <View style={styles.logUserRow}>
                        <User size={12} color={COLORS.primary} />
                        <AppText style={styles.logUserNameText}>
                          {log.userName || 'Customer'}
                        </AppText>
                      </View>
                      <View style={styles.logUserRow}>
                        <Clock size={11} color={COLORS.textLight} />
                        <AppText style={styles.logTimeText}>
                          {formatDate(log.createdAt, 'DD/MM/YYYY, HH:mm')}
                        </AppText>
                      </View>
                    </View>
                    <AppText style={styles.logBodyText}>{log.note}</AppText>
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
                  <Truck size={16} color={COLORS.white} />
                  <AppText style={styles.trackButtonText}>Track Shipment</AppText>
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        )}
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  // Top Card
  topCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  topCardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round || 999,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#D97706',
  },

  // Timeline
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  timelineAddress: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginTop: 4,
    gap: 4,
  },
  dateChipText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#EEDCBD',
    marginLeft: 11,
    marginVertical: 4,
  },

  // Actions
  actionRow: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  primaryActionBtn: {
    backgroundColor: '#27272A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  primaryActionBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  chatActionBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  chatActionBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
  },
  secondaryActionBtn: {
    backgroundColor: '#F4F4F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  secondaryActionBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
  },

  // Details Card
  detailsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    overflow: 'hidden',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#FBF5EB',
    borderBottomWidth: 1,
    borderBottomColor: '#EEDCBD',
  },
  detailsHeaderTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  detailsBody: {
    padding: SPACING.md,
  },

  // Summary Box
  summaryBox: {
    backgroundColor: '#FAFAFA',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  summaryBoxHeader: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Horse Card
  horseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#EEDCBD',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  horseCardBadgeHeader: {
    backgroundColor: '#F9F1E6',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEDCBD',
  },
  horseCardBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
  horseCardBody: {
    padding: SPACING.md,
  },
  horseSpecGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.sm,
    columnGap: SPACING.md,
    marginBottom: SPACING.md,
  },
  specItem: {
    width: '46%',
  },
  specLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  specValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  infoQuoteBox: {
    backgroundColor: '#FFFBEB',
    padding: SPACING.md,
    borderRadius: RADIUS.xs,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  infoQuoteTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    marginBottom: 2,
  },
  infoQuoteText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  // Logs
  logSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  logSectionHeader: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  logCardItem: {
    backgroundColor: '#FAFAFA',
    padding: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.xs,
  },
  logCardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logUserNameText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  logTimeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  logBodyText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.grey800,
    lineHeight: 16,
  },

  // Documents
  documentsContainer: {
    marginTop: SPACING.xs,
  },
  documentsHeaderTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  docListGrid: {
    gap: SPACING.xs,
  },
  docCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    gap: SPACING.sm,
  },
  docCardPillTextCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.goldDarkText,
  },
  emptyDocsText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },

  // Footer Actions
  footerActionsRow: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  publishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  publishButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
  trackButton: {
    backgroundColor: '#18181B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 8,
  },
  trackButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
  },
});

export default OverviewTab;
