import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { MeResponse } from '../types/driver';
import driverService from '../api/services/driverService';
import { useAppDispatch } from './redux';
import { updateUser } from '../redux/slices/authSlice';
import { requestBackgroundLocationPermission, openDeviceSettings } from '../utils/permissionHelper';

export const useDriverMe = () => {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startTripLoading, setStartTripLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationPermissionModalVisible, setIsLocationPermissionModalVisible] = useState<boolean>(false);
  const [locationModalTitle, setLocationModalTitle] = useState<string>('Background Location Mandate');
  const [locationModalMessage, setLocationModalMessage] = useState<string>('Auto-Tracking mandates background location access ("Allow all the time"). Please open system settings to grant location permissions.');
  const dispatch = useAppDispatch();

  const fetchDriverData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await driverService.getMe();
      setData(response);
      if (response?.driver) {
        dispatch(
          updateUser({
            name: response?.driver?.name,
            email: response?.driver?.email,
            profileImage: response?.driver?.profileImage as any,
            phoneNumber: response?.driver?.phone,
            metadata: response?.driver,
          }),
        );
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch driver credentials.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleStartTrip = useCallback(
    async (quoteId: string) => {
      // 1. Mandate Foreground + Background ("Allow all the time") location permissions
      const hasLocationPermission = await requestBackgroundLocationPermission(
        (title: string, message: string) => {
          setLocationModalTitle(title);
          setLocationModalMessage(message);
          setIsLocationPermissionModalVisible(true);
        },
      );

      if (!hasLocationPermission) {
        throw new Error(
          'Location permission ("Allow all the time") is mandated to start trip tracking.',
        );
      }

      setStartTripLoading(true);

      try {
        const response = await driverService.startTrip(quoteId);

        // Refresh driver/shipment data after successfully starting the trip
        await fetchDriverData();

        return response;
      } catch (err: any) {
        throw err;
      } finally {
        setStartTripLoading(false);
      }
    },
    [fetchDriverData],
  );

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  return {
    driver: data?.driver || null,
    vehicle: data?.vehicle || null,
    activeShipment: data?.shipment || null,
    allShipments: data?.allShipments || [],
    loading,
    startTripLoading,
    error,
    refresh: fetchDriverData,
    handleStartTrip,
    isLocationPermissionModalVisible,
    locationModalTitle,
    locationModalMessage,
    closeLocationPermissionModal: () => setIsLocationPermissionModalVisible(false),
  };
};