import { useState, useEffect, useCallback } from 'react';
import { MeResponse } from '../types/driver';
import driverService from '../api/services/driverService';
import { useAppDispatch } from './redux';
import { updateUser } from '../redux/slices/authSlice';

export const useDriverMe = () => {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startTripLoading, setStartTripLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
            name: response.driver.name,
            email: response.driver.email,
            profileImage: response.driver.profileImage as any,
            phoneNumber: response.driver.phone,
            metadata: response.driver,
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
  };
};