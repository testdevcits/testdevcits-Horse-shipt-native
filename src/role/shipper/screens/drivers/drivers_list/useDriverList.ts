import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import shipperService from '../../../../../api/services/shipperService';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';

const useDriverList = () => {
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

  const fetchDrivers = useCallback(async () => {
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
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const handleToggleStatus = useCallback(
    async (id: string, currentActiveStatus: boolean) => {
      try {
        const res = await shipperService.toggleDriverStatus(
          id,
          !currentActiveStatus,
        );
        if (res?.success) {
          showSuccessToast(
            'Success',
            `Driver ${
              !currentActiveStatus ? 'activated' : 'deactivated'
            } successfully.`,
          );

          fetchDrivers();
        }
      } catch (error: any) {
        showErrorToast(
          'Error',
          error?.response?.data?.message || 'Failed to update driver status.',
        );
      }
    },
    [fetchDrivers],
  );

  const handleDeleteDriverPrompt = useCallback(
    (id: string, driverName: string) => {
      setSelectedDriverToDelete({ id, name: driverName });
      setDeleteModalVisible(true);
    },
    [],
  );

  const handleConfirmDelete = async () => {
    if (!selectedDriverToDelete) return;
    setIsDeleting(true);
    try {
      const res = await shipperService.deleteDriver(selectedDriverToDelete.id);
      if (res?.success) {
        showSuccessToast('Success', 'Driver deleted successfully.');
        setDeleteModalVisible(false);
        setSelectedDriverToDelete(null);
        fetchDrivers();
      }
    } catch (error: any) {
      showErrorToast(
        'Error',
        error?.response?.data?.message || 'Failed to delete driver.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditDriver = useCallback((driver: any) => {
    setSelectedDriverToEdit(driver);
    setIsAddModalVisible(true);
  }, []);

  const totalCount = drivers.length;
  const activeCount = drivers.filter(d => d?.isActive ?? true).length;
  const inactiveCount = totalCount - activeCount;

  return {
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
  };
};

export default useDriverList;
