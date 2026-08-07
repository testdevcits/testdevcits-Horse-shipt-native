import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, AppText } from '../../../../components';
import shipperService from '../../../../api/services/shipperService';
import AskQuestionModal from '../home/AskQuestionModal';
import SubmitOfferModal from '../home/SubmitOfferModal';
import ContractModal from '../quotes/ContractModal';
import MyShipmentsScreen from './MyShipmentsScreen';
import QuoteRequestScreen from './QuoteRequestScreen';
import AllShipmentScreen from './AllShipmentScreen';
import styles from './styles.postload';

export type TabType = 'my_shipments' | 'quote_request' | 'all_shipment';

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
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<{
    url?: string;
    code?: string;
    quote?: any;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, quotesRes, invRes] = await Promise.all([
        shipperService.getAvailableShipments({ limit: 50 }).catch(() => null),
        shipperService.getMyQuotes().catch(() => null),
        shipperService.getInvitations().catch(() => null),
      ]);

      if (allRes?.success || allRes?.shipments) {
        setAllShipments(allRes.shipments || []);
      }
      if (quotesRes?.success || quotesRes?.quotes) {
        setMyQuotes(quotesRes.quotes || []);
      }
      if (invRes?.success || invRes?.data) {
        setInvitations(invRes.data || []);
      }
    } catch (error: any) {
      console.error('Fetch PostLoad Data Error:', error);
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

  const handleCardPress = (item: any) => {
    // const shipmentId = item?.shipment?._id || item?._id || item?.id;
    // if (shipmentId) {
    //   navigation.navigate('AvailableShipmentDetails', { shipmentId });
    // }
    navigation.navigate('ShipperShipmentDetails', { shipment: item })
  };

  const handleOpenContract = (item: any) => {
    const shipment = item?.shipment || item;
    const contractUrl =
      item?.contract?.url ||
      item?.shipperContract?.url ||
      item?.contractUrl ||
      shipment?.contractUrl;
    setSelectedContractData({
      url: contractUrl,
      code: item?.shipmentCode || shipment?.shipmentCode,
      quote: item,
    });
    setIsContractModalVisible(true);
  };

  const handleTrackShipment = (item: any) => {
    const shipmentId = item?.shipment?._id || item?._id || item?.id;
    if (shipmentId) {
      navigation.navigate('LiveTracking', { shipmentId });
    }
  };

  // Counts
  const myShipmentsCount = myQuotes.length;
  const quoteRequestsCount = invitations.length;
  const allShipmentsCount = allShipments.length;

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'my_shipments':
        return (
          <MyShipmentsScreen
            data={myQuotes}
            loading={loading}
            onOpenContract={handleOpenContract}
            onTrackShipment={handleTrackShipment}
            onRefresh={fetchData}
          />
        );
      case 'quote_request':
        return (
          <QuoteRequestScreen
            data={invitations}
            loading={loading}
            onCardPress={handleCardPress}
          />
        );
      case 'all_shipment':
        return (
          <AllShipmentScreen
            data={allShipments}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCardPress={handleCardPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Shipments" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Banner Card */}
        {/* <View style={styles.topCard}>
          <AppText style={styles.topTitle}>Shipments</AppText>
          <AppText style={styles.topSub}>
            Explore available shipments, customer quote requests, and active loads.
          </AppText>
        </View> */}

        {/* 3 Horizontal Filter Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {/* Tab 1: My Shipments */}
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'my_shipments' && styles.tabBtnActive,
              ]}
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
              style={[
                styles.tabBtn,
                activeTab === 'quote_request' && styles.tabBtnActive,
              ]}
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
              style={[
                styles.tabBtn,
                activeTab === 'all_shipment' && styles.tabBtnActive,
              ]}
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

        {/* Active Tab Screen */}
        {renderActiveScreen()}
      </ScrollView>

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
