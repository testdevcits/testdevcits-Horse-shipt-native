import { useCallback, useEffect, useState } from 'react';
import customerService from '../../../../api/services/customerService';
import { CustomerProfileData } from '../../../../types/customer';

export const useProfile = () => {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerService.getProfile();
      if (response.success) setProfile(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProfile = async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      setIsUpdating(true);
      const response = await customerService.updateProfile(payload);
      if (response.success) {
        await fetchProfile(); // Refresh data
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    isUpdating,
    error,
    refetch: fetchProfile,
    updateProfile: handleUpdateProfile,
  };
};
