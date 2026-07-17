import React from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Truck } from 'lucide-react-native';
import { COLORS, SPACING, FONTS } from '../../../../constants';
import useMyShipments, { ShipmentTab } from './usemyshipments';
import { AppHeader, AppLoader, AppText, EmptyState, ShipmentCard } from '../../../../components';


const MyShipments = ({ navigation }) => {
  const { filteredData, loading, refreshing, activeTab, setActiveTab, counts, fetchShipments } = useMyShipments();

  const tabs: ShipmentTab[] = ['Upcoming', 'Draft', 'In Progress', 'Completed', 'Cancelled'];

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
        <AppText style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</AppText>
        <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
          <AppText style={[styles.countText, isActive && styles.activeCountText]}>{count}</AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Shipments" />

      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ShipmentCard item={item} onView={() => { navigation.navigate("MyShipmentDetails", { item: item }) }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchShipments} />}
        ListEmptyComponent={!loading ? (
          <EmptyState
            icon={Truck}
            title={`No ${activeTab} Shipments`}
            message="Your shipments will appear here once they reach this stage."
          />
        ) : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabWrapper: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  tabScroll: { paddingHorizontal: SPACING.md, paddingVertical: 12 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20
  },
  activeTab: { backgroundColor: COLORS.goldPrimary },
  tabText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },
  countBadge: { backgroundColor: COLORS.grey200, paddingHorizontal: 6, borderRadius: 10, marginLeft: 6 },
  activeCountBadge: { backgroundColor: 'rgba(255,255,255,0.3)' },
  countText: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  activeCountText: { color: COLORS.white },
  list: { padding: SPACING.md, paddingBottom: 40 },
});

export default MyShipments;