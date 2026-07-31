import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
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
  ConfirmationModal,
  AppSelect,
  AppSelectRef,
} from '../../../../components';
import { COLORS, SPACING } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.myvehicles';

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
        setVehicles(res.vehicles || []);
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

  const handleOpenAssignDriver = async (vehicle: any) => {
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
  };

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

  const handleDeleteVehicle = (id: string, vehicleNum: string) => {
    setSelectedVehicle({ id, vehicleNum });
    setDeleteModalVisible(true);
  };

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

  const handleEdit = (vehicle: any) => {
    navigation.navigate('AddVehicle', {
      vehicleToEdit: vehicle,
      onSuccess: fetchVehicles,
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Vehicles" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.goldPrimary}
          />
        }
      >
        {/* Top Header Card */}
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

        {/* Vehicles List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Truck size={48} color={COLORS.textLight} />
            <AppText style={styles.emptyTitle}>No Vehicles Registered</AppText>
            <AppText style={styles.emptySub}>
              Add your trucks and trailers to start offering horse transport quotes.
            </AppText>
            <TouchableOpacity
              style={[styles.addBtn, { marginTop: SPACING.md }]}
              onPress={handleAddNewVehicle}
            >
              <Plus size={18} color={COLORS.white} />
              <AppText style={styles.addBtnText}>+ Add First Vehicle</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          vehicles.map((vehicle, index) => {
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
                  {vehicleImg ? (
                    <Image source={{ uri: vehicleImg }} style={styles.vehicleImage} />
                  ) : (
                    <View style={styles.fallbackImage}>
                      <Truck size={44} color={COLORS.goldPrimary} />
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
                      <Truck size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>VIN</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {vehicle.vinNumber || 'N/A'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Box size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>Size</AppText>
                        <AppText style={styles.specValue} numberOfLines={1}>
                          {vehicle.stallSize || 'Standard'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Layers size={18} color={COLORS.goldPrimary} />
                      <View style={styles.specBoxTextCol}>
                        <AppText style={styles.specLabel}>Stalls</AppText>
                        <AppText style={styles.specValue}>
                          {vehicle.numberOfStalls ? String(vehicle.numberOfStalls).padStart(2, '0') : '01'}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.specBox}>
                      <Truck size={18} color={COLORS.goldPrimary} />
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
                      <FileText size={18} color={COLORS.goldPrimary} />
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
                      onPress={() => handleOpenAssignDriver(vehicle)}
                    >
                      {assignedDriverName ? (
                        <UserCheck size={15} color={COLORS.goldPrimary} />
                      ) : (
                        <UserPlus size={15} color={COLORS.textPrimary} />
                      )}
                      <AppText
                        style={[
                          styles.actionPillText,
                          assignedDriverName && { color: COLORS.goldPrimary, fontFamily: 'PlusJakartaSans-Bold' },
                        ]}
                      >
                        {assignedDriverName ? `Driver: ${assignedDriverName}` : 'Assign Driver'}
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => handleEdit(vehicle)}
                    >
                      <Edit size={15} color={COLORS.textPrimary} />
                      <AppText style={styles.actionPillText}>Edit</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => handleDeleteVehicle(vehicle._id, vehicle.vehicleNumber)}
                    >
                      <Trash2 size={15} color="#EF4444" />
                      <AppText style={[styles.actionPillText, { color: '#EF4444' }]}>Delete</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Confirmation Modal for Vehicle Deletion */}
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
