import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Truck } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../../../../constants';
import useMyShipments, { ShipmentTab } from './usemyshipments';
import {
  AppHeader,
  AppLoader,
  AppText,
  EmptyState,
  ShipmentCard,
} from '../../../../components';
import ShipmentHorizontalCard from '../../../../components/cards/ShipmentCardDetailed';
import styles from './styles.myshipments';

const MyShipments = ({ navigation }) => {
  const {
    filteredData,
    loading,
    refreshing,
    activeTab,
    setActiveTab,
    counts,
    fetchShipments,
  } = useMyShipments();

  const tabs: ShipmentTab[] = [
    'Upcoming',
    'Draft',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  const renderTab = (tab: ShipmentTab) => {
    const isActive = activeTab === tab;
    // Map count keys
    const countKey = tab.replace(' ', '') as keyof typeof counts;
    const count = counts[countKey] || 0;

    return (
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[styles.tab, isActive && styles.activeTab]}
      >
        <AppText style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab}
        </AppText>
        <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
          <AppText
            style={[styles.countText, isActive && styles.activeCountText]}
          >
            {count}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Shipments" />

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={filteredData}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ShipmentHorizontalCard
            item={item}
            onPress={() => {
              navigation.navigate('MyShipmentDetails', {
                item: item,
                quoteId: item?.quoteId,
              });
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchShipments} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon={Truck}
              title={`No ${activeTab} Shipments`}
              message="Your shipments will appear here once they reach this stage."
            />
          ) : null
        }
      />
    </View>
  );
};

export default MyShipments;
