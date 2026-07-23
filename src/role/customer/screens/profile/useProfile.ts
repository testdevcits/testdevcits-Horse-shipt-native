import { useState, useEffect, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';
import { CustomerProfileData } from '../../../../types/customer';
// Assuming your API service is exported from a file like apiService.ts
 

export const useProfile = () => {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customerService.getProfile();
      
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};