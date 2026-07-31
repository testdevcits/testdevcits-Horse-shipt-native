import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Plus, User } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import {
  AppHeader,
  AppText,
  AppLoader,
  EmptyState,
  TruckDriverCard,
  ConfirmationModal,
  SearchBarCompt,
  AppSelect,
} from '../../../../components';
import { COLORS, SPACING } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import AddDriverModal from './AddDriverModal';
import styles from './styles.truckdriver';

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

  const handleToggleStatus = async (id: string, currentActiveStatus: boolean) => {
    try {
      const res = await shipperService.toggleDriverStatus(id, !currentActiveStatus);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Driver ${!currentActiveStatus ? 'activated' : 'deactivated'} successfully.`,
        });
        fetchDrivers();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Failed to update driver status.',
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

  const renderHeader = () => (
    <View style={styles.topCard}>
      <AppText style={styles.topTitle}>Truck Driver Management</AppText>
      <AppText style={styles.topSub}>
        Manage driver profiles, contact details, and license verification.
      </AppText>

      {/* Search Bar Component */}
      <SearchBarCompt
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by driver name or email..."
        containerStyle={{ marginBottom: SPACING.md }}
      />

      {/* Filters & Add Driver Row */}
      <View style={styles.filtersRow}>
        <View style={{ flex: 1, marginRight: SPACING.xs }}>
          <AppSelect
            placeholder="Filter Status"
            value={
              selectedStatus === 'active'
                ? 'Active'
                : selectedStatus === 'inactive'
                  ? 'Inactive'
                  : 'All'
            }
            options={['All', 'Active', 'Inactive']}
            onSelect={(item: string) => {
              if (item === 'Active') setSelectedStatus('active');
              else if (item === 'Inactive') setSelectedStatus('inactive');
              else setSelectedStatus('');
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.addDriverBtn, { height: 46, justifyContent: 'center' }]}
          onPress={() => {
            setSelectedDriverToEdit(null);
            setIsAddModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Plus size={18} color={COLORS.white} strokeWidth={2.5} />
          <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          icon={User}
          title="No Drivers Found"
          message="Add drivers to your fleet to assign them to transport vehicles and trips."
        />
        <TouchableOpacity
          style={[styles.addDriverBtn, { marginTop: SPACING.md, alignSelf: 'center' }]}
          onPress={() => {
            setSelectedDriverToEdit(null);
            setIsAddModalVisible(true);
          }}
        >
          <Plus size={18} color={COLORS.white} />
          <AppText style={styles.addDriverBtnText}>Add Driver</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Truck Driver Management" />
      <AppLoader visible={loading && !refreshing} />

      <FlatList
        data={drivers}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TruckDriverCard
            driver={item}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriverPrompt}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.scrollContent,
          drivers.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      />

      {/* Add / Edit Driver Modal */}
      <AddDriverModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchDrivers}
        driverToEdit={selectedDriverToEdit}
      />

      {/* Delete Driver Confirmation Modal */}
      <ConfirmationModal
        isVisible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedDriverToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Driver"
        description={`Are you sure you want to delete driver ${selectedDriverToDelete?.name || ''}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </View>
  );
};

export default TruckDriverScreen;
