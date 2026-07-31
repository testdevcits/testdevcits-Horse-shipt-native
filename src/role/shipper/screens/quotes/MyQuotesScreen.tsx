import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
} from 'react-native';
import { Search, FileText } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppHeader, AppText, ConfirmationModal } from '../../../../components';
import { COLORS } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import ContractModal from './ContractModal';
import ShipperQuoteCard from './ShipperQuoteCard';
import styles from './styles.myquotes';

const MyQuotesScreen = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
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
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuotes();
  };

  const openContractModal = (quote: any) => {
    const url = quote.contract?.url || quote.shipperContract?.url;
    const code = quote.shipment?.shipmentCode || 'HS-SHIP-2026-CE9DC1';
    setSelectedContractData({ url, code, quote });
    setIsContractModalVisible(true);
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
        setQuotes(prev => prev.filter(q => q._id !== quoteToDelete && q.id !== quoteToDelete));
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

  // Count pending quotes
  const pendingCount = quotes.filter(q => {
    const s = (q.status || q.shipment?.status || '').toLowerCase();
    return s === 'pending' || s === 'open_for_offers';
  }).length;

  // Count active in-transit quotes
  const inTransitCount = quotes.filter(q => {
    const s = (q.shipment?.status || q.status || '').toLowerCase();
    return s === 'in_transit' || s === 'on_the_way' || s === 'assigned';
  }).length;

  // Filter quotes based on search query and active tab
  const filteredQuotes = quotes.filter(q => {
    const pickup = q.shipment?.pickupLocation || '';
    const delivery = q.shipment?.deliveryLocation || '';
    const code = q.shipment?.shipmentCode || '';

    const matchesSearch =
      !searchQuery.trim() ||
      pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const s = (q.status || q.shipment?.status || '').toLowerCase();

    if (activeTab === 'pending') {
      return s === 'pending' || s === 'open_for_offers';
    }
    if (activeTab === 'in_transit') {
      return s === 'in_transit' || s === 'on_the_way' || s === 'assigned';
    }
    if (activeTab === 'upcoming') {
      return s === 'open' || s === 'accepted' || s === 'published';
    }
    if (activeTab === 'cancelled') {
      return s === 'rejected' || s === 'cancelled' || s === 'delivered';
    }

    return true;
  });

  const renderHeader = () => (
    <>
      {/* Top Header Card */}
      <View style={styles.topCard}>
        <AppText style={styles.topTitle}>My Quotes</AppText>
        <AppText style={styles.topSub}>
          Review shipment offers, contracts, vehicles, and payment status.
        </AppText>

        {/* Search Input Bar */}
        <View style={styles.searchBarContainer}>
          <Search size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by pickup or delivery location..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
          {pendingCount > 0 && (
            <View style={styles.badgePill}>
              <AppText style={styles.badgePillText}>
                {String(pendingCount).padStart(2, '0')}
              </AppText>
            </View>
          )}
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
          {inTransitCount > 0 && (
            <View style={styles.badgePill}>
              <AppText style={styles.badgePillText}>
                {String(inTransitCount).padStart(2, '0')}
              </AppText>
            </View>
          )}
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
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.goldPrimary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <FileText size={48} color={COLORS.textLight} />
        <AppText style={styles.emptyTitle}>No Quotes Found</AppText>
        <AppText style={styles.emptySub}>
          You haven't submitted any quotes for this filter tab yet.
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Quotes" />

      <FlatList
        data={loading ? [] : filteredQuotes}
        keyExtractor={(item, index) => item._id || item.id || String(index)}
        renderItem={({ item }) => (
          <ShipperQuoteCard
            quote={item}
            onViewContract={openContractModal}
            onDelete={quoteId => setQuoteToDelete(quoteId)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Contract Detail Modal */}
      <ContractModal
        visible={isContractModalVisible}
        onClose={() => setIsContractModalVisible(false)}
        contractUrl={selectedContractData.url}
        shipmentCode={selectedContractData.code}
        quoteData={selectedContractData.quote}
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
      />
    </View>
  );
};

export default MyQuotesScreen;
