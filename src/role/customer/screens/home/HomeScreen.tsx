import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Plus, PackageSearch } from 'lucide-react-native';
import { COLORS, SPACING, FONTS, RADIUS } from '../../../../constants';
import { AppLoader, AppText, EmptyState } from '../../../../components';
import ShipmentCardDetailed from '../../../../components/cards/ShipmentCardDetailed';
import { useShipments } from './useShipments';

const HomeScreen = () => {
  const { shipments, loading, refreshing, refresh } = useShipments();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <AppText style={styles.title}>My Shipments</AppText>
      <AppText style={styles.subtitle}>Manage your active and past equine transports</AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shipments.slice(0, 2)}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Plus color={COLORS.white} size={30} />
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginTop: 4
  },
  list: {
    paddingBottom: 120 // Extra space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  }
});

export default HomeScreen;