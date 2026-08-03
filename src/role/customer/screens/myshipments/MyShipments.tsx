import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
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

const MyShipments = ({ navigation }: { navigation?: any }) => {
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

  const handleShipmentPress = useCallback((item: any) => {
    navigation?.navigate('MyShipmentDetails', {
      item: item,
      quoteId: item?.quoteId,
    });
  }, [navigation]);

  const keyExtractor = useCallback((item: any) => item?._id || String(Math.random()), []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ShipmentHorizontalCard
      item={item}
      onPress={() => handleShipmentPress(item)}
    />
  ), [handleShipmentPress]);

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
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        renderItem={renderItem}
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
