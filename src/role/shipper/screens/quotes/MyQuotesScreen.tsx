import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ScrollView,
} from 'react-native';
import { FileText } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import {
  AppHeader,
  AppText,
  AppLoader,
  EmptyState,
  SearchBarCompt,
  ConfirmationModal,
  AppSelect,
  AppSelectRef,
} from '../../../../components';
import shipperService from '../../../../api/services/shipperService';
import ContractModal from './ContractModal';
import ShipperQuoteCard from './ShipperQuoteCard';
import styles from './styles.myquotes';

const MyQuotesScreen = () => {
  const navigation = useNavigation<any>();
  const [quotes, setQuotes] = useState<any[]>([]);

  console.log("===============quotes", quotes.map((i) => i.status));


  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_transit' | 'upcoming' | 'cancelled'>('all');
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<{
    url?: string;
    code?: string;
    quote?: any;
  }>({});

  // Quote Delete State
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vehicle Assignment State
  const vehicleSelectRef = useRef<AppSelectRef>(null);
  const [selectedQuoteForVehicle, setSelectedQuoteForVehicle] = useState<any>(null);

  const fetchVehicles = async () => {
    try {
      const res = await shipperService.getVehicles();
      if (res?.success || res?.vehicles) {
        setVehicles(res.vehicles || []);
      }
    } catch (error) {
      console.error('Fetch Vehicles Error:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const res = await shipperService.getMyQuotes();
      if (res?.success || res?.quotes) {
        setQuotes(res.quotes || []);
      }
    } catch (error: any) {
      console.error('Fetch Quotes Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    fetchVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuotes();
    fetchVehicles();
  };

  const handleOpenVehicleSelect = (quote: any) => {
    setSelectedQuoteForVehicle(quote);
    if (vehicles.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No Vehicles Found',
        text2: 'Please add a vehicle in My Vehicles first.',
      });
    }
    vehicleSelectRef.current?.present();
  };

  const handleSelectVehicle = async (selectedLabel: string) => {
    if (!selectedQuoteForVehicle) return;

    const foundVehicle = vehicles.find(v => {
      const label = `${v.make || ''} ${v.model || ''} (${v.vehicleNumber || v.licensePlate || v.type || 'Vehicle'})`.trim();
      return label === selectedLabel || v.vehicleNumber === selectedLabel || v._id === selectedLabel;
    }) || vehicles[0];

    if (!foundVehicle) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Selected vehicle not found.',
      });
      return;
    }

    const quoteId = selectedQuoteForVehicle._id || selectedQuoteForVehicle.id;
    const vehicleId = foundVehicle._id || foundVehicle.id;

    try {
      const res = await shipperService.assignVehicleToQuote({ quoteId, vehicleId });
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res?.message || 'Vehicle assigned successfully!',
        });
        fetchQuotes();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to assign vehicle.',
        });
      }
    } catch (error: any) {
      console.error('Assign Vehicle Error:', error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to assign vehicle.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
    } finally {
      setSelectedQuoteForVehicle(null);
    }
  };

  const openContractModal = (quote: any) => {
    const url =
      quote?.contract?.url ||
      quote?.shipperContract?.url ||
      (typeof quote?.contract === 'string' ? quote?.contract : null) ||
      (typeof quote?.shipperContract === 'string' ? quote?.shipperContract : null);
    const code = quote?.shipment?.shipmentCode || '';

    if (!url) {
      Toast.show({
        type: 'info',
        text1: 'No Contract',
        text2: 'No contract file available for this quote.',
      });
      return;
    }

    const cleanUrl = url.toLowerCase().split('?')[0];
    const isPdf =
      cleanUrl.endsWith('.pdf') ||
      cleanUrl.includes('.pdf') ||
      cleanUrl.includes('/raw/upload/');

    if (isPdf) {
      navigation.navigate('PdfViewer', {
        url: url,
        title: code ? `Contract (${code})` : 'Shipper Contract',
      });
    } else {
      setSelectedContractData({ url, code, quote });
      setIsContractModalVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    setIsDeleting(true);
    try {
      const res = await shipperService.deleteQuote(quoteToDelete);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Quote deleted successfully',
        });
        setQuotes(prev => prev.filter(q => q?._id !== quoteToDelete && q?.id !== quoteToDelete));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: res?.message || 'Failed to delete quote',
        });
      }
    } catch (error: any) {
      console.error('Delete Quote Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error?.response?.data?.message || 'Failed to delete quote',
      });
    } finally {
      setIsDeleting(false);
      setQuoteToDelete(null);
    }
  };

  const getQuoteCategory = useCallback((q: any) => {
    const quoteStatus = (q?.status || '').toLowerCase();
    const shipmentStatus = (q?.shipment?.status || '').toLowerCase();

    if (
      quoteStatus === 'rejected' ||
      quoteStatus === 'cancelled' ||
      shipmentStatus === 'cancelled' ||
      q?.isCancelled === true
    ) {
      return 'cancelled';
    }

    if (shipmentStatus === 'delivered' || shipmentStatus === 'completed') {
      return 'delivered';
    }

    if (
      shipmentStatus === 'in_transit' ||
      shipmentStatus === 'in-transit' ||
      shipmentStatus === 'on_the_way' ||
      q?.tripStatus === 'in_transit'
    ) {
      return 'in_transit';
    }

    if (
      quoteStatus === 'accepted' ||
      shipmentStatus === 'assigned' ||
      shipmentStatus === 'accepted' ||
      shipmentStatus === 'upcoming'
    ) {
      return 'upcoming';
    }

    if (
      quoteStatus === 'pending' ||
      quoteStatus === 'open_for_offers' ||
      shipmentStatus === 'open_for_offers' ||
      shipmentStatus === 'pending'
    ) {
      return 'pending';
    }

    return 'pending';
  }, []);

  // Compute badge counts for each tab
  const counts = useMemo(() => {
    const res = {
      all: quotes.length,
      in_transit: 0,
      upcoming: 0,
      cancelled: 0,
      pending: 0,
    };

    quotes.forEach(q => {
      const cat = getQuoteCategory(q);
      if (cat in res) {
        (res as any)[cat]++;
      }
    });

    return res;
  }, [quotes, getQuoteCategory]);

  // Filter quotes based on search query and active tab
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const pickup = q?.shipment?.pickupLocation || '';
      const delivery = q?.shipment?.deliveryLocation || '';
      const code = q?.shipment?.shipmentCode || '';

      const matchesSearch =
        !searchQuery.trim() ||
        pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;

      const cat = getQuoteCategory(q);
      return cat === activeTab;
    });
  }, [quotes, searchQuery, activeTab, getQuoteCategory]);

  const renderHeader = () => (
    <>
      {/* Top Header Card */}
      <View style={styles.topCard}>
        <AppText style={styles.topTitle}>My Quotes</AppText>
        <AppText style={styles.topSub}>
          Review shipment offers, contracts, vehicles, and payment status.
        </AppText>

        {/* Search Input Bar Component */}
        <SearchBarCompt
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by pickup or delivery location..."
        />
      </View>

      {/* Horizontal Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          onPress={() => setActiveTab('all')}
        >
          <AppText
            style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}
          >
            All Quotes
          </AppText>
          <View style={styles.badgePill}>
            <AppText style={styles.badgePillText}>
              {counts.all}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'in_transit' && styles.tabBtnActive]}
          onPress={() => setActiveTab('in_transit')}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === 'in_transit' && styles.tabBtnTextActive,
            ]}
          >
            In Transit
          </AppText>
          <View style={styles.badgePill}>
            <AppText style={styles.badgePillText}>
              {counts.in_transit}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === 'upcoming' && styles.tabBtnTextActive,
            ]}
          >
            Upcoming
          </AppText>
          <View style={styles.badgePill}>
            <AppText style={styles.badgePillText}>
              {counts.upcoming}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'cancelled' && styles.tabBtnActive]}
          onPress={() => setActiveTab('cancelled')}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === 'cancelled' && styles.tabBtnTextActive,
            ]}
          >
            Cancelled
          </AppText>
          <View style={styles.badgePill}>
            <AppText style={styles.badgePillText}>
              {counts.cancelled}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
          onPress={() => setActiveTab('pending')}
        >
          <AppText
            style={[
              styles.tabBtnText,
              activeTab === 'pending' && styles.tabBtnTextActive,
            ]}
          >
            Pending
          </AppText>
          <View style={styles.badgePill}>
            <AppText style={styles.badgePillText}>
              {counts.pending}
            </AppText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        icon={FileText}
        title="No Quotes Found"
        message="You haven't submitted any quotes for this filter tab yet."
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Quotes" />
      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={filteredQuotes}
        keyExtractor={(item, index) => item?._id || item?.id || String(index)}
        renderItem={({ item }) => (
          <ShipperQuoteCard
            quote={item}
            onViewContract={openContractModal}
            onDelete={quoteId => setQuoteToDelete(quoteId)}
            onAssignVehicle={handleOpenVehicleSelect}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          filteredQuotes.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Contract Detail Modal */}
      <ContractModal
        visible={isContractModalVisible}
        onClose={() => setIsContractModalVisible(false)}
        contractUrl={selectedContractData?.url}
        shipmentCode={selectedContractData?.code}
        quoteData={selectedContractData?.quote}
      />

      {/* Quote Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={Boolean(quoteToDelete)}
        onClose={() => setQuoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Quote"
        description="Are you sure you want to remove this quote? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Vehicle Selection AppSelect Sheet */}
      <AppSelect
        ref={vehicleSelectRef}
        hideSelector
        label="Select Vehicle to Assign"
        placeholder="Select Vehicle"
        value=""
        options={vehicles.map(v =>
          `${v.make || ''} ${v.model || ''} (${v.vehicleNumber || v.licensePlate || v.type || 'Vehicle'})`.trim(),
        )}
        onSelect={handleSelectVehicle}
        searchable
      />
    </View>
  );
};

export default MyQuotesScreen;
