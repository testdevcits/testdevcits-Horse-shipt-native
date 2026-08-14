import React, { lazy, Suspense, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,

  RefreshControl,
} from 'react-native';

import Toast from 'react-native-toast-message';
import { COLORS, FONT_SIZE } from '../../../../constants';
import { AppHeader, AppText, AppLoader, ConfirmationModal } from '../../../../components';
import useShipmentDetails from './useShipementDetails';

// Modals & Tabs
import styles from './style.myshipments';
import OverviewTab from './tabs/OverviewTab';
import QuotesTab from './tabs/QuotesTab';
import QuestionsTab from './tabs/QuestionsTab';
import FindShipperTab from './tabs/FindShipperTab';
import { Dot, Pencil, Trash2 } from 'lucide-react-native';
import { getFormattedDate } from '../../../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../../hooks/redux';
import { deleteCustomerShipment } from '../../../../redux/slices/customerShipmentSlice';

import customerService from '../../../../api/services/customerService';

const TABS = ['Overview', 'Quotes', 'Questions', 'Find Shipper'];

const QuoteDetailModal = lazy(
  () => import('./QuoteDetailModal'),
);

const RatingModal = lazy(
  () => import('./RatingModal'),
);

const DeliveredSuccessModal = lazy(
  () => import('./DeliveredSuccessModal'),
);


const MyShipmentDetails = ({ route, }: any) => {
  const dispatch = useAppDispatch();
  const { item, quoteId } = route.params;

  console.log("=========quoteId===============", quoteId)


  const [activeTab, setActiveTab] = useState('Overview');
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeliveredModalVisible, setIsDeliveredModalVisible] = useState(false);
  const [hasShownDeliveredModal, setHasShownDeliveredModal] = useState(false);
  const navigation = useNavigation();

  const {
    shipment,
    quotes,
    questions,
    matchingShippers,
    invitedShippers,
    loading,
    refreshing,
    onRefresh,
  } = useShipmentDetails(item?._id);

  const data = shipment || item;

  const isDelivered = (data?.status || '').toLowerCase() === 'delivered';

  useEffect(() => {
    if (isDelivered && !hasShownDeliveredModal) {
      setIsDeliveredModalVisible(true);
      setHasShownDeliveredModal(true);
    }
  }, [isDelivered, hasShownDeliveredModal]);

  const isDraft = (data?.status || '').toLowerCase() === 'draft';

  const handleEditShipment = async () => {
    if (!data?._id) return;
    try {
      const res: any = await customerService.getShipmentById(data._id);
      const fetchedShipment = res?.shipment || res?.data?.shipment || res?.data || data;
      (navigation as any).navigate('NewShipment', {
        isEdit: true,
        shipmentData: fetchedShipment,
      });
    } catch (err) {
      console.log('Error fetching shipment details for edit:', err);
      (navigation as any).navigate('NewShipment', {
        isEdit: true,
        shipmentData: data,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!data?._id) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCustomerShipment(data._id)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Draft Deleted',
        text2: 'Draft shipment deleted successfully.',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: err || 'Failed to delete draft shipment',
      });
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
    }
  };

  if (loading && !refreshing) return <AppLoader visible={true} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewTab
            data={data}
            onReview={() => setIsRatingVisible(true)}
            quoteId={item?.quoteId}
          />
        );
      case 'Quotes':
        return <QuotesTab quotes={quotes} onSelectQuote={setSelectedQuote} />;
      case 'Questions':
        return <QuestionsTab questions={questions} onRefresh={onRefresh} />;
      case 'Find Shipper':
        if (isDelivered) return null;
        return (
          <FindShipperTab
            matching={matchingShippers}
            invited={invitedShippers}
            shipmentId={item?._id}
            status={data?.status}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title={data?.shipmentCode} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {/* HEADER SECTION - UPDATED TO MATCH IMAGE */}
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <AppText style={styles.shipmentTitle}>Shipment Title</AppText>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {isDraft && (
                  <TouchableOpacity
                    onPress={() => setIsDeleteModalVisible(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      padding: 4,
                    }}
                  >
                    <Trash2 size={16} color={COLORS.error} />
                    <AppText style={{ color: COLORS.error, fontSize: FONT_SIZE.md }}>
                      Delete
                    </AppText>
                  </TouchableOpacity>
                )}
                {data?.status !== 'delivered' && (
                  <TouchableOpacity
                    onPress={handleEditShipment}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      padding: 4,
                    }}
                  >
                    <Pencil size={16} color={COLORS.primary} />
                    <AppText style={{ color: COLORS.primary, fontSize: FONT_SIZE.md }}>
                      Edit
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.idRow}>
              <AppText style={styles.shipmentId}>
                {data?.shipmentCode || ''}
              </AppText>
              <View style={styles.statusBadge}>
                <AppText style={styles.statusText}>{data?.status}</AppText>
              </View>
            </View>

            <AppText style={styles.listedText}>
              Listed on {getFormattedDate(item?.createdAt)}
            </AppText>
          </View>

          {/* TABS BAR - REFINED STYLING */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TABS.filter(tab => !(isDelivered && tab === 'Find Shipper')).map(tab => {
                const isActive = activeTab === tab;
                let badgeCount = 0;
                if (tab === 'Quotes') badgeCount = quotes.length || 0; // Placeholder 3 to match image
                if (tab === 'Questions') {
                  badgeCount = Array.isArray(questions)
                    ? questions.length
                    : ((questions as any)?.pending?.length || 0) + ((questions as any)?.answered?.length || 0);
                }

                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabButton,
                      isActive && styles.tabButtonActive,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}
                    >
                      {tab}
                    </AppText>
                    {badgeCount > 0 && (
                      <View style={styles.tabBadge}>
                        <AppText style={styles.tabBadgeText}>
                          {badgeCount}
                        </AppText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollPadding}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
          >
            {renderTabContent()}
          </ScrollView>

          {/* MODALS */}
          <Suspense fallback={null}>
            <DeliveredSuccessModal
              visible={isDeliveredModalVisible}
              onClose={() => setIsDeliveredModalVisible(false)}
              onLeaveReview={() => setIsRatingVisible(true)}
            />
          </Suspense>
          <Suspense fallback={null}>
            <RatingModal
              visible={isRatingVisible}
              onClose={() => setIsRatingVisible(false)}
              shipperName={data?.shipper?.name || 'Not Available'}
              shipmentTitle={data?.shipmentCode}
              shipperId={data?.shipper?._id || data?.shipper}
              shipmentId={data?._id}
            />
          </Suspense>
          <Suspense fallback={null}>
            <QuoteDetailModal
              visible={!!selectedQuote}
              quote={selectedQuote}
              onClose={() => setSelectedQuote(null)}
              isCompleted={data?.status === 'delivered'}
            />
          </Suspense>

          {/* DELETE CONFIRMATION MODAL */}
          <ConfirmationModal
            isVisible={isDeleteModalVisible}
            type="danger"
            title="Delete Draft Shipment?"
            description="Are you sure you want to delete this draft shipment? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
            onClose={() => {
              if (!isDeleting) {
                setIsDeleteModalVisible(false);
              }
            }}
            onConfirm={handleConfirmDelete}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyShipmentDetails;
