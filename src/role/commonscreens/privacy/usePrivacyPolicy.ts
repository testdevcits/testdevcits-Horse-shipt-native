import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import shipperService from '../../../api/services/shipperService';

const usePrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<any>(null);

  const fetchPrivacyPolicy = async () => {
    try {
      const res = await shipperService.getPrivacyPolicy();
      if (res?.success && res.data && res.data?.length > 0) {
        setPolicyData(res?.data[0]);
      }
    } catch (error) {
      console.error('Fetch Privacy Policy Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  return {
    loading,
    policyData,
  };
};

export default usePrivacyPolicy;
