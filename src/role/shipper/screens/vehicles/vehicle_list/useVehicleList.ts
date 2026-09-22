import { useCallback, useEffect, useRef, useState } from 'react';
import { AppSelectRef } from '../../../../../components';
import shipperService from '../../../../../api/services/shipperService';
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '../../../../../utils/toast';

const useVehicleList = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Driver Assignment State
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedVehicleForDriver, setSelectedVehicleForDriver] =
    useState<any>(null);
  const driverSelectRef = useRef<AppSelectRef>(null);

  // Delete Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    id: string;
    vehicleNum: string;
  } | null>(null);
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

  const handleOpenAssignDriver = useCallback(
    async (vehicle: any) => {
      setSelectedVehicleForDriver(vehicle);
      let currentDrivers = drivers;
      if (!currentDrivers || currentDrivers.length === 0) {
        currentDrivers = await fetchDrivers();
      }

      if (!currentDrivers || currentDrivers.length === 0) {
        showInfoToast(
          'No Drivers Found',
          'Please add drivers to your carrier profile first.',
        );
        return;
      }

      driverSelectRef.current?.present();
    },
    [drivers],
  );

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
        showSuccessToast(
          'Success',
          res.message || 'Driver assigned successfully',
        );
        fetchVehicles();
      } else {
        showErrorToast('Error', res?.message || 'Failed to assign driver.');
      }
    } catch (error: any) {
      console.error('Assign Driver Error:', error);
      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.raw?.message ||
        'Failed to assign driver.';

      showErrorToast('Error', errMsg);
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
      const res = await shipperService.deleteVehicle(selectedVehicle?.id);
      if (res?.success) {
        showSuccessToast('Success', 'Vehicle deleted successfully.');
        setDeleteModalVisible(false);
        setSelectedVehicle(null);
        fetchVehicles();
      } else {
        showErrorToast('Error', res?.message || 'Failed to delete vehicle?.');
      }
    } catch (error: any) {
      console.error('Delete Vehicle Error:', error);
      const errMsg =
        error?.message ||
        error?.response?.data?.message ||
        error?.raw?.message ||
        'Failed to delete vehicle?.';

      showErrorToast('Error', errMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNewVehicle = () => {
    navigation.navigate('AddVehicle', {
      onSuccess: fetchVehicles,
    });
  };

  const handleEdit = useCallback(
    (vehicle: any) => {
      navigation.navigate('AddVehicle', {
        vehicleToEdit: vehicle,
        onSuccess: fetchVehicles,
      });
    },
    [navigation],
  );
  return {
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
  };
};

export default useVehicleList;
