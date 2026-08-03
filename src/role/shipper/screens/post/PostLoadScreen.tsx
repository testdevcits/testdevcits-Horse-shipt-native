import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Truck,
  Check,
  User,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, AppText, Input } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import AvailableShipmentCard from '../home/AvailableShipmentCard';
import AskQuestionModal from '../home/AskQuestionModal';
import SubmitOfferModal from '../home/SubmitOfferModal';
import ContractModal from '../quotes/ContractModal';
import styles from './styles.postload';

type TabType = 'my_shipments' | 'quote_request' | 'all_shipment';

const PostLoadScreen = () => {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<TabType>('my_shipments');
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [myQuotes, setMyQuotes] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isAskModalVisible, setIsAskModalVisible] = useState(false);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);

  // Contract Modal state
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<{
    url?: string;
    code?: string;
    quote?: any;
  }>({});

  const fetchData = async () => {
    try {
      const [availableRes, quotesRes, invitationsRes] = await Promise.all([
        shipperService.getAvailableShipments().catch(() => null),
        shipperService.getMyQuotes().catch(() => null),
        shipperService.getInvitations().catch(() => null),
      ]);

      if (availableRes?.shipments) {
        setAllShipments(availableRes.shipments);
      }
      if (quotesRes?.quotes) {
        setMyQuotes(quotesRes.quotes);
      }
      if (invitationsRes?.data) {
        setInvitations(invitationsRes.data);
      }
    } catch (error) {
      console.error('Fetch Post Load Data Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleAskQuestion = (item: any) => {
    const shipment = item?.shipment || item;
    setSelectedShipment(shipment);
    setIsAskModalVisible(true);
  };

  const handleSubmitOffer = (item: any) => {
    const shipment = item?.shipment || item;
    setSelectedShipment(shipment);
    setIsOfferModalVisible(true);
  };

  const handleCardPress = (item: any) => {
    const shipment = item?.shipment ? { ...item?.shipment, quote: item } : item;
    // Navigate using ShipperShipmentDetails or ShipmentDetails route
    navigation.navigate('ShipperShipmentDetails', { shipment, quote: item });
  };

  const handleTrackShipment = (item: any) => {

    const shipmentId = item?._id
    console.log("======", shipmentId)
    navigation.navigate('LiveTracking', { shipmentId });
  };

  const handleOpenContract = (item: any) => {
    const url = item?.contract?.url || item?.shipperContract?.url || item?.shipment?.contract?.url;
    const code = item?.shipment?.shipmentCode || item?.shipmentCode || 'HS-SHIP-2026';
    setSelectedContractData({ url, code, quote: item });
    setIsContractModalVisible(true);
  };

  // Tab filtering logic
  const getTabFilteredData = () => {
    let dataset: any[] = [];

    if (activeTab === 'my_shipments') {
      // Shippers' submitted quotes from /api/shipper/quotes/mq
      dataset = myQuotes;
    } else if (activeTab === 'quote_request') {
      // Direct Quote Request Invitations from /api/shipper/invitations
      dataset = invitations;
    } else {
      // All Available Shipments from /api/shipper/shipments/available
      dataset = allShipments;
    }

    if (!searchQuery.trim()) return dataset;

    const q = searchQuery.toLowerCase();
    return dataset.filter(item => {
      const shipment = item?.shipment || item;
      const p = (item?.pickupLocation || shipment.pickupLocation || '').toLowerCase();
      const d = (item?.deliveryLocation || shipment.deliveryLocation || '').toLowerCase();
      const c = (item?.shipmentCode || shipment.shipmentCode || '').toLowerCase();
      return p.includes(q) || d.includes(q) || c.includes(q);
    });
  };

  const currentList = getTabFilteredData();

  // Counts
  const myShipmentsCount = myQuotes.length;
  const quoteRequestsCount = invitations.length;
  const allShipmentsCount = allShipments.length;

  const renderHeader = () => (
    <>
      {/* Top Banner Card */}
      <View style={styles.topCard}>
        <AppText style={styles.topTitle}>Shipments</AppText>
        <AppText style={styles.topSub}>
          Explore available shipments, customer quote requests, and active loads.
        </AppText>

        {/* Search Bar */}
        <Input
          placeholder="Search pickup, delivery, or code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={COLORS.textSecondary} />}
          containerStyle={{ marginBottom: 0, marginTop: 12 }}
        />
      </View>

      {/* 3 Horizontal Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {/* Tab 1: My Shipments */}
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'my_shipments' && styles.tabBtnActive]}
            onPress={() => setActiveTab('my_shipments')}
          >
            <AppText
              style={[
                styles.tabBtnText,
                activeTab === 'my_shipments' && styles.tabBtnTextActive,
              ]}
            >
              My Shipments
            </AppText>
            {myShipmentsCount > 0 && (
              <View style={styles.badgePill}>
                <AppText style={styles.badgePillText}>
                  {String(myShipmentsCount).padStart(2, '0')}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 2: Quote Request */}
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'quote_request' && styles.tabBtnActive]}
            onPress={() => setActiveTab('quote_request')}
          >
            <AppText
              style={[
                styles.tabBtnText,
                activeTab === 'quote_request' && styles.tabBtnTextActive,
              ]}
            >
              Quote Request
            </AppText>
            {quoteRequestsCount > 0 && (
              <View style={styles.badgePill}>
                <AppText style={styles.badgePillText}>
                  {String(quoteRequestsCount).padStart(2, '0')}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 3: All Shipment */}
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all_shipment' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all_shipment')}
          >
            <AppText
              style={[
                styles.tabBtnText,
                activeTab === 'all_shipment' && styles.tabBtnTextActive,
              ]}
            >
              All Shipment
            </AppText>
            {allShipmentsCount > 0 && (
              <View style={styles.badgePill}>
                <AppText style={styles.badgePillText}>
                  {String(allShipmentsCount).padStart(2, '0')}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );

  const renderCard = ({ item }: { item: any }) => {
    const shipment = item?.shipment || item;
    const code = item?.shipmentCode || shipment.shipmentCode || 'Not available';
    const pickupLoc = item?.pickupLocation || shipment.pickupLocation || 'Pickup location unavailable';
    const deliveryLoc = item?.deliveryLocation || shipment.deliveryLocation || 'Delivery location unavailable';
    const horsesCount = shipment.numberOfHorses || shipment.horses?.length || 0;

    /* 1. SPECIAL CARD FOR MY SHIPMENTS TAB */
    if (activeTab === 'my_shipments') {
      const quoteStatusRaw = (item?.status || 'pending').toLowerCase();
      const paymentStatusRaw = (item?.paymentStatus || 'pending').toLowerCase();
      const priceText = item?.totalPrice ? `$${item?.totalPrice}` : '$0';
      const paymentMethodText = item?.paymentMethod || 'card';
      const paymentDueText = item?.paymentDue ? `due on ${item?.paymentDue}` : 'due on delivery';

      const isAccepted = quoteStatusRaw === 'accepted' || quoteStatusRaw === 'assigned';
      const isPaid = paymentStatusRaw === 'paid';

      return (
        <View style={styles.myShipmentCard}>
          {/* Header Row: Code & Badges */}
          <View style={styles.myHeaderRow}>
            <AppText style={styles.myCodeText}># {code}</AppText>

            <View style={styles.myBadgesCol}>
              {/* Status Badge */}
              <View
                style={[
                  styles.myBadgePill,
                  isAccepted
                    ? { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }
                    : { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
                ]}
              >
                {isAccepted && <Check size={12} color="#059669" />}
                <AppText
                  style={[
                    styles.myBadgePillText,
                    isAccepted ? { color: '#059669' } : { color: '#B45309' },
                  ]}
                >
                  {quoteStatusRaw.toUpperCase()}
                </AppText>
              </View>

              {/* Payment Badge */}
              <View
                style={[
                  styles.myBadgePill,
                  isPaid
                    ? { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }
                    : { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
                ]}
              >
                <AppText
                  style={[
                    styles.myBadgePillText,
                    isPaid ? { color: '#059669' } : { color: '#475569' },
                  ]}
                >
                  PAYMENT: {paymentStatusRaw.toUpperCase()}
                </AppText>
              </View>
            </View>
          </View>

          {/* Route Graphic Row */}
          <View style={styles.routeGraphicContainer}>
            {/* Pickup Node */}
            <View style={styles.routeLocCol}>
              <MapPin size={14} color="#D97706" style={{ marginTop: 2 }} />
              <AppText style={styles.routeAddressText} numberOfLines={2}>
                {pickupLoc}
              </AppText>
            </View>

            {/* Track Line with Truck */}
            <View style={styles.trackMiddle}>
              <View style={styles.trackLine} />
              <View style={styles.trackTruckBox}>
                <Truck size={14} color="#D97706" />
              </View>
            </View>

            {/* Delivery Node */}
            <View style={styles.routeLocCol}>
              <MapPin size={14} color="#10B981" style={{ marginTop: 2 }} />
              <AppText style={styles.routeAddressText} numberOfLines={2}>
                {deliveryLoc}
              </AppText>
            </View>
          </View>

          {/* Horse Count */}
          <AppText style={styles.myHorseText}>
            👤 {horsesCount} {horsesCount === 1 ? 'Horse' : 'Horses'}
          </AppText>

          {/* Price & Payment Terms Line */}
          <AppText style={styles.myTermsText}>
            {priceText} • {paymentMethodText} • {paymentDueText}
          </AppText>

          {/* Action Buttons Row */}
          <View style={styles.myActionsRow}>
            <TouchableOpacity
              style={styles.viewContractBtn}
              onPress={() => handleOpenContract(item)}
              activeOpacity={0.8}
            >
              <AppText style={styles.viewContractBtnText}>View Contract</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trackShipmentBtn}
              onPress={() => handleTrackShipment(item)}
              activeOpacity={0.8}
            >
              <AppText style={styles.trackShipmentBtnText}>Track Shipment</AppText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    /* 2. HOME SCREEN SHIPMENT CARD FOR ALL SHIPMENT AND QUOTE REQUEST TABS */
    return (
      <View style={{ marginHorizontal: 0 }}>
        <AvailableShipmentCard
          item={shipment}
          onPress={() => handleCardPress(item)}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A06333" />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Package size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No Shipments Found</AppText>
        <AppText style={styles.emptySub}>
          There are currently no shipments under the "{activeTab.replace(/_/g, ' ')}" tab matching your search.
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Shipments" />

      <FlatList
        data={loading ? [] : currentList}
        keyExtractor={(item, index) => item?._id || item?.id || String(index)}
        renderItem={renderCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Ask Question Custom Modal */}
      {selectedShipment && (
        <AskQuestionModal
          isVisible={isAskModalVisible}
          onClose={() => {
            setIsAskModalVisible(false);
            setSelectedShipment(null);
          }}
          onSubmit={async (q: string) => {
            await shipperService.askQuestion({
              shipmentId: selectedShipment._id || selectedShipment.id,
              question: q,
            });
            setIsAskModalVisible(false);
          }}
          shipmentCode={selectedShipment.shipmentCode}
        />
      )}

      {/* Submit Shipping Offer Custom Modal */}
      {selectedShipment && (
        <SubmitOfferModal
          isVisible={isOfferModalVisible}
          onClose={() => {
            setIsOfferModalVisible(false);
            setSelectedShipment(null);
          }}
          shipmentId={selectedShipment._id || selectedShipment.id}
          shipmentCode={selectedShipment.shipmentCode}
          onSuccess={fetchData}
        />
      )}

      {/* Contract Modal */}
      <ContractModal
        visible={isContractModalVisible}
        onClose={() => setIsContractModalVisible(false)}
        contractUrl={selectedContractData?.url}
        shipmentCode={selectedContractData?.code}
        quoteData={selectedContractData?.quote}
      />
    </View>
  );
};

export default PostLoadScreen;
