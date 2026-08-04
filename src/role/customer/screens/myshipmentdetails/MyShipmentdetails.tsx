import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';

import { COLORS } from '../../../../constants';
import { AppHeader, AppText, AppLoader } from '../../../../components';
import useShipmentDetails from './useShipementDetails';

// Modals & Tabs
import RatingModal from './RatingModal';
import QuoteDetailModal from './QuoteDetailModal';
import styles from './style.myshipments';
import OverviewTab from './tabs/OverviewTab';
import QuotesTab from './tabs/QuotesTab';
import QuestionsTab from './tabs/QuestionsTab';
import FindShipperTab from './tabs/FindShipperTab';
import { Dot, Pencil } from 'lucide-react-native';
import { getFormattedDate } from '../../../../utils/helpers';
import { useNavigation } from '@react-navigation/native';

const TABS = ['Overview', 'Quotes', 'Questions', 'Find Shipper'];

const MyShipmentDetails = ({ route, }: any) => {
  const { item, quoteId } = route.params;
  const [activeTab, setActiveTab] = useState('Overview');
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const navigation = useNavigation()

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

  const handleEditShipment = () => {
    (navigation as any).navigate('NewShipment', {
      isEdit: true,
      shipmentData: data,
    });
  };

  if (loading && !refreshing) return <AppLoader visible={true} />;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewTab
            data={data}
            onReview={() => setIsRatingVisible(true)}
            quoteId={quoteId}
          />
        );
      case 'Quotes':
        return <QuotesTab quotes={quotes} onSelectQuote={setSelectedQuote} />;
      case 'Questions':
        return <QuestionsTab questions={questions} onRefresh={onRefresh} />;
      case 'Find Shipper':
        return (
          <FindShipperTab
            matching={matchingShippers}
            invited={invitedShippers}
            shipmentId={item?._id}
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

              {
                data?.status !== "delivered" &&
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
                  <AppText style={{ color: COLORS.primary, fontSize: 13 }}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              }

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
              {TABS.map(tab => {
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
          <RatingModal
            visible={isRatingVisible}
            onClose={() => setIsRatingVisible(false)}
            shipperName={data?.shipper?.name || 'Shipper'}
            shipmentTitle={data?.shipmentCode}
            shipperId={data?.shipper?._id || data?.shipper}
            shipmentId={data?._id}
          />
          <QuoteDetailModal
            visible={!!selectedQuote}
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyShipmentDetails;
