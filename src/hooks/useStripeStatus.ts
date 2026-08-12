import { useCallback, useEffect, useState } from 'react';
import shipperService from '../api/services/shipperService';

const useStripeStatus = () => {
    const [isStripeReady, setIsStripeReady] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkStripeStatus = useCallback(async () => {
        try {
            setLoading(true);

            const res = await shipperService.getStripeStatus();

            if (res?.success) {
                const needsVerification =
                    res.needsVerification === true ||
                    res.onboardingCompleted === false ||
                    res.chargesEnabled === false ||
                    res.payoutsEnabled === false ||
                    res.verified === false;

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

    useEffect(() => {
        checkStripeStatus();
    }, [checkStripeStatus]);

    return {
        isStripeReady,
        loading,
        checkStripeStatus,
    };
};

export default useStripeStatus;