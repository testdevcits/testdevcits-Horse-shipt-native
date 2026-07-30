import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import {
  Search,
  Truck,
  CreditCard,
  Box,
  RefreshCw,
  FileText,
  Calendar,
  Trash2,
  FileCheck,
} from 'lucide-react-native';
import moment from 'moment';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import imageIndex from '../../../../assets/images/imageIndex';
import ContractModal from './ContractModal';
import styles from './styles.myquotes';

const MyQuotesScreen = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'upcoming' | 'cancelled'>('all');
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<{
    url?: string;
    code?: string;
    quote?: any;
  }>({});

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

    const s = (q.shipment?.status || q.status || '').toLowerCase();

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

  return (
    <View style={styles.container}>
      <AppHeader title="My Quotes" showNotificationBell />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
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
        <View style={styles.tabContainer}>
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
        </View>

        {/* Quotes List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : filteredQuotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No Quotes Found</AppText>
            <AppText style={styles.emptySub}>
              You haven't submitted any quotes for this filter tab yet.
            </AppText>
          </View>
        ) : (
          filteredQuotes.map((quote, index) => {
            const shipment = quote.shipment || {};
            const horsePhoto =
              shipment.horses && shipment.horses[0]?.photo?.url
                ? shipment.horses[0].photo.url
                : null;
            const contractUrl = quote.contract?.url || quote.shipperContract?.url;
            const rawStatus = (shipment.status || quote.status || 'open').toLowerCase();

            let statusLabel = 'In Transit';
            let statusBadgeStyle = styles.badgeInTransit;
            let statusTextStyle = styles.badgeInTransitText;

            if (rawStatus === 'delivered' || rawStatus === 'completed') {
              statusLabel = 'Delivered';
              statusBadgeStyle = styles.badgeDelivered;
              statusTextStyle = styles.badgeDeliveredText;
            } else if (rawStatus === 'assigned' || rawStatus === 'accepted') {
              statusLabel = 'Assigned';
              statusBadgeStyle = styles.badgeAssigned;
              statusTextStyle = styles.badgeAssignedText;
            } else if (rawStatus === 'rejected' || rawStatus === 'cancelled') {
              statusLabel = 'Cancelled';
              statusBadgeStyle = styles.badgeCancelled;
              statusTextStyle = styles.badgeCancelledText;
            }

            return (
              <View key={quote._id || index} style={styles.quoteCard}>
                {/* Banner Image */}
                <View style={styles.imageContainer}>
                  {horsePhoto ? (
                    <Image source={{ uri: horsePhoto }} style={styles.horseBanner} />
                  ) : (
                    <Image source={imageIndex.Banner} style={styles.horseBanner} />
                  )}
                  {/* Status Badge */}
                  <View style={[styles.statusPill, statusBadgeStyle]}>
                    <AppText style={[styles.statusPillText, statusTextStyle]}>
                      {statusLabel}
                    </AppText>
                  </View>
                </View>

                {/* Card Main Info */}
                <View style={styles.cardBody}>
                  <AppText style={styles.shipmentCode}>
                    {shipment.shipmentCode || 'HS-SHIP-2026-CODE'}
                  </AppText>
                  <AppText style={styles.cardSubText}>
                    Review shipment offers, contracts, vehicles, and payment status.
                  </AppText>

                  {/* Pricing */}
                  <View style={styles.priceRow}>
                    <AppText style={styles.priceLabel}>Pricing : </AppText>
                    <AppText style={styles.priceValue}>
                      ${quote.totalPrice || 200}
                    </AppText>
                  </View>

                  {/* 2x2 Specs Grid */}
                  <View style={styles.specsGrid}>
                    <View style={styles.specBox}>
                      <Truck size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specTextCol}>
                        <AppText style={styles.specLabel}>Transport</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {quote.transportType || 'Trucking'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <CreditCard size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specTextCol}>
                        <AppText style={styles.specLabel}>Payment</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {(quote.paymentMethod || 'Card').toUpperCase()}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Box size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specTextCol}>
                        <AppText style={styles.specLabel}>Stall</AppText>
                        <AppText style={styles.specValue}>
                          {quote.stallsRequired ? String(quote.stallsRequired).padStart(2, '0') : '01'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <RefreshCw size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specTextCol}>
                        <AppText style={styles.specLabel}>Refund</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {(quote.payoutStatus || quote.paymentStatus || 'Pending').toUpperCase()}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {/* Notes Container */}
                  {quote.notes ? (
                    <View style={styles.notesContainer}>
                      <FileText size={16} color={COLORS.goldPrimary} style={{ marginTop: 2 }} />
                      <AppText style={styles.notesText}>
                        <AppText style={{ fontFamily: FONTS.bold }}>Notes : </AppText>
                        {quote.notes.trim()}
                      </AppText>
                    </View>
                  ) : null}

                  {/* Cancel Notice Container */}
                  <View style={styles.cancelNoticeContainer}>
                    <Calendar size={16} color="#EF4444" style={{ marginTop: 2 }} />
                    <AppText style={styles.cancelNoticeText}>
                      Cancel before : {moment().add(1, 'days').format('M/DD/YYYY, h:mm:ss A')}
                    </AppText>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.viewContractBtn}
                      onPress={() => openContractModal(quote)}
                      activeOpacity={0.8}
                    >
                      <FileCheck size={16} color={COLORS.white} />
                      <AppText style={styles.viewContractBtnText}>View Contract</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() =>
                        Alert.alert('Delete Quote', 'Are you sure you want to remove this quote?')
                      }
                      activeOpacity={0.8}
                    >
                      <Trash2 size={16} color={COLORS.textPrimary} />
                      <AppText style={styles.deleteBtnText}>Delete</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Contract Modal with WebView Preview */}
      <ContractModal
        visible={isContractModalVisible}
        onClose={() => setIsContractModalVisible(false)}
        contractUrl={selectedContractData.url}
        shipmentCode={selectedContractData.code}
        quoteData={selectedContractData.quote}
      />
    </View>
  );
};

export default MyQuotesScreen;
