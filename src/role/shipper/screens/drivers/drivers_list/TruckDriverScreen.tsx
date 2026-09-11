import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  AppHeader,
  AppText,
  EmptyState,
  TruckDriverCard,
  SearchBarCompt,
  ShippersListSkeleton,
} from '../../../../../components';
import { COLORS, ICON_SIZE, SPACING } from '../../../../../constants';
import shipperService from '../../../../../api/services/shipperService';
import AddDriverModal from '../add_update_drivers/AddDriverModal';
import styles from './styles.truckdriver';
import AppIcon from '../../../../../components/AppIcon';

const ConfirmationModal = lazy(
  () => import('../../../../../components/common/ConfirmationModal'),
);

const TruckDriverScreen = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // '' | 'active' | 'inactive'
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedDriverToEdit, setSelectedDriverToEdit] = useState<any>(null);

  // Delete Driver Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDriverToDelete, setSelectedDriverToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await shipperService.getDrivers({
        page: 1,
        limit: 100,
        search: searchQuery,
        status: selectedStatus,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      const driverList = res?.data || res?.drivers || [];
      setDrivers(driverList);
    } catch (error: any) {
      console.error('Fetch Drivers Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [searchQuery, selectedStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const handleToggleStatus = async (
    id: string,
    currentActiveStatus: boolean,
  ) => {
    try {
      const res = await shipperService.toggleDriverStatus(
        id,
        !currentActiveStatus,
      );
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Driver ${
            !currentActiveStatus ? 'activated' : 'deactivated'
          } successfully.`,
        });
        fetchDrivers();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message || 'Failed to update driver status.',
      });
    }
  };

  const handleDeleteDriverPrompt = (id: string, driverName: string) => {
    setSelectedDriverToDelete({ id, name: driverName });
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDriverToDelete) return;
    setIsDeleting(true);
    try {
      const res = await shipperService.deleteDriver(selectedDriverToDelete.id);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Driver deleted successfully.',
        });
        setDeleteModalVisible(false);
        setSelectedDriverToDelete(null);
        fetchDrivers();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to delete driver.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditDriver = (driver: any) => {
    setSelectedDriverToEdit(driver);
    setIsAddModalVisible(true);
  };

  const totalCount = drivers.length;
  const activeCount = drivers.filter(d => d?.isActive ?? true).length;
  const inactiveCount = totalCount - activeCount;

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
            <AppText style={[styles.statNumber, { color: '#10B981' }]}>
              {activeCount}
            </AppText>
            <AppText style={styles.statLabel}>Active</AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <AppText style={[styles.statNumber, { color: '#64748B' }]}>
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
