import React, { useCallback, lazy, Suspense } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import {
  AppHeader,
  AppText,
  EmptyState,
  TruckDriverCard,
  SearchBarCompt,
  ShippersListSkeleton,
} from '../../../../../components';
import { COLORS, ICON_SIZE, SPACING } from '../../../../../constants';
import AddDriverModal from '../add_update_drivers/AddDriverModal';
import styles from './styles.truckdriver';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import useDriverList from './useDriverList';

const ConfirmationModal = lazy(
  () =>
    import(
      '../../../../../components/common/ConfirmationModal/ConfirmationModal'
    ),
);

const TruckDriverScreen = () => {
  const {
    loading,
    refreshing,
    setSearchQuery,
    setSelectedStatus,
    isAddModalVisible,
    selectedDriverToEdit,
    deleteModalVisible,
    isDeleting,
    onRefresh,
    handleToggleStatus,
    handleDeleteDriverPrompt,
    handleConfirmDelete,
    handleEditDriver,
    inactiveCount,
    setSelectedDriverToEdit,
    setIsAddModalVisible,
    totalCount,
    activeCount,
    searchQuery,
    selectedStatus,
    drivers,
    setDeleteModalVisible,
    fetchDrivers,
    setSelectedDriverToDelete,
    selectedDriverToDelete,
  } = useDriverList();

  const renderHeader = () => (
    <View style={styles.topCard}>
      {/* Header Banner Card with Metrics */}
      <View style={styles.headerBannerCard}>
        <View style={styles.topTitleRow}>
          <AppText style={styles.topTitle}>Truck Driver Management</AppText>
          <TouchableOpacity
            style={styles.addDriverBtn}
            onPress={() => {
              setSelectedDriverToEdit(null);
              setIsAddModalVisible(true);
            }}
            activeOpacity={0.85}
          >
            <AppIcon
              name="Plus"
              size={16}
              color={COLORS.white}
              strokeWidth={2.5}
            />
            <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
          </TouchableOpacity>
        </View>
        <AppText style={styles.topSub}>
          Manage your fleet drivers, licenses, and availability status.
        </AppText>

        <View style={styles.statsSummaryRow}>
          <View style={styles.statBox}>
            <AppText style={styles.statNumber}>{totalCount}</AppText>
            <AppText style={styles.statLabel}>Total Fleet</AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <AppText style={[styles.statNumber, { color: COLORS.success }]}>
              {activeCount}
            </AppText>
            <AppText style={styles.statLabel}>Active</AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <AppText
              style={[styles.statNumber, { color: COLORS.textSecondary }]}
            >
              {inactiveCount}
            </AppText>
            <AppText style={styles.statLabel}>Inactive</AppText>
          </View>
        </View>
      </View>

      {/* Search Input Bar */}
      <SearchBarCompt
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by driver name, email or license..."
        containerStyle={{ marginBottom: SPACING.sm }}
      />

      {/* Status Filter Pills Row */}
      <View style={styles.filterPillsRow}>
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedStatus === '' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedStatus('')}
          activeOpacity={0.7}
        >
          <AppText
            style={[
              styles.filterPillText,
              selectedStatus === '' && styles.filterPillTextActive,
            ]}
          >
            All Drivers ({totalCount})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedStatus === 'active' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedStatus('active')}
          activeOpacity={0.7}
        >
          <AppText
            style={[
              styles.filterPillText,
              selectedStatus === 'active' && styles.filterPillTextActive,
            ]}
          >
            Active ({activeCount})
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedStatus === 'inactive' && styles.filterPillActive,
          ]}
          onPress={() => setSelectedStatus('inactive')}
          activeOpacity={0.7}
        >
          <AppText
            style={[
              styles.filterPillText,
              selectedStatus === 'inactive' && styles.filterPillTextActive,
            ]}
          >
            Inactive ({inactiveCount})
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          icon={
            <AppIcon
              name={'User'}
              size={ICON_SIZE.xl}
              color={COLORS.lightGrey}
              strokeWidth={1.5}
            />
          }
          title="No Drivers Found"
          message="Add drivers to your fleet to assign them to transport vehicles and active trips."
        />
        <TouchableOpacity
          style={[
            styles.addDriverBtn,
            { marginTop: SPACING.md, alignSelf: 'center' },
          ]}
          onPress={() => {
            setSelectedDriverToEdit(null);
            setIsAddModalVisible(true);
          }}
          activeOpacity={0.85}
        >
          <AppIcon
            name="Plus"
            size={18}
            color={COLORS.white}
            strokeWidth={2.5}
          />
          <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = useCallback(
    (item: any, index: number) => item?._id || index.toString(),
    [],
  );

  const renderDriverItem = useCallback(
    ({ item }: { item: any }) => (
      <TruckDriverCard
        driver={item}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditDriver}
        onDelete={handleDeleteDriverPrompt}
      />
    ),
    [handleToggleStatus, handleEditDriver, handleDeleteDriverPrompt],
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppHeader title="Truck Driver Management" showProfileImage={false} />
        <ShippersListSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Truck Driver Management" showProfileImage={false} />

      <FlatList
        data={drivers}
        keyExtractor={keyExtractor}
        renderItem={renderDriverItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Add / Edit Driver Modal */}
      <AddDriverModal
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setSelectedDriverToEdit(null);
        }}
        onSuccess={fetchDrivers}
        driverToEdit={selectedDriverToEdit}
      />

      {/* Delete Driver Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmationModal
          isVisible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setSelectedDriverToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Driver"
          description={`Are you sure you want to delete driver ${
            selectedDriverToDelete?.name || ''
          }?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </Suspense>
    </View>
  );
};

export default TruckDriverScreen;
