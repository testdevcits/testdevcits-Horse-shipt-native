import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  Plus,
  Truck,
  Box,
  Layers,
  FileText,
  UserPlus,
  UserCheck,
  Edit,
  Trash2,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import {
  AppHeader,
  AppText,
  AppLoader,
  EmptyState,

  AppSelect,
  AppSelectRef,
} from '../../../../components';
import { COLORS, SPACING } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.myvehicles';

const ConfirmationModal = lazy(() => import("../../../../components/common/ConfirmationModal"));

interface VehicleItemCardProps {
  vehicle: any;
  index: number;
  onAssignDriver: (v: any) => void;
  onEdit: (v: any) => void;
  onDelete: (id: string, num: string) => void;
}

const VehicleItemCard = React.memo(({
  vehicle,
  index,
  onAssignDriver,
  onEdit,
  onDelete,
}: VehicleItemCardProps) => {
  const [imageError, setImageError] = useState(false);
  const vehicleImg =
    vehicle.images && vehicle.images[0]?.url
      ? vehicle.images[0].url
      : null;
  const status = vehicle.verificationStatus || 'PENDING';
  const assignedDriverName = vehicle.driver?.name;

  return (
    <View key={vehicle._id || index} style={styles.vehicleCard}>
      {/* Vehicle Banner Image */}
      <View style={styles.imageContainer}>
        {vehicleImg && !imageError ? (
          <Image
            source={{ uri: vehicleImg }}
            style={styles.vehicleImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Truck size={44} color={COLORS.primary} />
          </View>
        )}
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            status === 'APPROVED'
              ? styles.statusApproved
              : status === 'REJECTED'
                ? styles.statusRejected
                : styles.statusPending,
          ]}
        >
          <AppText
            style={[
              styles.statusBadgeText,
              status === 'APPROVED'
                ? styles.statusApprovedText
                : status === 'REJECTED'
                  ? styles.statusRejectedText
                  : styles.statusPendingText,
            ]}
          >
            {status}
          </AppText>
        </View>
      </View>

      {/* Card Main Info */}
      <View style={styles.cardContent}>
        <AppText style={styles.vehicleNum}>
          {vehicle.vehicleNumber || 'No Plate Number'}
        </AppText>
        <AppText style={styles.vehicleType}>
          {vehicle.vehicleType || 'Truck'} - {vehicle.transportType || 'Trucking'}
        </AppText>

        {/* 2x2 Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specBox}>
            <Truck size={18} color={COLORS.primary} />
            <View style={styles.specBoxTextCol}>
              <AppText style={styles.specLabel}>VIN</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {vehicle.vinNumber || 'N/A'}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <Box size={18} color={COLORS.primary} />
            <View style={styles.specBoxTextCol}>
              <AppText style={styles.specLabel}>Size</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {vehicle.stallSize || 'Standard'}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <Layers size={18} color={COLORS.primary} />
            <View style={styles.specBoxTextCol}>
              <AppText style={styles.specLabel}>Stalls</AppText>
              <AppText style={styles.specValue}>
                {vehicle.numberOfStalls ? String(vehicle.numberOfStalls).padStart(2, '0') : '01'}
              </AppText>
            </View>
          </View>

          <View style={styles.specBox}>
            <Truck size={18} color={COLORS.primary} />
            <View style={styles.specBoxTextCol}>
              <AppText style={styles.specLabel}>Stall Type</AppText>
              <AppText style={styles.specValue} numberOfLines={1}>
                {vehicle.trailerType || 'N/A'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Notes / Spec Description */}
        {vehicle.notes ? (
          <View style={styles.notesBox}>
            <FileText size={18} color={COLORS.primary} />
            <View style={styles.notesTextCol}>
              <AppText style={styles.notesTitle}>Notes</AppText>
              <AppText style={styles.notesText}>{vehicle.notes}</AppText>
            </View>
          </View>
        ) : null}

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => onAssignDriver(vehicle)}
          >
            {assignedDriverName ? (
              <UserCheck size={15} color={COLORS.primary} />
            ) : (
              <UserPlus size={15} color={COLORS.textPrimary} />
            )}
            <AppText
              style={[
                styles.actionPillText,
                assignedDriverName && { color: COLORS.primary, fontFamily: 'PlusJakartaSans-Bold' },
              ]}
              numberOfLines={1}
            >
              {assignedDriverName ? `${assignedDriverName}` : 'Assign Driver'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => onEdit(vehicle)}
          >
            <Edit size={15} color={COLORS.textPrimary} />
            <AppText style={styles.actionPillText}>Edit</AppText>
          </TouchableOpacity>
          {
            vehicle?.currentShipment === null ?
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => onDelete(vehicle._id, vehicle.vehicleNumber)}
              >
                <Trash2 size={15} color="#EF4444" />
                <AppText style={[styles.actionPillText, { color: '#EF4444' }]}>Delete</AppText>
              </TouchableOpacity> :
              <View style={[styles.actionPill, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <AppText style={[styles.actionPillText, { color: '#EF4444' }]}>In-Use</AppText>
              </View>
          }
        </View>
      </View>
    </View>
  );
});

