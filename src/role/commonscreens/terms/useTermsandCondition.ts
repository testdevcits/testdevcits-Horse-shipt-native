import React, { useEffect, useState } from 'react';
import customerService from '../../../api/services/customerService';

const useTermsandCondition = () => {
  const [loading, setLoading] = useState(true);
  const [termsData, setTermsData] = useState<any>(null);

  const fetchTermsAndConditions = async () => {
    try {
      const res = await customerService.getTermsAndConditions();
      if (res?.success && res.data && res.data?.length > 0) {
        setTermsData(res?.data[0]);
      }
    } catch (error) {
      console.error('Fetch Terms & Conditions Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  return {
    loading,
    termsData,
  };
};

export default useTermsandCondition;
