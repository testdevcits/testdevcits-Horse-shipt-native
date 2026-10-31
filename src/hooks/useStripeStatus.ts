import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import shipperService from '../api/services/shipperService';

const useStripeStatus = () => {
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkStripeStatus = useCallback(async () => {
    try {
      setLoading(true);

      const res = await shipperService.getStripeStatus();

      if (res?.success) {
        const needsVerification = res.onboardingCompleted !== true;

        setIsStripeReady(!needsVerification);

        return !needsVerification;
      }

      setIsStripeReady(false);
      return false;
    } catch (error) {
      console.log('Stripe status check error:', error);
      setIsStripeReady(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkStripeStatus();
    }, [checkStripeStatus]),
  );

  return {
    isStripeReady,
    loading,
    checkStripeStatus,
  };
};

export default useStripeStatus;
