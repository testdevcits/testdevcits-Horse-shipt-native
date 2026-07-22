import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Plus, PackageSearch } from 'lucide-react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../../../../constants';
import {   AppHeader, AppLoader, AppText, EmptyState } from '../../../../components';
import ShipmentCardDetailed from '../../../../components/cards/ShipmentCardDetailed';
import { useShipments } from './useShipments';

const HomeScreen = () => {
  const { shipments, loading, refreshing, refresh } = useShipments();



  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={shipments.slice(0, 2)}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ShipmentCardDetailed
            item={item}
            onPress={() => {/* Navigate to details */ }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refresh(true)}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={!loading ? (
          <EmptyState
            icon={PackageSearch}
            title="No Shipments"
            message="You haven't created any shipment requests yet."
          />
        ) : <AppLoader visible={true} />}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: SPACING.md
  },

  list: {
    paddingBottom: 120 // Extra space for FAB
  },

});

export default HomeScreen;