const MyVehiclesScreen = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Driver Assignment State
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedVehicleForDriver, setSelectedVehicleForDriver] = useState<any>(null);
  const driverSelectRef = useRef<AppSelectRef>(null);

  // Delete Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{ id: string; vehicleNum: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVehicles = async () => {
    try {
      const res = await shipperService.getVehicles();
      if (res?.success || res?.vehicles) {
        setVehicles(res?.vehicles || []);
      }
    } catch (error: any) {
      console.error('Fetch Vehicles Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await shipperService.getDrivers();
      if (res?.success || res?.drivers || res?.data) {
        const list = res?.drivers || res?.data || [];
        setDrivers(list);
        return list;
      }
    } catch (error) {
      console.error('Fetch Drivers Error:', error);
    }
    return [];
  };

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      fetchVehicles();
      fetchDrivers();
    });
    fetchVehicles();
    fetchDrivers();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
    fetchDrivers();
  };

  const handleOpenAssignDriver = useCallback(async (vehicle: any) => {
    setSelectedVehicleForDriver(vehicle);
    let currentDrivers = drivers;
    if (!currentDrivers || currentDrivers.length === 0) {
      currentDrivers = await fetchDrivers();
    }

    if (!currentDrivers || currentDrivers.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No Drivers Found',
        text2: 'Please add drivers to your carrier profile first.',
      });
      return;
    }

    driverSelectRef.current?.present();
  }, [drivers]);

  const handleSelectDriver = async (driverDisplayName: string) => {
    if (!selectedVehicleForDriver) return;

    const foundDriver = drivers.find(
      d => (d.name || d.email || 'Unnamed Driver') === driverDisplayName,
    );
    if (!foundDriver) return;

    const driverId = foundDriver._id || foundDriver.id;
    const vehicleId = selectedVehicleForDriver._id;

    try {
      const res = await shipperService.assignDriver(vehicleId, driverId);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.message || 'Driver assigned successfully',
        });
        fetchVehicles();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to assign driver.',
        });
      }
    } catch (error: any) {
      console.error('Assign Driver Error:', error);
      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.raw?.message ||
        'Failed to assign driver.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
    } finally {
      setSelectedVehicleForDriver(null);
    }
  };

  const handleDeleteVehicle = useCallback((id: string, vehicleNum: string) => {
    setSelectedVehicle({ id, vehicleNum });
    setDeleteModalVisible(true);
  }, []);

  const confirmDelete = async () => {
    if (!selectedVehicle) return;
    setDeleting(true);
    try {
      const res = await shipperService.deleteVehicle(selectedVehicle.id);
      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Vehicle deleted successfully.',
        });
        setDeleteModalVisible(false);
        setSelectedVehicle(null);
        fetchVehicles();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to delete vehicle.',
        });
      }
    } catch (error: any) {
      console.error('Delete Vehicle Error:', error);
      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.raw?.message ||
        'Failed to delete vehicle.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNewVehicle = () => {
    navigation.navigate('AddVehicle', {
      onSuccess: fetchVehicles,
    });
  };

  const handleEdit = useCallback((vehicle: any) => {
    navigation.navigate('AddVehicle', {
      vehicleToEdit: vehicle,
      onSuccess: fetchVehicles,
    });
  }, [navigation]);

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
        <Plus size={18} color={COLORS.white} strokeWidth={2.5} />
        <AppText style={styles.addBtnText}>Add Vehicle</AppText>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ paddingVertical: SPACING.lg, alignItems: 'center' }}>
        <EmptyState
          icon={Truck}
          title="No Vehicles Registered"
          message="Add your trucks and trailers to start offering horse transport quotes."
        />
        <TouchableOpacity
          style={[styles.addBtn, { marginTop: SPACING.md, alignSelf: 'center' }]}
          onPress={handleAddNewVehicle}
        >
          <Plus size={18} color={COLORS.white} />
          <AppText style={styles.addBtnText}>+ Add First Vehicle</AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVehicleItem = useCallback(({ item: vehicle, index }: { item: any; index: number }) => {
    return (
      <VehicleItemCard
        key={vehicle._id || index}
        vehicle={vehicle}
        index={index}
        onAssignDriver={handleOpenAssignDriver}
        onEdit={handleEdit}
        onDelete={handleDeleteVehicle}
      />
    );
  }, [handleOpenAssignDriver, handleEdit, handleDeleteVehicle]);

  return (
    <View style={styles.container}>
      <AppHeader title="My Vehicles" showProfileImage={false} />
      <AppLoader visible={loading && !refreshing} />

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
          description={`Are you sure you want to delete vehicle ${selectedVehicle?.vehicleNum || ''}?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={deleting}
        />
      </Suspense>

      {/* AppSelect BottomSheet Modal for Driver Assignment */}
      <AppSelect
        ref={driverSelectRef}
        hideSelector
        label="Select Driver to Assign"
        placeholder="Select Driver"
        value={selectedVehicleForDriver?.driver?.name || ''}
        options={drivers.map(d => d.name || d.email || 'Unnamed Driver')}
        onSelect={handleSelectDriver}
        searchable
      />
    </View>
  );
};

export default MyVehiclesScreen;
