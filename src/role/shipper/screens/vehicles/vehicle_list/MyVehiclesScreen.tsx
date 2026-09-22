import React, { useCallback, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';

import {
  AppHeader,
  AppText,
  EmptyState,
  ShipmentsSkeleton,
  VehicleItemCard,
} from '../../../../../components';
import { COLORS, SPACING } from '../../../../../constants';
import styles from './styles.myvehicles';
import AppIcon from '../../../../../components/app_icon/AppIcon';

import useVehicleList from './useVehicleList';

const ConfirmationModal = lazy(
  () =>
    import(
      '../../../../../components/common/ConfirmationModal/ConfirmationModal'
    ),
);
const AppSelect = lazy(
  () => import('../../../../../components/common/AppSelect/AppSelect'),
);

const MyVehiclesScreen = ({ navigation }: any) => {
  const {
    vehicles,
    loading,
    refreshing,
    deleteModalVisible,
    deleting,
    handleOpenAssignDriver,
    handleSelectDriver,
    handleDeleteVehicle,
    confirmDelete,
    handleAddNewVehicle,
    handleEdit,
    setDeleteModalVisible,
    onRefresh,
    setSelectedVehicle,
    selectedVehicle,
    driverSelectRef,
    selectedVehicleForDriver,
    drivers,
  } = useVehicleList({ navigation });

  const renderHeader = () => (
    <View style={styles.topCard}>
      <View style={styles.topCardTextCol}>
        <AppText style={styles.topCardTitle}>My Registered Vehicles</AppText>
        <AppText style={styles.topCardSub}>
          {vehicles.length} vehicle(s) added to your carrier profile
        </AppText>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={handleAddNewVehicle}
        activeOpacity={0.8}
      >
        <AppIcon
          name={'Plus'}
          size={18}
          color={COLORS.white}
          strokeWidth={2.5}
        />
        <AppText style={styles.addBtnText}>Add Vehicle</AppText>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ paddingVertical: SPACING.lg, alignItems: 'center' }}>
        <EmptyState
          icon={<AppIcon name={'Truck'} size={18} color={COLORS.primary} />}
          title="No Vehicles Registered"
          message="Add your trucks and trailers to start offering horse transport quotes."
        />
        <TouchableOpacity
          style={[
            styles.addBtn,
            { marginTop: SPACING.md, alignSelf: 'center' },
          ]}
          onPress={handleAddNewVehicle}
        >
          <AppIcon
            name={'Plus'}
            size={18}
            color={COLORS.white}
            strokeWidth={2.5}
          />
          <AppText style={styles.addBtnText}>+ Add First Vehicle</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVehicleItem = useCallback(
    ({ item: vehicle, index }: { item: any; index: number }) => {
      return (
        <VehicleItemCard
          key={vehicle?._id || index}
          vehicle={vehicle}
          index={index}
          onAssignDriver={handleOpenAssignDriver}
          onEdit={handleEdit}
          onDelete={handleDeleteVehicle}
        />
      );
    },
    [handleOpenAssignDriver, handleEdit, handleDeleteVehicle],
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="My Vehicles" showProfileImage={false} />
        <ShipmentsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="My Vehicles" showProfileImage={false} />

      <FlatList
        data={vehicles}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={renderVehicleItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          vehicles.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Confirmation Modal for Vehicle Deletion */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={deleteModalVisible}
          onClose={() => {
            if (!deleting) {
              setDeleteModalVisible(false);
              setSelectedVehicle(null);
            }
          }}
          onConfirm={confirmDelete}
          title="Delete Vehicle"
          description={`Are you sure you want to delete vehicle ${
            selectedVehicle?.vehicleNum || ''
          }?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={deleting}
        />
      </Suspense>

      {/* AppSelect BottomSheet Modal for Driver Assignment */}
      <Suspense fallback={null}>
        <AppSelect
          ref={driverSelectRef}
          hideSelector
          label="Select Driver to Assign"
          placeholder="Select Driver"
          value={selectedVehicleForDriver?.driver?.name || 'Not Available'}
          options={drivers.map(d => d.name || d.email || 'Not Available')}
          onSelect={handleSelectDriver}
          searchable
        />
      </Suspense>
    </View>
  );
};

export default MyVehiclesScreen;
