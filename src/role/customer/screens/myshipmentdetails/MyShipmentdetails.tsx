import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  MapPin,
  Calendar,
  Truck,
  User,
  ChevronRight,
  FileText,
  ExternalLink,
  MessageCircle,
  Star,
  Users,
  Search,
} from 'lucide-react-native';
import moment from 'moment';
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONT_SIZE,
} from '../../../../constants';
import { AppHeader, AppText, AppLoader } from '../../../../components';
import useShipmentDetails from './useShipementDetails';

// Modals
import RatingModal from './RatingModal';
import QuoteDetailModal from './QuoteDetailModal';
import styles from './style.myshipments';

const TABS = ['Overview', 'Quotes', 'Questions', 'Find Shipper'];

const MyShipmentDetails = ({ route }: any) => {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState('Overview');
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const {
    shipment,
    quotes,
    questions,
    matchingShippers,
    invitedShippers,
    loading,
    refreshing,
    onRefresh,
  } = useShipmentDetails(item._id);

  // Use hook data or fallback to route item
  const data = shipment || item;

  if (loading && !refreshing) return <AppLoader visible={true} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewTab data={data} onReview={() => setIsRatingVisible(true)} />
        );
      case 'Quotes':
        return <QuotesTab quotes={quotes} onSelectQuote={setSelectedQuote} />;
      case 'Questions':
        return <QuestionsTab questions={questions} />;
      case 'Find Shipper':
        return (
          <FindShipperTab
            matching={matchingShippers}
            invited={invitedShippers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader showBack={true} title={data.shipmentCode} />

      {/* HEADER SECTION */}
      <View style={styles.headerInfo}>
        <View style={styles.headerTop}>
          <AppText style={styles.shipmentTitle}>Shipment Title</AppText>
          <View style={styles.statusBadge}>
            <AppText style={styles.statusText}>
              {(data.status || 'OPEN').replace('_', ' ').toUpperCase()}
            </AppText>
          </View>
        </View>
        <AppText style={styles.shipmentId}>{data.shipmentCode}</AppText>
      </View>

      {/* TABS BAR */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            let badgeCount = 0;
            if (tab === 'Quotes') badgeCount = quotes.length;
            if (tab === 'Questions') badgeCount = questions.length;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <AppText
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab}
                </AppText>
                {badgeCount > 0 && (
                  <View
                    style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
                  >
                    <AppText style={styles.tabBadgeText}>{badgeCount}</AppText>
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
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {renderTabContent()}
      </ScrollView>

      {/* MODALS */}
      <RatingModal
        visible={isRatingVisible}
        onClose={() => setIsRatingVisible(false)}
        shipperName={data.shipper?.name || 'Shipper'}
        shipmentTitle={data.shipmentCode}
      />
      <QuoteDetailModal
        visible={!!selectedQuote}
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />
    </SafeAreaView>
  );
};

export default MyShipmentDetails;
/**
 * TAB 1: OVERVIEW
 */
const OverviewTab = ({ data, onReview }: any) => (
  <View>
    <View style={styles.subHeaderBar}>
      <AppText style={styles.subHeaderText}>
        Total horses : {data.numberOfHorses}
      </AppText>
    </View>

    <View style={styles.card}>
      <View style={styles.routeItem}>
        <MapPin size={20} color={COLORS.goldPrimary} />
        <View style={styles.routeInfo}>
          <AppText style={styles.routeTitle}>Pickup</AppText>
          <AppText style={styles.routeAddress}>{data.pickupLocation}</AppText>
          <View style={styles.routeDateRow}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <AppText style={styles.routeDate}>
              {moment(data.pickupDateRange.start).format('MMMM DD, YYYY')}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.routeTimeline} />
      <View style={styles.routeItem}>
        <MapPin size={20} color={COLORS.goldPrimary} />
        <View style={styles.routeInfo}>
          <AppText style={styles.routeTitle}>Delivery</AppText>
          <AppText style={styles.routeAddress}>{data.deliveryLocation}</AppText>
          <View style={styles.routeDateRow}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <AppText style={styles.routeDate}>
              {moment(data.deliveryDateRange.start).format('MMMM DD, YYYY')}
            </AppText>
          </View>
        </View>
      </View>
    </View>

    <AppText style={styles.sectionLabel}>Shipper Details</AppText>
    <View style={styles.card}>
      <View style={styles.shipperProfileRow}>
        <View style={styles.avatarCircle}>
          <User size={20} color={COLORS.goldPrimary} />
        </View>
        <AppText style={styles.shipperName}>
          {data.shipper?.name || 'Searching for Shipper...'}
        </AppText>
        <TouchableOpacity style={styles.iconBtn}>
          <MessageCircle size={20} color={COLORS.goldPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardActionRow}>
        <TouchableOpacity style={styles.btnOutline}>
          <AppText style={styles.btnOutlineText}>Quote details</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnFilled} onPress={onReview}>
          <AppText style={styles.btnFilledText}>Review</AppText>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/**
 * TAB 2: QUOTES
 */
const QuotesTab = ({ quotes, onSelectQuote }: any) => (
  <View>
    <View style={styles.subHeaderBar}>
      <AppText style={styles.subHeaderText}>
        Total quotes : {quotes.length}
      </AppText>
    </View>
    <View style={styles.listHeader}>
      <AppText style={styles.listHeaderText}>Service provider</AppText>
      <AppText style={styles.listHeaderText}>Price (USD)</AppText>
    </View>
    {quotes.map((q: any) => (
      <TouchableOpacity
        key={q._id}
        style={styles.quoteCard}
        onPress={() => onSelectQuote(q)}
      >
        <View style={styles.quoteProvider}>
          <View style={styles.avatarSmall} />
          <View>
            <AppText style={styles.quoteName}>{q.shipper.name}</AppText>
            <View style={styles.stars}>
              <Star
                size={10}
                color={COLORS.goldPrimary}
                fill={COLORS.goldPrimary}
              />
            </View>
          </View>
        </View>
        <View style={styles.priceRow}>
          <AppText style={styles.priceVal}>${q.totalPrice}</AppText>
          <ChevronRight size={18} color={COLORS.textLight} />
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

/**
 * TAB 3: QUESTIONS
 */
const QuestionsTab = ({ questions }: any) => (
  <View style={styles.emptyWrap}>
    {questions.length === 0 ? (
      <>
        <MessageCircle size={48} color={COLORS.grey200} />
        <AppText style={styles.emptyText}>No questions asked yet.</AppText>
      </>
    ) : (
      <AppText style={{ color: COLORS.textPrimary }}>
        Question list implementation here...
      </AppText>
    )}
  </View>
);

/**
 * TAB 4: FIND SHIPPER
 */
const FindShipperTab = ({ matching, invited }: any) => (
  <View>
    <View style={styles.subHeaderBar}>
      <AppText style={styles.subHeaderText}>Find Top Rated Shippers</AppText>
    </View>
    <View style={styles.card}>
      <AppText style={styles.inviteTitle}>Invite Shippers</AppText>
      <AppText style={styles.inviteSub}>
        Select shippers from our top-rated network to invite them to quote.
      </AppText>
      <TouchableOpacity style={styles.searchBtn}>
        <Search size={18} color={COLORS.white} />
        <AppText style={styles.searchBtnText}>Search Shippers</AppText>
      </TouchableOpacity>
    </View>
  </View>
);
